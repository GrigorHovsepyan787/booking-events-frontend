import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { BookingService } from '../../services/booking.service';;
import { BookingResponse } from '../../models/booking.response';
import { EventService } from '../../../events/services/event.service';
import { EventResponse } from '../../../events/models/event.response';

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [DatePipe, UpperCasePipe, RouterLink], 
  templateUrl: './booking-details.html',
  styleUrls: ['./booking-details.css']
})
export class BookingDetailsComponent implements OnInit {
  constructor(
    private bookingService: BookingService,
    private eventService: EventService,
    private route: ActivatedRoute
  ) {}

  private platformId = inject(PLATFORM_ID);
  protected booking!: BookingResponse;
  protected event!: EventResponse;
  private cdr = inject(ChangeDetectorRef);

  protected isLoading = true;
  protected errorMessage = '';

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        this.loadBookingAndEvent(Number(idParam));
      } else {
        this.errorMessage = 'Incorrect booking ID.';
        this.isLoading = false;
      }
    } else {
      this.isLoading = true; 
    }
  }

  private loadBookingAndEvent(bookingId: number): void {
    this.isLoading = true;

    this.bookingService.getBookingById(bookingId).pipe(
      
      switchMap((bookingData: BookingResponse) => {
        this.booking = bookingData; 
        return this.eventService.getEventById(bookingData.eventId);
      })
      
    ).subscribe({
      next: (eventData: EventResponse) => {
        this.event = eventData;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error while loading data:', err);
        this.errorMessage = 'Failed to load booking or event data.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  protected cancelBooking(): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.deleteBooking(this.booking.id).subscribe({
        next: () => {
          this.booking.status = 'CANCELLED';
        },
        error: () => alert('Error while cancelling the booking.')
      });
    }
  }
}