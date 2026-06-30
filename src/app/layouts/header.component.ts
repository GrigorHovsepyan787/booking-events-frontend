import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="h-16 bg-white border-b border-slate-200/70 shadow-sm sticky top-0 z-40">
      <div class="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a routerLink="/" routerLinkActive="text-indigo-600" class="flex items-center gap-2.5 group">
          <span class="text-2xl transition-transform group-hover:scale-105">📅</span>
          <span class="text-lg font-bold text-slate-900 tracking-tight hidden sm:block">Booking Events</span>
        </a>

        <div class="flex items-center gap-3">
          @if (authService.isAuthenticated()) {
            <button
              (click)="authService.logout()"
              class="inline-flex items-center px-4 py-2 text-sm font-semibold text-red-600 bg-transparent border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors">
              Logout
            </button>
          } @else {
            <a
              routerLink="/login"
              class="inline-flex items-center px-4 py-2 text-sm font-semibold text-indigo-600 bg-transparent border border-indigo-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors">
              Login
            </a>
          }
        </div>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}
}