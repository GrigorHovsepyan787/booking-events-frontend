import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventItemComponent } from '../../components/event-item/event-item';
import { EventResponse } from '../../models/event.response';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [EventItemComponent],
  template: `
    <div class="page-container">
      <header class="page-header">
        <h1>Upcoming events</h1>
        <p class="page-subtitle">Find interesting events and book your place</p>
      </header>

      @if (isLoading) {
        <div class="loading-shimmer">
          <p>Loading events...</p>
        </div>
      } 
      
      @else if (errorMessage) {
        <div class="error-banner">
          <p>{{ errorMessage }}</p>
          <button type="button" (click)="loadAllEvents()">Try again</button>
        </div>
      } 
      
      @else {
        <div class="events-grid">
          @for (item of events; track item.id) {
            <app-event-item 
              [event]="item"
              (eventSelected)="viewEventDetails(item.id)">
            </app-event-item>
          } 
          @empty {
            <div class="empty-state">
              <p>There are no upcoming events at the moment. Be the first to create one!</p>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { padding: 20px; }
    .page-header { margin-bottom: 20px; }
    .loading-shimmer { padding: 40px; text-align: center; }
    .error-banner { padding: 20px; text-align: center; color: red; }
    .events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .empty-state { padding: 40px; text-align: center; }
  `],
})
export class EventList implements OnInit {
  constructor(private eventService: EventService, private router: Router) {}

  public events: EventResponse[] = [];
  public isLoading = true;
  public errorMessage = '';

  ngOnInit(): void {
    this.loadAllEvents();
  }
  
  protected loadAllEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';
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
