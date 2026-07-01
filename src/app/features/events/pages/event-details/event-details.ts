import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { EventService } from '../../services/event.service';
import { EventResponse } from '../../models/event.response';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css',
})
export class EventDetails implements OnInit{
  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  protected event!: EventResponse; 
  protected isLoading = true;
  protected errorMessage = '';
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        const eventId = Number(idParam); 
        this.loadEventDetails(eventId);
      } else {
        this.errorMessage = 'Incorrect event ID.';
        this.isLoading = false;
      }
    }else{
        this.isLoading = true;
      }
  }

  private loadEventDetails(id: number): void {
    this.isLoading = true;
    
    this.eventService.getEventById(id).subscribe({
      next: (data: EventResponse) => {
        this.event = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error occurred while fetching the event:', err);
        this.errorMessage = 'Event not found or server is unavailable.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  protected registerForEvent(): void {
    alert(`You have successfully registered for: ${this.event.title}`);
  }
}
