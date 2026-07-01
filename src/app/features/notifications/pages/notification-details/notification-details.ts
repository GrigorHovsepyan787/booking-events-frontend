import { Component, OnInit, PLATFORM_ID, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { NotificationDto } from '../../models/notification.dto';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notification-details',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './notification-details.html',
  styleUrl: './notification-details.css'
})
export class NotificationDetails implements OnInit {
  public notification!: NotificationDto;
  public isLoading = true;
  public errorMessage = '';
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        this.loadNotificationDetails(String(idParam));
      } else {
        this.errorMessage = 'Incorrect notification ID.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    } else {
      this.isLoading = true;
    }
  }

  private loadNotificationDetails(id: string): void {
    this.isLoading = true;
    
    this.notificationService.readNotificationById(id).subscribe({
      next: (data: NotificationDto) => {
        this.notification = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error occurred while fetching the notification:', err);
        this.errorMessage = 'Notification not found or server is unavailable.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  public deleteNotification(): void {
    if (confirm('Are you sure you want to delete this notification?')) {
      this.notificationService.deleteNotification(this.notification.id).subscribe({
        next: () => {
          this.router.navigate(['/notifications']);
        },
        error: (err) => {
          console.error('Failed to delete notification', err);
          alert('Could not delete notification. Try again later.');
        }
      });
    }
  }

  public goBack(): void {
    this.router.navigate(['/notifications']);
  }
}
