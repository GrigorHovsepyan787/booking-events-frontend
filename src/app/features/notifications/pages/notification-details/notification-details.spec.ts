import { NotificationDetails } from './notification-details';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';

describe('NotificationDetails', () => {
  let component: NotificationDetails;
  let notificationService: any;
  let router: any;

  const mockNotification = {
    id: 1,
    title: 'Test Notification',
    message: 'This is a test notification message',
    username: 'testuser',
    createdAt: new Date('2025-12-01')
  };

  beforeEach(() => {
    const mockObservable = {
      subscribe: (observer: any) => {
        observer.next(mockNotification);
        return { unsubscribe: () => {} };
      }
    };
    notificationService = {
      readNotificationById: vi.fn().mockReturnValue(mockObservable),
      deleteNotification: vi.fn().mockReturnValue(mockObservable)
    };
    router = { navigate: vi.fn() };

    component = new NotificationDetails(notificationService, { snapshot: { paramMap: { get: () => '1' } } } as any, router as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading state', () => {
    expect(component.isLoading).toBe(true);
    expect(component.errorMessage).toBe('');
  });

  describe('ngOnInit', () => {
    it('should call loadNotificationDetails with id from route', () => {
      const mockObservable = {
        subscribe: (observer: any) => {
          observer.next(mockNotification);
          return { unsubscribe: () => {} };
        }
      };
      notificationService.readNotificationById.mockReturnValue(mockObservable as any);
      
      component.ngOnInit();
      
      expect(notificationService.readNotificationById).toHaveBeenCalledWith(1);
    });

    it('should handle missing id parameter', () => {
      component = new NotificationDetails(notificationService, { snapshot: { paramMap: { get: () => null } } } as any, router as any);
      
      component.ngOnInit();
      
      expect(component.errorMessage).toBe('Incorrect notification ID.');
      expect(component.isLoading).toBe(false);
    });

    it('should convert string id to number', () => {
      component = new NotificationDetails(notificationService, { snapshot: { paramMap: { get: () => '42' } } } as any, router as any);
      
      const mockObservable = {
        subscribe: (observer: any) => {
          observer.next(mockNotification);
          return { unsubscribe: () => {} };
        }
      };
      notificationService.readNotificationById.mockReturnValue(mockObservable as any);
      
      component.ngOnInit();
      
      expect(notificationService.readNotificationById).toHaveBeenCalledWith(42);
    });
  });

  describe('loadNotificationDetails', () => {
    it('should load notification details successfully', async () => {
      notificationService.readNotificationById.mockReturnValue({
        subscribe: (observer: any) => {
          observer.next(mockNotification);
          return { unsubscribe: () => {} };
        }
      } as any);

      component.loadNotificationDetails(1);

      expect(component.isLoading).toBe(false);
      expect(component.notification).toEqual(mockNotification);
      expect(component.errorMessage).toBe('');
    });

    it('should handle error when loading notification', async () => {
      notificationService.readNotificationById.mockReturnValue({
        subscribe: (observer: any) => {
          observer.error(new Error('Not found'));
          return { unsubscribe: () => {} };
        }
      } as any);

      component.loadNotificationDetails(1);

      expect(component.isLoading).toBe(false);
      expect(component.errorMessage).toBe('Notification not found or server is unavailable.');
    });

    it('should set loading state before fetching', () => {
      notificationService.readNotificationById.mockReturnValue({
        subscribe: (observer: any) => {
          expect(component.isLoading).toBe(true);
          observer.next(mockNotification);
          return { unsubscribe: () => {} };
        }
      } as any);

      component.loadNotificationDetails(1);
    });

    it('should call NotificationService.readNotificationById with correct id', () => {
      notificationService.readNotificationById.mockReturnValue({
        subscribe: (observer: any) => {
          observer.next(mockNotification);
          return { unsubscribe: () => {} };
        }
      } as any);

      component.loadNotificationDetails(1);
      expect(notificationService.readNotificationById).toHaveBeenCalledWith(1);
    });
  });

  describe('deleteNotification', () => {
    beforeEach(() => {
      component.notification = mockNotification;
      notificationService.deleteNotification.mockReturnValue({
        subscribe: (observer: any) => {
          observer.next();
          return { unsubscribe: () => {} };
        }
      } as any);
    });

    it('should delete notification and navigate to list', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      
      component.deleteNotification();
      
      expect(notificationService.deleteNotification).toHaveBeenCalledWith(1);
      expect(router.navigate).toHaveBeenCalledWith(['/notifications']);
    });

    it('should not delete if user cancels confirmation', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false);
      
      component.deleteNotification();
      
      expect(notificationService.deleteNotification).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle error when deleting notification', () => {
      notificationService.deleteNotification.mockReturnValue({
        subscribe: (observer: any) => {
          observer.error(new Error('Delete failed'));
          return { unsubscribe: () => {} };
        }
      } as any);

      vi.spyOn(window, 'confirm').mockReturnValue(true);
      vi.spyOn(window, 'alert');

      component.deleteNotification();

      expect(notificationService.deleteNotification).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalled();
    });
  });

  describe('template rendering', () => {
    it('should render loading state', () => {
      component.isLoading = true;
      expect(component.isLoading).toBe(true);
    });

    it('should render error state with back button', () => {
      component.isLoading = false;
      component.errorMessage = 'Test error';
      expect(component.errorMessage).toBe('Test error');
    });

    it('should render notification card when loaded', () => {
      component.isLoading = false;
      component.notification = mockNotification;
      expect(component.notification.title).toBe('Test Notification');
    });

    it('should display notification title', () => {
      component.isLoading = false;
      component.notification = mockNotification;
      expect(component.notification.title).toBe('Test Notification');
    });

    it('should display notification message', () => {
      component.isLoading = false;
      component.notification = mockNotification;
      expect(component.notification.message).toBe('This is a test notification message');
    });

    it('should display notification metadata', () => {
      component.isLoading = false;
      component.notification = mockNotification;
      expect(component.notification.username).toBe('testuser');
    });

    it('should have back link to notifications list', () => {
      component.isLoading = false;
      component.notification = mockNotification;
      expect(component.notification).toBeDefined();
    });

    it('should have delete button', () => {
      component.isLoading = false;
      component.notification = mockNotification;
      expect(component.notification).toBeDefined();
    });

    it('should display notification id', () => {
      component.isLoading = false;
      component.notification = mockNotification;
      expect(component.notification.id).toBe(1);
    });
  });
});