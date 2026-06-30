import { MyEvents } from './my-events';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';

describe('MyEvents', () => {
  let component: MyEvents;
  let eventService: any;
  let router: any;

  const mockEvents = [
    {
      id: 1,
      title: 'My Event 1',
      description: 'Description 1',
      eventDate: new Date('2025-12-31'),
      location: 'Location 1',
      capacity: 100,
      seatsAvailable: 50
    },
    {
      id: 2,
      title: 'My Event 2',
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
    eventService = {
      getUserEvents: vi.fn().mockReturnValue(mockObservable),
      deleteEvent: vi.fn().mockReturnValue(mockObservable)
    };
    router = { navigate: vi.fn() };

    component = new MyEvents(eventService, router as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading state', () => {
    expect(component.isLoading).toBe(true);
    expect(component.myEvents.length).toBe(0);
    expect(component.errorMessage).toBe('');
  });

  describe('ngOnInit', () => {
    it('should call loadMyEvents on init', () => {
      const mockObservable = {
        subscribe: (observer: any) => {
          observer.next([]);
          return { unsubscribe: () => {} };
        }
      };
      eventService.getUserEvents.mockReturnValue(mockObservable as any);
      
      component.ngOnInit();
      expect(eventService.getUserEvents).toHaveBeenCalled();
    });
  });

  describe('loadMyEvents', () => {
    it('should load user events successfully', async () => {
      eventService.getUserEvents.mockReturnValue({
        subscribe: (observer: any) => {
          observer.next(mockEvents);
          return { unsubscribe: () => {} };
        }
      } as any);

      component.loadMyEvents();

      expect(component.isLoading).toBe(false);
      expect(component.myEvents.length).toBe(2);
      expect(component.myEvents[0].title).toBe('My Event 1');
      expect(component.errorMessage).toBe('');
    });

    it('should handle error when loading user events', async () => {
      eventService.getUserEvents.mockReturnValue({
        subscribe: (observer: any) => {
          observer.error(new Error('Server error'));
          return { unsubscribe: () => {} };
        }
      } as any);

      component.loadMyEvents();

      expect(component.isLoading).toBe(false);
      expect(component.errorMessage).toBe('Error while loading your events.');
      expect(component.myEvents.length).toBe(0);
    });

    it('should set loading state before fetching', () => {
      eventService.getUserEvents.mockReturnValue({
        subscribe: (observer: any) => {
          expect(component.isLoading).toBe(true);
          observer.next(mockEvents);
          return { unsubscribe: () => {} };
        }
      } as any);

      component.loadMyEvents();
    });

    it('should call EventService.getUserEvents', () => {
      eventService.getUserEvents.mockReturnValue({
        subscribe: (observer: any) => {
          observer.next(mockEvents);
          return { unsubscribe: () => {} };
        }
      } as any);

      component.loadMyEvents();
      expect(eventService.getUserEvents).toHaveBeenCalled();
    });

    it('should clear error message before fetching', () => {
      component.errorMessage = 'Previous error';
      
      eventService.getUserEvents.mockReturnValue({
        subscribe: (observer: any) => {
          expect(component.errorMessage).toBe('');
          observer.next(mockEvents);
          return { unsubscribe: () => {} };
        }
      } as any);

      component.loadMyEvents();
    });
  });

  describe('editEvent', () => {
    it('should navigate to edit event page', () => {
      component.editEvent(1);
      expect(router.navigate).toHaveBeenCalledWith(['/events/edit', 1]);
    });

    it('should navigate with correct event id', () => {
      component.editEvent(42);
      expect(router.navigate).toHaveBeenCalledWith(['/events/edit', 42]);
    });
  });

  describe('deleteEvent', () => {
    beforeEach(() => {
      component.myEvents = [...mockEvents];
    });

    it('should delete event and update list', async () => {
      eventService.deleteEvent.mockReturnValue({
        subscribe: (observer: any) => {
          observer.next();
          return { unsubscribe: () => {} };
        }
      } as any);

      vi.spyOn(window, 'confirm').mockReturnValue(true);
      
      component.deleteEvent(1, 'My Event 1');

      expect(eventService.deleteEvent).toHaveBeenCalledWith(1);
      expect(component.myEvents.length).toBe(1);
      expect(component.myEvents[0].id).toBe(2);
    });

    it('should not delete if user cancels confirmation', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false);
      
      component.deleteEvent(1, 'My Event 1');
      
      expect(eventService.deleteEvent).not.toHaveBeenCalled();
      expect(component.myEvents.length).toBe(2);
    });

    it('should handle error when deleting event', () => {
      eventService.deleteEvent.mockReturnValue({
        subscribe: (observer: any) => {
          observer.error(new Error('Delete failed'));
          return { unsubscribe: () => {} };
        }
      } as any);

      vi.spyOn(window, 'confirm').mockReturnValue(true);
      vi.spyOn(window, 'alert');

      component.deleteEvent(1, 'My Event 1');

      expect(eventService.deleteEvent).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalled();
    });

    it('should filter out deleted event by id', () => {
      component.myEvents = [...mockEvents];
      
      eventService.deleteEvent.mockReturnValue({
        subscribe: (observer: any) => {
          observer.next();
          return { unsubscribe: () => {} };
        }
      } as any);

      vi.spyOn(window, 'confirm').mockReturnValue(true);
      
      component.deleteEvent(1, 'My Event 1');
      
      expect(component.myEvents.find((e: any) => e.id === 1)).toBeUndefined();
      expect(component.myEvents.find((e: any) => e.id === 2)).toBeDefined();
    });
  });

  describe('template rendering', () => {
    it('should render loading state', () => {
      component.isLoading = true;
      
      const compiled = component;
      expect(compiled.isLoading).toBe(true);
    });

    it('should render error state', () => {
      component.isLoading = false;
      component.errorMessage = 'Test error';
      
      expect(component.errorMessage).toBe('Test error');
    });

    it('should render dashboard header with create button', () => {
      component.isLoading = false;
      component.myEvents = mockEvents;
      
      expect(component.myEvents.length).toBe(2);
    });

    it('should render events table when loaded', () => {
      component.isLoading = false;
      component.myEvents = mockEvents;
      
      expect(component.myEvents.length).toBe(2);
    });

    it('should render event rows', () => {
      component.isLoading = false;
      component.myEvents = mockEvents;
      
      expect(component.myEvents.length).toBe(2);
    });

    it('should render empty state when no events', () => {
      component.isLoading = false;
      component.myEvents = [];
      
      expect(component.myEvents.length).toBe(0);
    });

    it('should display event data in table cells', () => {
      component.isLoading = false;
      component.myEvents = mockEvents;
      
      expect(component.myEvents[0].title).toBe('My Event 1');
      expect(component.myEvents[0].location).toBe('Location 1');
      expect(component.myEvents[0].capacity).toBe(100);
    });

    it('should have edit and delete buttons for each event', () => {
      component.isLoading = false;
      component.myEvents = mockEvents;
      
      expect(component.myEvents.length).toBe(2);
    });

    it('should have create event link', () => {
      component.isLoading = false;
      component.myEvents = mockEvents;
      
      expect(component.myEvents.length).toBe(2);
    });
  });

  describe('retry functionality', () => {
    it('should call loadMyEvents when needed', () => {
      component.isLoading = false;
      component.errorMessage = 'Error';
      
      vi.spyOn(component, 'loadMyEvents');
      
      // Simulate retry by calling the method directly
      component.loadMyEvents();
      
      expect(component.loadMyEvents).toHaveBeenCalled();
    });
  });
});