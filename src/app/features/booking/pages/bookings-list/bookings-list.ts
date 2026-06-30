import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { BookingResponse } from '../../models/booking.response';

@Component({
  selector: 'app-bookings-list',
  standalone: true,
  imports: [],
  template: `
    <div class="bookings-page">
      <header class="page-header">
        <div class="header-content">
          <h1>My bookings</h1>
          <p class="subtitle">Manage your tickets and registrations for events</p>
        </div>
      </header>

      @if (isLoading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading booking list...</p>
        </div>
      } 
      
      @else if (errorMessage) {
        <div class="error-state">
          <p class="error-text">⚠️ {{ errorMessage }}</p>
          <button (click)="loadAllBookings()" class="btn-retry">Try again</button>
        </div>
      } 
      
      @else {
        <div class="table-container">
          <table class="bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Event ID</th>
                <th>Status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (booking of bookings; track booking.id) {
                <tr>
                  <td class="font-mono font-bold">#{{ booking.id }}</td>
                  <td><span class="event-id-tag">Event #{{ booking.eventId }}</span></td>
                  <td>
                    <span class="badge status-{{ booking.status.toLowerCase() }}">
                      {{ booking.status }}
                    </span>
                  </td>
                  <td class="text-right">
                    <div class="action-buttons">
                      <button (click)="viewBookingDetails(booking.id)" class="btn-view">Details</button>
                      @if (booking.status !== 'CANCELLED') {
                        <button (click)="cancelBooking(booking.id)" class="btn-cancel">Cancel</button>
                      }
                    </div>
                  </td>
                </tr>
              } 
              @empty {
                <tr>
                  <td colspan="4" class="empty-row">
                    <div class="empty-state">
                      <span class="empty-icon">🎟️</span>
                      <h3>You don't have any bookings yet</h3>
                      <p>Go to the events list to select an event you're interested in.</p>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
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
  constructor(private service: BookingService, private router: Router) {}

  public bookings: BookingResponse[] = [];
  public isLoading = true;
  public errorMessage = '';

  ngOnInit(): void {
    this.loadAllBookings();  
  }

  protected loadAllBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';
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
