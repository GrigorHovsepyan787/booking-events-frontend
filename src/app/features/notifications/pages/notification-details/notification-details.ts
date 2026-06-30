import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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
