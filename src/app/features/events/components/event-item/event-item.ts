import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventResponse } from '../../models/event.response';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-event-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: `event-item.html`,
  styleUrl: `event-item.css`
})
export class EventItemComponent {
  @Input({ required: true }) event!: EventResponse;
  @Output() eventSelected = new EventEmitter<EventResponse>();

  public onViewDetails(): void {
    this.eventSelected.emit(this.event);
  }
}
  