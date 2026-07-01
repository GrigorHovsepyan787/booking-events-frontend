import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { EventItemComponent } from '../../components/event-item/event-item';
import { EventResponse } from '../../models/event.response';
import { EventService } from '../../services/event.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [EventItemComponent],
  templateUrl: `event-list.html`,
  styleUrl: `event-list.css`
})
export class EventList implements OnInit {
  constructor(private eventService: EventService, private router: Router) {}

  public events: EventResponse[] = [];
  public isLoading = true;
  public errorMessage = '';
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAllEvents();
    } else {}
  }
  
  protected loadAllEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.eventService.getEvents().subscribe({
      next: (pageData) => {
        this.events = pageData.content;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: unknown) => {
        console.error('Error while loading events:', err);
        this.errorMessage = 'Failed to load events. Please try again later.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
  protected viewEventDetails(eventId: number): void {
    this.router.navigate(['/events', eventId]);
  }
}
