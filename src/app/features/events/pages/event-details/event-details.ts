import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { EventService } from '../../services/event.service';
import { EventResponse } from '../../models/event.response';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css',
})
export class EventDetails implements OnInit{
  private eventService = inject(EventService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected event!: EventResponse; 
  protected isLoading = true;
  protected errorMessage = '';

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      const eventId = Number(idParam); 
      this.loadEventDetails(eventId);
    } else {
      this.errorMessage = 'Incorrect event ID.';
      this.isLoading = false;
    }
  }

  private loadEventDetails(id: number): void {
    this.isLoading = true;
    
    this.eventService.getEventById(id).subscribe({
      next: (data: EventResponse) => {
        this.event = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error occurred while fetching the event:', err);
        this.errorMessage = 'Event not found or server is unavailable.';
        this.isLoading = false;
      }
    });
  }

  protected registerForEvent(): void {
    alert(`You have successfully registered for: ${this.event.title}`);
  }
}
