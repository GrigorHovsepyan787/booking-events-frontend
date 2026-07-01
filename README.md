# Booking Events Frontend

A modern Angular 22 standalone application for event booking and management, designed to work with a Spring Boot microservices backend architecture. This frontend application provides a seamless user experience for browsing events, managing bookings, and handling notifications through a centralized API Gateway.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Authentication Flow](#authentication-flow)
- [API Communication](#api-communication)
- [Build & Production](#build--production)
- [Common Issues & Troubleshooting](#common-issues--troubleshooting)
- [Future Improvements](#future-improvements)

## Tech Stack

### Frontend
- **Framework**: Angular 22.0.0 (Standalone Components)
- **Language**: TypeScript 6.0.2
- **State Management**: Angular Signals (reactive primitives)
- **HTTP Client**: Angular HttpClient with interceptors
- **Routing**: Angular Router with guards
- **Styling**: Tailwind CSS 4.1.12
- **Testing**: Vitest 4.0.8
- **SSR**: Optional (Angular Universal setup available)

### Backend Integration
- **Backend**: Spring Boot Microservices
- **API Gateway**: Centralized entry point (http://localhost:8080)
- **Authentication**: JWT-based (access + refresh tokens)
- **Protocol**: RESTful API over HTTP

## Features

### Core Functionality
- **User Authentication**
  - User registration with validation
  - Secure login with JWT tokens
  - Logout with token cleanup
  - Persistent authentication state

- **Events Management**
  - Browse available events
  - View event details
  - Create, update, and delete events (CRUD operations)
  - Event categorization and filtering

- **Booking System**
  - Book events with seat selection
  - View booking history
  - Cancel bookings
  - Booking confirmation and notifications

- **Notifications**
  - Real-time notification system
  - Booking confirmations
  - Event reminders
  - System alerts

- **Security**
  - JWT-based authentication
  - Protected routes with auth guards
  - Automatic token attachment via HTTP interceptor
  - Secure token storage in localStorage

## Project Structure

```
src/
├── app/
│   ├── core/                          # Core functionality (singleton services)
│   │   ├── guards/                    # Route guards
│   │   │   └── auth.guard.ts         # Protects authenticated routes
│   │   ├── interceptors/              # HTTP interceptors
│   │   │   ├── jwt-interceptor.ts    # Attaches JWT to requests
│   │   │   └── error-interceptor.ts  # Global error handling
│   │   └── services/                  # Core services
│   │       └── auth.service.ts       # Authentication logic
│   │
│   ├── features/                      # Feature modules (by domain)
│   │   ├── auth/                      # Authentication feature
│   │   │   ├── login/                # Login component
│   │   │   ├── register/             # Registration component
│   │   │   └── models/               # TypeScript interfaces
│   │   ├── events/                    # Events management
│   │   │   ├── event-list/           # Event listing
│   │   │   ├── event-details/        # Event details view
│   │   │   ├── event-form/           # Create/Edit event
│   │   │   └── models/               # Event interfaces
│   │   ├── booking/                   # Booking functionality
│   │   │   ├── booking-list/         # User bookings
│   │   │   ├── booking-form/         # New booking
│   │   │   └── models/               # Booking interfaces
│   │   └── notifications/             # Notifications system
│   │       ├── notification-list/    # Notification center
│   │       └── models/               # Notification interfaces
│   │
│   ├── layouts/                       # Layout components
│   │   ├── header.component.ts       # Top navigation
│   │   ├── footer.component.ts       # Footer
│   │   └── sidebar.component.ts      # Side navigation
│   │
│   └── shared/                        # Shared components & utilities
│       ├── app.config.ts             # App configuration
│       ├── app.routes.ts             # Route definitions
│       └── ui/                       # Reusable UI components
│
├── environments/                      # Environment configurations
│   ├── environment.ts                # Development config
│   └── environment.prod.ts           # Production config
│
├── main.ts                            # Application bootstrap
└── styles.css                         # Global styles
```

### Architecture Patterns

- **Standalone Components**: All components are standalone (no NgModules)
- **Feature-Based Organization**: Code organized by business domain
- **Core vs Features**: Core contains singleton services, features contain page-specific logic
- **Functional Programming**: Uses functional interceptors and guards
- **Signals**: Modern reactive state management with Angular Signals

## Installation & Setup

### Prerequisites

- Node.js 18+ and npm 9+
- Angular CLI 22.0.0
- A running Spring Boot backend with API Gateway

### Step 1: Clone the Repository

```bash
git clone https://github.com/GrigorHovsepyan787/booking-events-frontend.git
cd booking-events-frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- Angular 22 and related packages
- Tailwind CSS for styling
- Vitest for testing
- RxJS for reactive programming

### Step 3: Environment Configuration

Create or verify the environment configuration file at `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

For production, update `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-gateway.com/api'
};
```

### Step 4: Start the Development Server

```bash
npm start
```

Or use the Angular CLI directly:

```bash
ng serve
```

The application will be available at `http://localhost:4200/`

### Step 5: Verify Setup

1. Open browser and navigate to `http://localhost:4200/`
2. Check the browser console for any errors
3. Verify API connectivity (you should see network requests to `http://localhost:8080`)

## Environment Variables

The application uses Angular's environment system for configuration. Environment files are located in `src/environments/`.

### Development Environment (`environment.ts`)

```typescript
export const environment = {
  production: false,           // Flag for development mode
  apiUrl: 'http://localhost:8080/api'  // API Gateway URL
};
```

### Production Environment (`environment.prod.ts`)

```typescript
export const environment = {
  production: true,            // Flag for production mode
  apiUrl: 'https://api.yourdomain.com/api'  // Production API URL
};
```

### Usage in Code

Access environment variables using the imported environment object:

```typescript
import { environment } from '../environments/environment';

const apiUrl = environment.apiUrl;  // 'http://localhost:8080/api'
const isProduction = environment.production;  // false (dev) or true (prod)
```

### Build-Time Replacement

Angular automatically replaces environment files during the build process:
- `ng serve` uses `environment.ts`
- `ng build --configuration production` uses `environment.prod.ts`

## Authentication Flow

The application implements a JWT-based authentication system with the following flow:

### 1. Login Process

```
User enters credentials
    ↓
AuthService.login() sends POST to /api/auth
    ↓
Backend validates and returns JWT token
    ↓
Token stored in localStorage
    ↓
AuthService updates reactive signal
    ↓
User redirected to protected area
```

### 2. Token Storage

Tokens are stored in the browser's localStorage:

```typescript
// Setting token
localStorage.setItem('token', jwtToken);

// Retrieving token
const token = localStorage.getItem('token');

// Removing token on logout
localStorage.removeItem('token');
```

### 3. HTTP Interceptor

The `jwt-interceptor.ts` automatically attaches the JWT token to all outgoing HTTP requests:

```typescript
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
};
```

**How it works:**
1. Intercepts all HTTP requests
2. Retrieves token from localStorage
3. Clones the request with Authorization header
4. Forwards the modified request

### 4. Route Protection

The `auth.guard.ts` protects routes from unauthenticated access:

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  
  if (authService.isAuthenticated()) {
    return true;  // Allow access
  }
  
  router.navigate(['/login'], { 
    queryParams: { returnUrl: state.url } 
  });
  return false;  // Redirect to login
};
```

### 5. Reactive Authentication State

Uses Angular Signals for reactive authentication state:

```typescript
private readonly _token = signal<string | null>(null);
readonly isAuthenticated = computed(() => !!this._token());

// Automatically updates UI when authentication state changes
```

### 6. Logout Process

```typescript
logout(): void {
  localStorage.removeItem('token');  // Remove from storage
  this._token.set(null);              // Clear signal
  // User is redirected to login page
}
```

## API Communication

All API communication goes through the centralized API Gateway.

### API Gateway Configuration

- **Development**: `http://localhost:8080/api`
- **Production**: Configured via environment files

### Request Flow

```
Frontend (localhost:4200)
    ↓
HTTP Request with JWT header
    ↓
API Gateway (localhost:8080)
    ↓
[Authentication & Authorization]
    ↓
Route to appropriate microservice
    ↓
Microservice processes request
    ↓
Response returns through Gateway
    ↓
Frontend receives response
```

### Making API Calls

All HTTP requests are made through Angular's HttpClient with the interceptor automatically adding authentication headers:

```typescript
@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly apiUrl = `${environment.apiUrl}/events`;
  
  constructor(private http: HttpClient) {}
  
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
    // JWT token automatically attached by interceptor
  }
  
  createEvent(event: CreateEventDto): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }
}
```

### CORS Configuration

CORS is configured only in the API Gateway to allow requests from `http://localhost:4200`:

```java
// Spring Boot API Gateway CORS configuration
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}
```

### Error Handling

The `error-interceptor.ts` handles HTTP errors globally:

- 401 Unauthorized: Auto-logout and redirect to login
- 403 Forbidden: Show access denied message
- 500 Server Error: Display user-friendly error message
- Network errors: Retry logic with exponential backoff

## Build & Production

### Development Build

```bash
npm start
# or
ng serve
```

- Runs on `http://localhost:4200`
- Hot module replacement enabled
- Source maps enabled for debugging
- Uses development environment configuration

### Production Build

```bash
ng build --configuration production
```

**Build output:**
- Compiled files in `dist/booking-events-frontend/`
- Optimized and minified bundles
- Tree-shaking removes unused code
- AOT (Ahead-of-Time) compilation
- Production environment configuration applied

### Build Artifacts

After a successful production build, you'll find:

```
dist/booking-events-frontend/
├── browser/                    # Client-side assets
│   ├── index.html
│   ├── main-*.js               # Bundled JavaScript
│   ├── polyfills-*.js
│   └── styles-*.css
└── server/                     # SSR server bundle
    └── server.mjs
```

### Deploying to Production

#### Option 1: Static Hosting (Recommended for SPAs)

Serve the `dist/booking-events-frontend/browser/` folder using any static web server:

```bash
# Using serve package
npm install -g serve
serve -s dist/booking-events-frontend/browser

# Using nginx
# Copy contents to /usr/share/nginx/html
```

#### Option 2: SSR Deployment

```bash
# Build for SSR
npm run build:ssr

# Start SSR server
npm run serve:ssr:booking-events-frontend
```

### Preview Production Build Locally

```bash
# Build the application
ng build --configuration production

# Serve the production build
npm install -g serve
serve -s dist/booking-events-frontend/browser
```

### Performance Optimization

The production build includes:
- **Minification**: Reduces file sizes
- **Tree Shaking**: Removes unused code
- **AOT Compilation**: Faster rendering
- **Bundle Optimization**: Code splitting and lazy loading
- **Source Map Removal**: Smaller bundle sizes (optional)

## Common Issues & Troubleshooting

### Issue: CORS Errors

**Symptom**: Browser console shows CORS policy errors

**Solution**: Ensure the API Gateway has CORS configured to allow `http://localhost:4200`

```typescript
// Verify in browser console
// Expected: Access-Control-Allow-Origin header present
```

### Issue: 401 Unauthorized on Every Request

**Symptom**: All API requests return 401 even after login

**Solution**: 
1. Check if token is stored in localStorage
2. Verify the JWT interceptor is registered in app.config.ts
3. Ensure token hasn't expired
4. Check backend authentication endpoint

```typescript
// Debug in browser console
console.log(localStorage.getItem('token'));
```

### Issue: Port 4200 Already in Use

**Symptom**: `ng serve` fails with "port already in use"

**Solution**: Use a different port

```bash
ng serve --port 4201
```

### Issue: Environment Variables Not Working

**Symptom**: API calls going to wrong URL

**Solution**: Ensure you're importing from the correct environment file

```typescript
// Correct
import { environment } from '../environments/environment';

// Incorrect
import { environment } from './environment';
```

### Issue: Token Not Persisting After Refresh

**Symptom**: User logged out after page refresh

**Solution**: Verify token is being read from localStorage on app initialization

```typescript
// Check AuthService constructor
constructor(private http: HttpClient) {
  this._token.set(this.getInitialToken());  // Should read from localStorage
}
```

### Issue: Build Fails with Memory Error

**Symptom**: `FATAL ERROR: Ineffective mark-compacts near heap limit`

**Solution**: Increase Node.js memory limit

```bash
node --max-old-space-size=4096 node_modules/@angular/cli/bin/ng build
```

## Future Improvements

### Planned Features

- **Refresh Token Mechanism**: Implement automatic token refresh before expiration
- **Role-Based Access Control (RBAC)**: Different permissions for admin/user roles
- **Real-Time Updates**: WebSocket integration for live notifications
- **Event Calendar**: Visual calendar view for events
- **Payment Integration**: Online payment processing for bookings
- **Email Notifications**: Send booking confirmations via email
- **Social Login**: OAuth integration (Google, Facebook)
- **Event Reviews & Ratings**: User feedback system
- **Waitlist Management**: Queue system for sold-out events
- **Multi-Language Support**: i18n internationalization

### Technical Improvements

- **State Management**: Implement NgRx or NGXS for complex state
- **Caching Strategy**: Service worker for offline caching
- **Performance Monitoring**: Implement Angular Performance API
- **E2E Testing**: Add Cypress or Playwright tests
- **CI/CD Pipeline**: Automated testing and deployment
- **Docker Containerization**: Containerize the application
- **Kubernetes Deployment**: Orchestrate with K8s
- **API Documentation**: Integrate Swagger/OpenAPI
- **Error Tracking**: Sentry or LogRocket integration
- **Feature Flags**: Gradual feature rollout system

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
ng build --configuration production

# Build with SSR
ng build

# Serve SSR build
npm run serve:ssr:booking-events-frontend

# Lint code
ng lint

# Format code (if configured)
npm run format
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of a microservices system and is proprietary software.

## Support

For issues, questions, or contributions, please contact the development team or open an issue in the GitHub repository.

---

**Note**: This application is designed to work with the Spring Boot microservices backend. Ensure the backend services are running before starting the frontend application.