import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { BookingResponse } from '../../models/booking.response';

@Component({
  selector: 'app-bookings-list',
  standalone: true,
  imports: [],
  templateUrl: `bookings-list.html`,
  styles: [`
    .bookings-page { padding: 20px; }
    .page-header { margin-bottom: 20px; }
    .loading-state { padding: 40px; text-align: center; }
    .error-state { padding: 20px; text-align: center; }
    .btn-retry { padding: 8px 16px; cursor: pointer; }
    .table-container { overflow-x: auto; }
    .bookings-table { width: 100%; border-collapse: collapse; }
    .bookings-table th, .bookings-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    .font-mono { font-family: monospace; }
    .font-bold { font-weight: bold; }
    .badge { padding: 4px 8px; border-radius: 4px; }
    .status-confirmed { background: #d4edda; }
    .status-cancelled { background: #f8d7da; }
    .status-pending { background: #fff3cd; }
    .action-buttons { display: flex; gap: 8px; }
    .btn-view { padding: 6px 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .btn-cancel { padding: 6px 12px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .text-right { text-align: right; }
    .empty-row { padding: 40px; text-align: center; }
    .empty-state { text-align: center; }
    .empty-icon { font-size: 48px; }
  `],
})
export class BookingsListComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

  constructor(private service: BookingService, private router: Router) {}

  public bookings: BookingResponse[] = [];
  public isLoading = true;
  public errorMessage = '';
  private cdr = inject(ChangeDetectorRef);
  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAllBookings(); 
    }else{}
  }

  protected loadAllBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.service.getBookings().subscribe({
      next: (pageData) => {
        this.bookings = pageData.content;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: unknown) => {
        console.error('Error while loading bookings:', err);
        this.errorMessage = 'Failed to load bookings. Please try again later.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
  protected viewBookingDetails(bookingId: number): void {
    this.router.navigate(['/bookings', bookingId]);
  }

  protected cancelBooking(bookingId: number): void {
    if (confirm(`Are you sure to cancel the booking? №${bookingId}?`)) {
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
