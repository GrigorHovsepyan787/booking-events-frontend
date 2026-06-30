import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { EventService } from '../../../events/services/event.service';
import { EventResponse } from '../../../events/models/event.response';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './booking-form.html',
  styleUrl: './booking-form.css'
})
export class BookingFormComponent implements OnInit, OnDestroy {
  constructor(
    private eventService: EventService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  protected searchControl = new FormControl('');
  
  protected foundEvents: EventResponse[] = [];
  protected isLoading = false;
  protected isBookingLoading = false;
  protected errorMessage = '';

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initSearchPipeline();
    
    this.triggerSearch('');
  }

  private initSearchPipeline(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(400),        
      distinctUntilChanged(),   
      takeUntil(this.destroy$)  
    ).subscribe(query => {
      this.triggerSearch(query ?? '');
    });
  }

  private triggerSearch(titleQuery: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.eventService.searchEventsByTitle(titleQuery).subscribe({
      next: (events) => {
        this.foundEvents = events;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Search failed:', err);
        this.errorMessage = 'Error while loading events.';
        this.isLoading = false;
      }
    });
  }

  protected makeBooking(eventId: number, eventTitle: string): void {
    this.isBookingLoading = true;
    
    this.bookingService.createBooking({ eventId }).subscribe({
      next: (response) => {
        this.isBookingLoading = false;
        alert(`Successfully booked: "${eventTitle}"!`);
        this.router.navigate(['/bookings']);
      },
      error: (err) => {
        this.isBookingLoading = false;
        console.error('Booking failed:', err);
        alert('Failed to create booking. Perhaps the event is fully booked.');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}