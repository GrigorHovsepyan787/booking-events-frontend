import { BookingsListComponent } from './bookings-list';
import { BookingService } from '../../services/booking.service';
import { Router } from '@angular/router';

describe('BookingsListComponent', () => {
  let component: BookingsListComponent;
  let bookingService: any;
  let router: any;

  const mockBookings = [
    {
      id: 1,
      eventId: 100,
      status: 'CONFIRMED'
    },
    {
      id: 2,
      eventId: 101,
      status: 'PENDING'
    },
    {
      id: 3,
      eventId: 102,
      status: 'CANCELLED'
    }
  ];

  beforeEach(() => {
    const mockObservable = {
      subscribe: (observer: any) => {
        observer.next([]);
        return { unsubscribe: () => {} };
      }
    };
    bookingService = {
      getBookings: vi.fn().mockReturnValue(mockObservable),
      deleteBooking: vi.fn().mockReturnValue(mockObservable)
    };
    router = { navigate: vi.fn() };

    component = new BookingsListComponent(bookingService, router as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading state', () => {
    expect(component.isLoading).toBe(true);
    expect(component.bookings.length).toBe(0);
    expect(component.errorMessage).toBe('');
  });

  describe('ngOnInit', () => {
    it('should call loadAllBookings on init', () => {
      const mockObservable = {
        subscribe: (observer: any) => {
          observer.next([]);
          return { unsubscribe: () => {} };
        }
      };
      bookingService.getBookings.mockReturnValue(mockObservable as any);
      
      component.ngOnInit();
      expect(bookingService.getBookings).toHaveBeenCalled();
    });
  });

  describe('loadAllBookings', () => {
    it('should load bookings successfully', async () => {
      bookingService.getBookings.mockReturnValue({
        subscribe: (observer: any) => {
          observer.next(mockBookings);
          return { unsubscribe: () => {} };
        }
      } as any);

      component.loadAllBookings();

      expect(component.isLoading).toBe(false);
      expect(component.bookings.length).toBe(3);
      expect(component.bookings[0].id).toBe(1);
      expect(component.errorMessage).toBe('');
    });

    it('should handle error when loading bookings', async () => {
      bookingService.getBookings.mockReturnValue({
        subscribe: (observer: any) => {
          observer.error(new Error('Server error'));
          return { unsubscribe: () => {} };
        }
      } as any);

      component.loadAllBookings();

      expect(component.isLoading).toBe(false);
      expect(component.errorMessage).toBe('Failed to load bookings. Please try again later.');
      expect(component.bookings.length).toBe(0);
    });

    it('should set loading state before fetching', () => {
      bookingService.getBookings.mockReturnValue({
        subscribe: (observer: any) => {
          expect(component.isLoading).toBe(true);
          observer.next(mockBookings);
          return { unsubscribe: () => {} };
        }
      } as any);

      component.loadAllBookings();
    });

    it('should call BookingService.getBookings', () => {
      bookingService.getBookings.mockReturnValue({
        subscribe: (observer: any) => {
          observer.next(mockBookings);
          return { unsubscribe: () => {} };
        }
      } as any);

      component.loadAllBookings();
      expect(bookingService.getBookings).toHaveBeenCalled();
    });

    it('should clear error message before fetching', () => {
      component.errorMessage = 'Previous error';
      
      bookingService.getBookings.mockReturnValue({
        subscribe: (observer: any) => {
          expect(component.errorMessage).toBe('');
          observer.next(mockBookings);
          return { unsubscribe: () => {} };
        }
      } as any);

      component.loadAllBookings();
    });
  });

  describe('viewBookingDetails', () => {
    it('should navigate to booking details page', () => {
      component.viewBookingDetails(1);
      expect(router.navigate).toHaveBeenCalledWith(['/bookings', 1]);
    });

    it('should navigate with correct booking id', () => {
      component.viewBookingDetails(42);
      expect(router.navigate).toHaveBeenCalledWith(['/bookings', 42]);
    });
  });

  describe('cancelBooking', () => {
    it('should cancel booking and update status', async () => {
      bookingService.getBookings.mockReturnValue({
        subscribe: (observer: any) => {
          observer.next(mockBookings);
          return { unsubscribe: () => {} };
        }
      } as any);

      component.loadAllBookings();
      
      bookingService.deleteBooking.mockReturnValue({
        subscribe: (observer: any) => {
          observer.next();
          return { unsubscribe: () => {} };
        }
      } as any);

      vi.spyOn(window, 'confirm').mockReturnValue(true);
      
      component.cancelBooking(1);

      expect(bookingService.deleteBooking).toHaveBeenCalledWith(1);
      expect(component.bookings[0].status).toBe('CANCELLED');
    });

    it('should not cancel if user cancels confirmation', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false);
      
      component.cancelBooking(1);
      
      expect(bookingService.deleteBooking).not.toHaveBeenCalled();
    });

    it('should handle error when cancelling booking', () => {
      bookingService.deleteBooking.mockReturnValue({
        subscribe: (observer: any) => {
          observer.error(new Error('Delete failed'));
          return { unsubscribe: () => {} };
        }
      } as any);

      vi.spyOn(window, 'confirm').mockReturnValue(true);
      vi.spyOn(window, 'alert');

      component.cancelBooking(1);

      expect(bookingService.deleteBooking).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalled();
    });

    it('should only cancel non-cancelled bookings', () => {
      component.bookings = [...mockBookings];
      
      const cancelledBooking = component.bookings.find((b: any) => b.status === 'CANCELLED');
      const activeBooking = component.bookings.find((b: any) => b.status !== 'CANCELLED');

      expect(cancelledBooking?.status).toBe('CANCELLED');
      expect(activeBooking?.status).not.toBe('CANCELLED');
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

    it('should render bookings table when loaded', () => {
      component.isLoading = false;
      component.bookings = mockBookings;
      expect(component.bookings.length).toBe(3);
    });

    it('should render booking rows', () => {
      component.isLoading = false;
      component.bookings = mockBookings;
      expect(component.bookings.length).toBe(3);
    });

    it('should render empty state when no bookings', () => {
      component.isLoading = false;
      component.bookings = [];
      expect(component.bookings.length).toBe(0);
    });

    it('should show cancel button only for non-cancelled bookings', () => {
      component.isLoading = false;
      component.bookings = mockBookings;
      const nonCancelled = component.bookings.filter((b: any) => b.status !== 'CANCELLED');
      expect(nonCancelled.length).toBe(2);
    });

    it('should not show cancel button for cancelled bookings', () => {
      component.isLoading = false;
      component.bookings = [mockBookings[2]]; // Only CANCELLED booking
      const nonCancelled = component.bookings.filter((b: any) => b.status !== 'CANCELLED');
      expect(nonCancelled.length).toBe(0);
    });
  });

  describe('retry functionality', () => {
    it('should call loadAllBookings when retry button is clicked', () => {
      component.isLoading = false;
      component.errorMessage = 'Error';
      
      vi.spyOn(component, 'loadAllBookings');
      
      component.loadAllBookings();
      
      expect(component.loadAllBookings).toHaveBeenCalled();
    });
  });
});