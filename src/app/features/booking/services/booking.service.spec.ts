import { BookingService } from './booking.service';
import { BookingResponse } from '../models/booking.response';
import { HttpClient } from '@angular/common/http';

describe('BookingService', () => {
  let service: BookingService;
  let mockHttp: any;

  const mockBookingResponse: BookingResponse = {
    id: 1,
    eventId: 100,
    status: 'CONFIRMED'
  };

  const mockBookingsResponse: BookingResponse[] = [
    mockBookingResponse,
    {
      id: 2,
      eventId: 101,
      status: 'PENDING'
    }
  ];

  beforeEach(() => {
    mockHttp = {
      get: () => ({ subscribe: (cb: any) => cb(mockBookingsResponse) }),
      post: () => ({ subscribe: (cb: any) => cb(mockBookingResponse) }),
      delete: () => ({ subscribe: (cb: any) => cb(undefined) })
    };
    service = new BookingService(mockHttp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBookings', () => {
    it('should return an observable of booking responses', () => {
      service.getBookings().subscribe((bookings: BookingResponse[]) => {
        expect(bookings).toEqual(mockBookingsResponse);
        expect(bookings.length).toBe(2);
      });
    });

    it('should handle error when fetching bookings', () => {
      mockHttp = {
        get: () => ({ subscribe: (cb: any) => cb.error(new Error('Server error')) })
      };
      service = new BookingService(mockHttp);
      
      service.getBookings().subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('getBookingById', () => {
    it('should return a single booking by id', () => {
      mockHttp = {
        get: () => ({ subscribe: (cb: any) => cb(mockBookingResponse) })
      };
      service = new BookingService(mockHttp);
      
      service.getBookingById(1).subscribe((booking: BookingResponse) => {
        expect(booking).toEqual(mockBookingResponse);
        expect(booking.id).toBe(1);
      });
    });

    it('should handle 404 error when booking not found', () => {
      mockHttp = {
        get: () => ({ subscribe: (cb: any) => cb.error(new Error('Not found')) })
      };
      service = new BookingService(mockHttp);
      
      service.getBookingById(999).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('createBooking', () => {
    it('should create a new booking and return the response', () => {
      const newBooking = { eventId: 100 };
      
      service.createBooking(newBooking).subscribe((booking: BookingResponse) => {
        expect(booking).toEqual(mockBookingResponse);
      });
    });

    it('should handle validation errors', () => {
      mockHttp = {
        post: () => ({ subscribe: (cb: any) => cb.error(new Error('Validation error')) })
      };
      service = new BookingService(mockHttp);
      
      service.createBooking({} as any).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('deleteBooking', () => {
    it('should delete a booking by id', () => {
      mockHttp = {
        delete: () => ({ subscribe: (cb: any) => cb(undefined) })
      };
      service = new BookingService(mockHttp);
      
      service.deleteBooking(1).subscribe(() => {
        // Success callback
      });
    });

    it('should handle error when deleting booking', () => {
      mockHttp = {
        delete: () => ({ subscribe: (cb: any) => cb.error(new Error('Delete failed')) })
      };
      service = new BookingService(mockHttp);
      
      service.deleteBooking(1).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });
  });
});
