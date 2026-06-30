import { EventList } from './event-list';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';

describe('EventList', () => {
  let component: EventList;
  let eventService: any;
  let router: any;

  const mockEvents = [
    {
      id: 1,
      title: 'Test Event 1',
      description: 'Description 1',
      eventDate: new Date('2025-12-31'),
      location: 'Location 1',
      capacity: 100,
      seatsAvailable: 50
    },
    {
      id: 2,
      title: 'Test Event 2',
      description: 'Description 2',
      eventDate: new Date('2025-11-30'),
      location: 'Location 2',
      capacity: 200,
      seatsAvailable: 150
    }
  ];

  beforeEach(() => {
    const mockObservable = {
      subscribe: (observer: any) => {
        observer.next([]);
        return { unsubscribe: () => {} };
      }
    };
    eventService = { getEvents: vi.fn().mockReturnValue(mockObservable) };
    router = { navigate: vi.fn() };

    component = new EventList(eventService, router as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading state', () => {
    expect(component.isLoading).toBe(true);
    expect(component.events.length).toBe(0);
    expect(component.errorMessage).toBe('');
  });

  describe('ngOnInit', () => {
    it('should call loadAllEvents on init', () => {
      const mockObservable = {
        subscribe: (observer: any) => {
          observer.next([]);
          return { unsubscribe: () => {} };
        }
      };
      eventService.getEvents.mockReturnValue(mockObservable as any);
      
      component.ngOnInit();
      expect(eventService.getEvents).toHaveBeenCalled();
    });
  });

  describe('loadAllEvents', () => {
    it('should load events successfully', async () => {
      eventService.getEvents.mockReturnValue({
        subscribe: (observer: any) => {
          observer.next(mockEvents);
          return { unsubscribe: () => {} };
        }
      } as any);

      component.loadAllEvents();

      expect(component.isLoading).toBe(false);
      expect(component.events.length).toBe(2);
      expect(component.events[0].title).toBe('Test Event 1');
      expect(component.errorMessage).toBe('');
    });

    it('should handle error when loading events', async () => {
      eventService.getEvents.mockReturnValue({
        subscribe: (observer: any) => {
          observer.error(new Error('Server error'));
          return { unsubscribe: () => {} };
        }
      } as any);

      component.loadAllEvents();

      expect(component.isLoading).toBe(false);
      expect(component.errorMessage).toBe('Failed to load events. Please try again later.');
      expect(component.events.length).toBe(0);
    });

    it('should set loading state before fetching', () => {
      eventService.getEvents.mockReturnValue({
        subscribe: (observer: any) => {
          expect(component.isLoading).toBe(true);
          observer.next(mockEvents);
          return { unsubscribe: () => {} };
        }
      } as any);

      component.loadAllEvents();
    });

    it('should call EventService.getEvents', () => {
      eventService.getEvents.mockReturnValue({
        subscribe: (observer: any) => {
          observer.next(mockEvents);
          return { unsubscribe: () => {} };
        }
      } as any);

      component.loadAllEvents();
      expect(eventService.getEvents).toHaveBeenCalled();
    });
  });

  describe('viewEventDetails', () => {
    it('should navigate to event details page', () => {
      component.viewEventDetails(1);
      expect(router.navigate).toHaveBeenCalledWith(['/events', 1]);
    });

    it('should navigate with correct event id', () => {
      component.viewEventDetails(42);
      expect(router.navigate).toHaveBeenCalledWith(['/events', 42]);
    });
  });

  describe('template rendering', () => {
    it('should render loading state', () => {
      component.isLoading = true;
      expect(component.isLoading).toBe(true);
    });

    it('should render error state with retry button', () => {
      component.isLoading = false;
      component.errorMessage = 'Test error';
      expect(component.errorMessage).toBe('Test error');
    });

    it('should render events grid when loaded', () => {
      component.isLoading = false;
      component.events = mockEvents;
      expect(component.events.length).toBe(2);
    });

    it('should render event items', () => {
      component.isLoading = false;
      component.events = mockEvents;
      expect(component.events.length).toBe(2);
    });

    it('should render empty state when no events', () => {
      component.isLoading = false;
      component.events = [];
      expect(component.events.length).toBe(0);
    });

    it('should pass event data to event-item component', () => {
      component.isLoading = false;
      component.events = mockEvents;
      expect(component.events[0].title).toBe('Test Event 1');
    });
  });

  describe('retry functionality', () => {
    it('should call loadAllEvents when retry button is clicked', () => {
      component.isLoading = false;
      component.errorMessage = 'Error';
      
      vi.spyOn(component, 'loadAllEvents');
      
      component.loadAllEvents();
      
      expect(component.loadAllEvents).toHaveBeenCalled();
    });
  });
});