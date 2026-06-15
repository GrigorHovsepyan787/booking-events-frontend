import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EventItemComponent } from '../../components/event-item/event-item';
import { EventResponse } from '../../models/event.response';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [EventItemComponent],
  templateUrl: './event-list.html',
  styleUrls: ['./event-list.css'],
})
export class EventList implements OnInit {
  private eventService = inject(EventService);
  private router = inject(Router);

  protected events: EventResponse[] = [];
  protected isLoading = true;
  protected errorMessage = '';

  ngOnInit(): void {
    this.loadAllEvents();
  }
  
  private loadAllEvents(): void {
    this.isLoading = true;
    this.eventService.getEvents().subscribe({
      next: (data: EventResponse[]) => {
        this.events = data;
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error('Error while loading events:', err);
        this.errorMessage = 'Failed to load events. Please try again later.';
        this.isLoading = false;
      }
    });
  }
  protected viewEventDetails(eventId: number): void {
    this.router.navigate(['/events', eventId]);
  }
}
