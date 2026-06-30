import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../../features/auth/models/login.request';
import { LoginResponse } from '../../features/auth/models/login.response';
import { RegisterRequest } from '../../features/auth/models/register.request';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = `${environment.apiUrl}/auth`;
    private readonly _token = signal<string | null>(null);
    readonly isAuthenticated = computed(() => !!this._token());

    constructor(private http: HttpClient) {
        this._token.set(this.getInitialToken());
    }

    login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}`, credentials);
}

    register(credentials: RegisterRequest): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/register`, credentials);
    }

    logout(): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('token');
        }
        this._token.set(null);
    }

    getToken(): string | null {
        return this._token();
    }

    setToken(token: string): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('token', token);
        }
        this._token.set(token);
    }

    private getInitialToken(): string | null {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    }
}
