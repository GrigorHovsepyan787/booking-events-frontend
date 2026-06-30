import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventResponse } from '../../models/event.response';

@Component({
  selector: 'app-event-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="event-item">
      <div class="event-item__header">
        <h3 class="event-item__title">{{ event.title }}</h3>
        <span class="event-item__date">{{ event.eventDate | date: 'mediumDate' }}</span>
        <button type="button" (click)="onViewDetails()">View Details</button>
      </div>
    </div>
  `,
  styles: [`
    .event-item { border: 1px solid #ddd; padding: 16px; border-radius: 4px; }
    .event-item__header { display: flex; justify-content: space-between; align-items: center; }
    .event-item__title { margin: 0; }
    .event-item__date { color: #666; }
  `],
})
export class EventItemComponent {
  @Input({ required: true }) event!: EventResponse;
  @Output() eventSelected = new EventEmitter<EventResponse>();

  public onViewDetails(): void {
    this.eventSelected.emit(this.event);
  }
}
  