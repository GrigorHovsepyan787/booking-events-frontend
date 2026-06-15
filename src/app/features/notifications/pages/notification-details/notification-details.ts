import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { NotificationDto } from '../../models/notification.dto';

@Component({
  selector: 'app-notification-details',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './notification-details.html',
  styleUrl: './notification-details.css',
})
export class NotificationDetails implements OnInit {
  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected notification!: NotificationDto;
  protected isLoading = true;
  protected errorMessage = '';

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      const notificationId = Number(idParam); 
      this.loadNotificationDetails(notificationId);
    } else {
      this.errorMessage = 'Incorrect notification ID.';
      this.isLoading = false;
    }
  }

  private loadNotificationDetails(id: number): void {
    this.isLoading = true;
    
    this.notificationService.readNotificationById(id).subscribe({
      next: (data: NotificationDto) => {
        this.notification = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error occurred while fetching the notification:', err);
        this.errorMessage = 'Notification not found or server is unavailable.';
        this.isLoading = false;
      }
    });
  }

  protected deleteNotification(): void {
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
}
