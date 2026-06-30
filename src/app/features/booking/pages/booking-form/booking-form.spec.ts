import { BookingFormComponent } from './booking-form';
import { EventService } from '../../../events/services/event.service';
import { BookingService } from '../../services/booking.service';
import { Router } from '@angular/router';

describe('BookingFormComponent', () => {
  let component: BookingFormComponent;
  let eventService: any;
  let bookingService: any;
  let router: any;

  beforeEach(() => {
    eventService = {};
    bookingService = {};
    router = { navigate: () => {} };

    component = new BookingFormComponent(eventService, bookingService, router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
