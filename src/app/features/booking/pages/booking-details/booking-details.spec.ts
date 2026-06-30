import { BookingDetailsComponent } from './booking-details';
import { BookingService } from '../../services/booking.service';
import { EventService } from '../../../events/services/event.service';
import { ActivatedRoute } from '@angular/router';

describe('BookingDetailsComponent', () => {
  let component: BookingDetailsComponent;
  let bookingService: any;
  let eventService: any;
  let route: any;

  beforeEach(() => {
    bookingService = {};
    eventService = {};
    route = { snapshot: { paramMap: { get: () => '1' } } };

    component = new BookingDetailsComponent(bookingService, eventService, route);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
