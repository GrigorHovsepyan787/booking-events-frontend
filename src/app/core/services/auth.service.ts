import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../../features/auth/models/login.request';
import { LoginResponse } from '../../features/auth/models/login.response';
import { RegisterRequest } from '../../features/auth/models/register.request';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = 'http://localhost:8081/api/auth';

    constructor(private http: HttpClient) {}

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(this.apiUrl, credentials);
    }

    register(credentials: RegisterRequest): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/register`, credentials);
    }

    logout(): void {
        localStorage.removeItem('token');
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    setToken(token: string): void {
        localStorage.setItem('token', token);
    }   
}
