import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from "@angular/router";
import { FooterComponent } from '../layouts/footer.component';
import { HeaderComponent } from '../layouts/header.component';
import { SidebarComponent } from '../layouts/sidebar.component';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  breadcrumbLabel = signal('Home');

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event: NavigationEnd | any) => {
        const url = event.urlAfterRedirects;
        this.breadcrumbLabel.set(this.getBreadcrumbLabel(url));
      });
  }

  private getBreadcrumbLabel(url: string): string {
    const segments = url.split('/').filter(Boolean);
    if (segments.length === 0) return 'Home';
    const last = segments[segments.length - 1];
    const map: Record<string, string> = {
      'events': 'Events',
      'bookings': 'My Bookings',
      'notifications': 'Notifications',
      'login': 'Login',
      'register': 'Register',
    };
    return map[last] || this.capitalize(last);
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
