import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventResponse } from '../models/event.response';
import { CreateEventRequest } from '../models/create-event.request';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private readonly apiUrl = 'http://localhost:8080/api/events';

    constructor(private http: HttpClient) {}

    getEvents(): Observable<EventResponse[]> {
        return this.http.get<EventResponse[]>(this.apiUrl);
    }

    getUserEvents(): Observable<EventResponse[]> {
        return this.http.get<EventResponse[]>(`${this.apiUrl}/user/my`);
    }

    getEventById(id: number): Observable<EventResponse> {
        return this.http.get<EventResponse>(`${this.apiUrl}/${id}`);
    }

    createEvent(eventData: any): Observable<CreateEventRequest> {
        return this.http.post<CreateEventRequest>(this.apiUrl, eventData);
    }

    updateEvent(id: number, eventData: any): Observable<CreateEventRequest> {
        return this.http.put<CreateEventRequest>(`${this.apiUrl}/${id}`, eventData);
    }

    deleteEvent(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}
