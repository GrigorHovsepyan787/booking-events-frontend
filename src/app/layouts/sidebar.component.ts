import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 bg-white border-r border-slate-200/70 z-30">
      <div class="flex flex-col h-full">
        <div class="flex items-center gap-3 px-6 h-16 border-b border-slate-200/70">
          <span class="text-2xl">📅</span>
          <span class="text-lg font-bold text-slate-900 tracking-tight">Booking Events</span>
        </div>

        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <a
            routerLink="/"
            routerLinkActive="bg-indigo-50 text-indigo-600"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <span class="text-lg">🏠</span>
            <span>Home</span>
          </a>

          <a
            routerLink="/events"
            routerLinkActive="bg-indigo-50 text-indigo-600"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <span class="text-lg">🎪</span>
            <span>Events</span>
          </a>

          <a
            routerLink="/bookings"
            routerLinkActive="bg-indigo-50 text-indigo-600"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <span class="text-lg">🎟️</span>
            <span>My Bookings</span>
          </a>

          <a
            routerLink="/notifications"
            routerLinkActive="bg-indigo-50 text-indigo-600"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <span class="text-lg">🔔</span>
            <span>Notifications</span>
          </a>
        </nav>

        <div class="px-4 py-4 border-t border-slate-200/70">
          <a
            routerLink="/help"
            routerLinkActive="text-indigo-600"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <span class="text-lg">❓</span>
            <span>Help Center</span>
          </a>
        </div>
      </div>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {}