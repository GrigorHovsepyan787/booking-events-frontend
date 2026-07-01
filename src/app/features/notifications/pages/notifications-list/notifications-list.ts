import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-notifications-list',
  standalone: true,
  templateUrl: './notifications-list.html', 
  styleUrls: ['./notifications-list.css'] 
})
export class NotificationsList implements OnInit {
  public notifications: any[] = [];
  public isLoading = true;
  public errorMessage = '';
  
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    public notificationService: NotificationService,
    public router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadNotifications();
    } else {}
  }

  protected loadNotifications(): void {
    this.isLoading = true;
    this.notificationService.getNotifications().subscribe({
      next: (pageData) => {
        this.notifications = pageData.content; 
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: unknown) => {
        console.error('Error while loading notifications:', err);
        this.errorMessage = 'Failed to load notifications.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
}
  protected viewNotificationDetails(notificationId: string): void {
    this.router.navigate(['/notifications', notificationId]);
  }
}