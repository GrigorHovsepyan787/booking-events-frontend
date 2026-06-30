import { EventDetails } from './event-details';
import { EventService } from '../../services/event.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

describe('EventDetails', () => {
  let component: EventDetails;
  let eventService: any;
  let route: any;
  let router: any;

  beforeEach(() => {
    eventService = {};
    route = { snapshot: { paramMap: { get: () => '1' } } };
    router = {};

    component = new EventDetails(eventService, route, router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
