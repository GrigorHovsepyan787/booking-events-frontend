import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { BookingResponse } from '../../models/booking.response';

@Component({
  selector: 'app-bookings-list',
  standalone: true,
  imports: [],
  templateUrl: './bookings-list.html',
  styleUrl: './bookings-list.css',
})
export class BookingsList implements OnInit {
  private service = inject(BookingService);
  private router = inject(Router);

  protected bookings: BookingResponse[] = [];
  protected isLoading = true;
  protected errorMessage = '';

  ngOnInit(): void {
    this.loadAllBookings();  
  }

  protected loadAllBookings(): void {
    this.isLoading = true;
    this.service.getBookings().subscribe({
      next: (data: BookingResponse[]) => {
        this.bookings = data;
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error('Error while loading bookings:', err);
        this.errorMessage = 'Failed to load bookings. Please try again later.';
        this.isLoading = false;
      }
    });
  }
  protected viewBookingDetails(bookingId: number): void {
    this.router.navigate(['/bookings', bookingId]);
  }

  protected cancelBooking(bookingId: number): void {
    if (confirm(`Вы уверены, что хотите отменить бронирование №${bookingId}?`)) {
      this.service.deleteBooking(bookingId).subscribe({
        next: () => {
          this.bookings = this.bookings.map(b => 
            b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
          );
        },
        error: (err) => {
          console.error('Failed to cancel booking:', err);
          alert('Failed to cancel booking. Please try again later.');
        }
      });
    }
  }
}
