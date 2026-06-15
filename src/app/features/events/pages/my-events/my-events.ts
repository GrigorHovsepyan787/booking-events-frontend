import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EventItemComponent } from '../../components/event-item/event-item';
import { EventResponse } from '../../models/event.response';
import { EventService } from '../../services/event.service';


@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [],
  templateUrl: './my-events.html',
  styleUrl: './my-events.css',
})
export class MyEvents implements OnInit {
  private eventService = inject(EventService);
  private router = inject(Router);

  protected myEvents: EventResponse[] = [];
  protected isLoading = true;
  protected errorMessage = '';

  ngOnInit(): void {
    this.loadUserEvents();
  }
  
  loadUserEvents(): void {
    this.isLoading = true;
    this.eventService.getUserEvents().subscribe({
      next: (data) => {
        this.myEvents = data;
        this.isLoading = false;
      },
      error: (err) => {
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
