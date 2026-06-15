import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationDto } from '../models/notification.dto';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private readonly apiUrl = 'http://localhost:8080/api/notifications';

    constructor(private http: HttpClient) {}

    getNotifications(): Observable<NotificationDto[]> {
        return this.http.get<NotificationDto[]>(this.apiUrl);
    }

    readNotificationById(id: number): Observable<NotificationDto> {
        return this.http.patch<NotificationDto>(`${this.apiUrl}/${id}`, {});
    }

    deleteNotification(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
