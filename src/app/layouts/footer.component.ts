import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-slate-900 text-slate-300 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div class="sm:col-span-2 lg:col-span-1">
            <a routerLink="/" class="inline-flex items-center gap-2.5 group">
              <span class="text-2xl">📅</span>
              <span class="text-lg font-bold text-white tracking-tight">Booking Events</span>
            </a>
            <p class="mt-4 text-sm text-slate-400 leading-relaxed max-w-xs">
              Discover and book amazing events near you. Your next unforgettable experience starts here.
            </p>
          </div>

          <div>
            <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <nav class="flex flex-col gap-3">
              <a routerLink="/" class="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Home</a>
              <a routerLink="/events" class="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Events</a>
              <a routerLink="/bookings" class="text-sm text-slate-400 hover:text-indigo-400 transition-colors">My Bookings</a>
              <a routerLink="/notifications" class="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Notifications</a>
            </nav>
          </div>

          <div>
            <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Account</h4>
            <nav class="flex flex-col gap-3">
              <a routerLink="/login" class="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Login</a>
              <a routerLink="/register" class="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Register</a>
              <a routerLink="/profile" class="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Profile</a>
            </nav>
          </div>
        </div>

        <div class="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm text-slate-500">&copy; {{ currentYear() }} Booking Events. All rights reserved.</p>
          <p class="text-sm text-slate-500">Made with ❤️ for event lovers</p>
        </div>
      </div>
    </footer>
  `,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  currentYear = signal(new Date().getFullYear());
}