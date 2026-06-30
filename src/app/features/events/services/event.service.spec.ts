import { EventService } from './event.service';
import { EventResponse } from '../models/event.response';
import { CreateEventRequest } from '../models/create-event.request';
import { HttpClient } from '@angular/common/http';

describe('EventService', () => {
  let service: EventService;
  let mockHttp: any;

  const mockEventResponse: EventResponse = {
    id: 1,
    title: 'Test Event',
    description: 'Test Description',
    eventDate: new Date('2025-12-31'),
    location: 'Test Location',
    capacity: 100,
    seatsAvailable: 50
  };

  const mockEventsResponse: EventResponse[] = [
    mockEventResponse,
    {
      id: 2,
      title: 'Another Event',
      description: 'Another Description',
      eventDate: new Date('2025-11-30'),
      location: 'Another Location',
      capacity: 200,
      seatsAvailable: 150
    }
  ];

  const mockCreateEventRequest: CreateEventRequest = {
    title: 'New Event',
    description: 'New Description',
    eventDate: '2025-12-25T10:00',
    location: 'New Location',
    capacity: 50
  };

  beforeEach(() => {
    mockHttp = {
      get: () => ({ subscribe: (cb: any) => cb(mockEventsResponse) }),
      post: () => ({ subscribe: (cb: any) => cb(mockEventResponse) }),
      put: () => ({ subscribe: (cb: any) => cb(mockEventResponse) }),
      delete: () => ({ subscribe: (cb: any) => cb(undefined) })
    };
    service = new EventService(mockHttp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEvents', () => {
    it('should return an observable of event responses', () => {
      service.getEvents().subscribe((events: EventResponse[]) => {
        expect(events).toEqual(mockEventsResponse);
        expect(events.length).toBe(2);
      });
    });

    it('should handle error when fetching events', () => {
      mockHttp = {
        get: () => ({ subscribe: (cb: any) => cb.error(new Error('Server error')) })
      };
      service = new EventService(mockHttp);
      
      service.getEvents().subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('getUserEvents', () => {
    it('should return an observable of user events', () => {
      mockHttp = {
        get: () => ({ subscribe: (cb: any) => cb(mockEventsResponse) })
      };
      service = new EventService(mockHttp);
      
      service.getUserEvents().subscribe((events: EventResponse[]) => {
        expect(events).toEqual(mockEventsResponse);
        expect(events.length).toBe(2);
      });
    });

    it('should handle error when fetching user events', () => {
      mockHttp = {
        get: () => ({ subscribe: (cb: any) => cb.error(new Error('Unauthorized')) })
      };
      service = new EventService(mockHttp);
      
      service.getUserEvents().subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('getEventById', () => {
    it('should return a single event by id', () => {
      mockHttp = {
        get: () => ({ subscribe: (cb: any) => cb(mockEventResponse) })
      };
      service = new EventService(mockHttp);
      
      service.getEventById(1).subscribe((event: EventResponse) => {
        expect(event).toEqual(mockEventResponse);
        expect(event.id).toBe(1);
      });
    });

    it('should handle 404 error when event not found', () => {
      mockHttp = {
        get: () => ({ subscribe: (cb: any) => cb.error(new Error('Not found')) })
      };
      service = new EventService(mockHttp);
      
      service.getEventById(999).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('createEvent', () => {
    it('should create a new event and return the response', () => {
      mockHttp = {
        post: () => ({ subscribe: (cb: any) => cb(mockEventResponse) })
      };
      service = new EventService(mockHttp);
      
      service.createEvent(mockCreateEventRequest).subscribe((event: EventResponse) => {
        expect(event).toEqual(mockEventResponse);
      });
    });

    it('should handle validation errors', () => {
      mockHttp = {
        post: () => ({ subscribe: (cb: any) => cb.error(new Error('Validation error')) })
      };
      service = new EventService(mockHttp);
      
      const invalidRequest = { ...mockCreateEventRequest, title: '' };
      service.createEvent(invalidRequest).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('updateEvent', () => {
    it('should update an existing event and return the response', () => {
      mockHttp = {
        put: () => ({ subscribe: (cb: any) => cb(mockEventResponse) })
      };
      service = new EventService(mockHttp);
      
      const updateRequest = { ...mockCreateEventRequest, title: 'Updated Event' };
      service.updateEvent(1, updateRequest).subscribe((event: EventResponse) => {
        expect(event).toEqual(mockEventResponse);
      });
    });

    it('should handle error when updating event', () => {
      mockHttp = {
        put: () => ({ subscribe: (cb: any) => cb.error(new Error('Update failed')) })
      };
      service = new EventService(mockHttp);
      
      service.updateEvent(1, mockCreateEventRequest).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event by id', () => {
      mockHttp = {
        delete: () => ({ subscribe: (cb: any) => cb(undefined) })
      };
      service = new EventService(mockHttp);
      
      service.deleteEvent(1).subscribe(() => {
        // Success callback
      });
    });

    it('should handle error when deleting event', () => {
      mockHttp = {
        delete: () => ({ subscribe: (cb: any) => cb.error(new Error('Delete failed')) })
      };
      service = new EventService(mockHttp);
      
      service.deleteEvent(1).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('searchEventsByTitle', () => {
    it('should search events by title with query parameter', () => {
      mockHttp = {
        get: () => ({ subscribe: (cb: any) => cb([mockEventResponse]) })
      };
      service = new EventService(mockHttp);
      
      const searchQuery = 'Test';
      service.searchEventsByTitle(searchQuery).subscribe((events: EventResponse[]) => {
        expect(events).toEqual([mockEventResponse]);
        expect(events.length).toBe(1);
      });
    });

    it('should handle empty search results', () => {
      mockHttp = {
        get: () => ({ subscribe: (cb: any) => cb([]) })
      };
      service = new EventService(mockHttp);
      
      service.searchEventsByTitle('NonexistentEvent').subscribe((events: EventResponse[]) => {
        expect(events).toEqual([]);
        expect(events.length).toBe(0);
      });
    });

    it('should handle error when searching events', () => {
      mockHttp = {
        get: () => ({ subscribe: (cb: any) => cb.error(new Error('Search failed')) })
      };
      service = new EventService(mockHttp);
      
      service.searchEventsByTitle('Test').subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });
  });
});
