import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationDto } from '../models/notification.dto';

@Injectable({
    providedIn: 'root'
})
export class Services {
    private readonly apiUrl = 'http://localhost:8080/api/notifications';

    constructor(private http: HttpClient) {}

    getNotifications(): Observable<NotificationDto[]> {
        return this.http.get<NotificationDto[]>(this.apiUrl);
    }

    readNotificationById(id: number, notification: Partial<NotificationDto>): Observable<NotificationDto> {
        return this.http.patch<NotificationDto>(`${this.apiUrl}/${id}`, notification);
    }

    deleteNotification(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
