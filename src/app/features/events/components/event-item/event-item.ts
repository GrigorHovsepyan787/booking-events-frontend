import { Component, Input, EventEmitter, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EventResponse } from '../../models/event.response';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.html',
  imports: [DatePipe],
  styleUrl: './event-item.css',
})
export class EventItemComponent {
  @Input({ required: true }) event!: EventResponse;
  @Output() eventSelected = new EventEmitter<EventResponse>();
  getEventById(id: number): void {
    this.eventSelected.emit(this.event);
  }
}
  