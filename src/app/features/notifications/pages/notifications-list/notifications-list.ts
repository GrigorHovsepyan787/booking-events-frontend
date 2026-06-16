import { Component, OnInit, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { SimpleNotificationDto } from '../../models/simple.notification.dto';

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [],
  templateUrl: './notifications-list.html',
  styleUrl: './notifications-list.css',
})
export class NotificationsList implements OnInit {
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  protected notifications: SimpleNotificationDto[] = [];
  protected isLoading = true;
  protected errorMessage = '';

  ngOnInit(): void {
    this.loadNotifications();
  }

  protected loadNotifications(): void {
    this.isLoading = true;
    this.notificationService.getNotifications().subscribe({
      next: (data: SimpleNotificationDto[]) => {
        this.notifications = data;
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error('Error while loading notifications:', err);
        this.errorMessage = 'Failed to load notifications. Please try again later.';
        this.isLoading = false;
      }
    });
  }
  
  protected viewNotificationDetails(notificationId: number): void {
    this.router.navigate(['/notifications', notificationId]);
  }
}