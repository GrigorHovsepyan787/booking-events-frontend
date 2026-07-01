import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingResponse } from '../models/booking.response';
import { Page } from '../../page';

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private readonly apiUrl = 'http://localhost:8080/api/bookings';
     
    constructor(private http: HttpClient) {}

    getBookings(page: number = 0, size: number = 10): Observable<Page<BookingResponse>> {
        return this.http.get<Page<BookingResponse>>(`${this.apiUrl}?page=${page}&size=${size}`);
    }
    getBookingById(id: number): Observable<BookingResponse> {
        return this.http.get<BookingResponse>(`${this.apiUrl}/${id}`);
    }

    createBooking(booking: Partial<BookingResponse>): Observable<BookingResponse> {
        return this.http.post<BookingResponse>(this.apiUrl, booking);
    }

    deleteBooking(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
