import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationDto } from '../models/notification.dto';
import { SimpleNotificationDto } from '../models/simple.notification.dto';
import { Page } from '../../page';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private readonly apiUrl = 'http://localhost:8080/api/notifications';

    constructor(private http: HttpClient) {}

    getNotifications(page: number = 0, size: number = 10): Observable<Page<SimpleNotificationDto>> {
    return this.http.get<Page<SimpleNotificationDto>>(`${this.apiUrl}?page=${page}&size=${size}`);
    }

    readNotificationById(id: string): Observable<NotificationDto> {
        return this.http.patch<NotificationDto>(`${this.apiUrl}/${id}`, {});
    }

    deleteNotification(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
