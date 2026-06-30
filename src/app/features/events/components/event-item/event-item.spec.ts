import { EventItemComponent } from './event-item';
import { EventResponse } from '../../models/event.response';

describe('EventItemComponent', () => {
  let component: EventItemComponent;

  beforeEach(() => {
    component = new EventItemComponent();
    component.event = {
      id: 1,
      title: 'Test Event',
      description: 'Test Description',
      eventDate: new Date('2024-01-01'),
      location: 'Test Location',
      capacity: 100,
      seatsAvailable: 50,
    } as EventResponse;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event when onViewDetails is called', () => {
    const emitSpy = vi.fn();
    component.eventSelected.subscribe(emitSpy);
    component.onViewDetails();
    expect(emitSpy).toHaveBeenCalledWith(component.event);
  });
});
