import { NotificationsList } from './notifications-list';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { SimpleNotificationDto } from '../../models/simple.notification.dto';
import { Subject } from 'rxjs';

describe('NotificationsList', () => {
  let component: NotificationsList;
  let notificationService: any;
  let router: any;
  let notificationsSubject: Subject<SimpleNotificationDto[]>;

  const mockNotifications: SimpleNotificationDto[] = [
    {
      id: 1,
      title: 'Test Notification 1',
      message: 'Message 1',
      username: 'user1',
      createdAt: new Date('2025-12-01')
    },
    {
      id: 2,
      title: 'Test Notification 2',
      message: 'Message 2',
      username: 'user2',
      createdAt: new Date('2025-12-02')
    },
    {
      id: 3,
      title: 'Test Notification 3',
      message: 'Message 3',
      username: 'user3',
      createdAt: new Date('2025-12-03')
    }
  ];

  beforeEach(() => {
    notificationsSubject = new Subject<SimpleNotificationDto[]>();
    notificationService = {
      getNotifications: vi.fn(() => notificationsSubject.asObservable())
    };
    router = { navigate: vi.fn() };

    component = new NotificationsList(notificationService, router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading state', () => {
    expect(component.isLoading).toBe(true);
    expect(component.notifications.length).toBe(0);
    expect(component.errorMessage).toBe('');
  });

  describe('ngOnInit', () => {
    it('should call loadNotifications on init', () => {
      notificationsSubject.next([]);
      component.ngOnInit();
      expect(notificationService.getNotifications).toHaveBeenCalled();
    });
  });

  describe('loadNotifications', () => {
    it('should load notifications successfully', () => {
      component.loadNotifications();
      notificationsSubject.next(mockNotifications);

      expect(component.notifications.length).toBe(3);
      expect(component.notifications[0].title).toBe('Test Notification 1');
      expect(component.errorMessage).toBe('');
    });

    it('should handle error when loading notifications', () => {
      component.loadNotifications();
      notificationsSubject.error(new Error('Server error'));

      expect(component.errorMessage).toBe('Failed to load notifications. Please try again later.');
      expect(component.notifications.length).toBe(0);
    });

    it('should call NotificationService.getNotifications', () => {
      component.loadNotifications();
      notificationsSubject.next([]);
      expect(notificationService.getNotifications).toHaveBeenCalled();
    });
  });

  describe('viewNotificationDetails', () => {
    it('should navigate to notification details page', () => {
      component.viewNotificationDetails(1);
      expect(router.navigate).toHaveBeenCalledWith(['/notifications', 1]);
    });

    it('should navigate with correct notification id', () => {
      component.viewNotificationDetails(42);
      expect(router.navigate).toHaveBeenCalledWith(['/notifications', 42]);
    });
  });
});