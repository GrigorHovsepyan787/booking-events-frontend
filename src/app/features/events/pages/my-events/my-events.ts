import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventResponse } from '../../models/event.response';
import { EventService } from '../../services/event.service';


@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [],
  templateUrl: './my-events.html',
  styleUrl: './my-events.css'
})
export class MyEvents implements OnInit {
  constructor(private eventService: EventService, private router: Router) {}

  public myEvents: EventResponse[] = [];
  public isLoading = true;
  public errorMessage = '';

  ngOnInit(): void {
    this.loadMyEvents();
  }
  
  public loadMyEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.eventService.getUserEvents().subscribe({
      next: (data: EventResponse[]) => {
        this.myEvents = data;
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error('Error while loading your events:', err);
        this.errorMessage = 'Error while loading your events.';
        this.isLoading = false;
      }
    });
  }

  deleteEvent(id: number, title: string): void {
    if (confirm(`Are you sure you want to delete the event "${title}"?`)) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          this.myEvents = this.myEvents.filter(event => event.id !== id);
          console.log(`Event ${id} successfully deleted.`);
        },
        error: (err) => {
          alert('Failed to delete the event. Perhaps people are already registered for it.');
        }
      });
    }
  }

  editEvent(id: number): void {
    this.router.navigate(['/events/edit', id]);
  }
}
