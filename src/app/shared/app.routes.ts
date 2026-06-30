import { Routes, Router } from '@angular/router';
import { LoginComponent } from '../features/auth/pages/login/login.component';
import { RegisterComponent } from '../features/auth/pages/register/register.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'bookings',
        loadComponent: () => import('../features/booking/pages/bookings-list/bookings-list').then(m => m.BookingsListComponent)
    },
    {
        path: 'bookings/:id',
        loadComponent: () => import('../features/booking/pages/booking-details/booking-details').then(m => m.BookingDetailsComponent)
    },
    {
        path: 'bookings/new',
        loadComponent: () => import('../features/booking/pages/booking-form/booking-form').then(m => m.BookingFormComponent)
    },
    {
        path : 'notifications',
        loadComponent: () => import('../features/notifications/pages/notifications-list/notifications-list').then(m => m.NotificationsList)
    },
    {
        path : 'notifications/:id',
        loadComponent: () => import('../features/notifications/pages/notification-details/notification-details').then(m => m.NotificationDetails)
    },
    {
        path: 'events',
        loadComponent: () => import('../features/events/pages/event-list/event-list').then(m => m.EventList)
    },
    {
        path: 'events/:id',
        loadComponent: () => import('../features/events/pages/event-details/event-details').then(m => m.EventDetails)
    },
    {
        path: 'events/new',
        loadComponent: () => import('../features/events/pages/event-form/event-form').then(m => m.EventForm)
    },
    {
        path: 'events/my',
        loadComponent: () => import('../features/events/pages/my-events/my-events').then(m => m.MyEvents)
    }
];