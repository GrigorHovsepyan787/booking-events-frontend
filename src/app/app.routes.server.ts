import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'bookings/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'notifications/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'events/:id',
    renderMode: RenderMode.Client
  }
];
