import { AuthService } from './auth.service';
import { LoginRequest } from '../../features/auth/models/login.request';
import { RegisterRequest } from '../../features/auth/models/register.request';

describe('AuthService', () => {
  let service: AuthService;
  let mockHttp: any;

  const mockLoginRequest: LoginRequest = {
    username: 'testuser',
    password: 'testpass123'
  };

  const mockLoginResponse = {
    token: 'mock-jwt-token',
    username: 'testuser',
    email: 'test@example.com'
  };

  const mockRegisterRequest: RegisterRequest = {
    username: 'newuser',
    email: 'new@example.com',
    password: 'password123'
  };

  beforeEach(() => {
    mockHttp = {
      post: () => ({ subscribe: (cb: any) => cb(mockLoginResponse) })
    };
    service = new AuthService(mockHttp);
  });

  afterEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login user and return token', () => {
      service.login(mockLoginRequest).subscribe((response) => {
        expect(response).toEqual(mockLoginResponse);
        expect(response.token).toBe('mock-jwt-token');
      });
    });

    it('should handle login error', () => {
      let capturedError: any = null;
      mockHttp = {
        post: () => ({ subscribe: (cb: any) => cb.error(new Error('Unauthorized')) })
      };
      service = new AuthService(mockHttp);
      
      service.login(mockLoginRequest).subscribe({
        error: (error) => {
          capturedError = error;
          expect(error).toBeTruthy();
        }
      });
    });

    it('should handle invalid credentials', () => {
      mockHttp = {
        post: () => ({ subscribe: (cb: any) => cb.error(new Error('Invalid credentials')) })
      };
      service = new AuthService(mockHttp);
      
      service.login(mockLoginRequest).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('register', () => {
    it('should register new user', () => {
      mockHttp = {
        post: () => ({ subscribe: (cb: any) => cb(undefined) })
      };
      service = new AuthService(mockHttp);
      
      service.register(mockRegisterRequest).subscribe(() => {
        // Success callback
      });
    });

    it('should handle registration error', () => {
      mockHttp = {
        post: () => ({ subscribe: (cb: any) => cb.error(new Error('User already exists')) })
      };
      service = new AuthService(mockHttp);
      
      service.register(mockRegisterRequest).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });

    it('should handle validation errors', () => {
      const invalidRequest = { ...mockRegisterRequest, email: 'invalid-email' };
      mockHttp = {
        post: () => ({ subscribe: (cb: any) => cb.error(new Error('Validation error')) })
      };
      service = new AuthService(mockHttp);
      
      service.register(invalidRequest).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('token management', () => {
    it('should set and get token', () => {
      const testToken = 'test-token-123';
      service.setToken(testToken);
      expect(service.getToken()).toBe(testToken);
    });

    it('should return null when no token exists', () => {
      expect(service.getToken()).toBeNull();
    });

    it('should check authentication status', () => {
      expect(service.isAuthenticated()).toBe(false);
      
      service.setToken('test-token');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should logout and clear token', () => {
      service.setToken('test-token');
      expect(service.isAuthenticated()).toBe(true);
      
      service.logout();
      expect(service.isAuthenticated()).toBe(false);
      expect(service.getToken()).toBeNull();
    });
  });

  describe('SSR compatibility', () => {
    it('should handle localStorage not being available', () => {
      const originalLocalStorage = globalThis.localStorage;
      // @ts-ignore
      delete globalThis.localStorage;
      
      expect(service.isAuthenticated()).toBe(false);
      expect(service.getToken()).toBeNull();
      
      service.setToken('test-token');
      // Token is still stored in signal even without localStorage
      expect(service.getToken()).toBe('test-token');
      expect(service.isAuthenticated()).toBe(true);
      
      service.logout();
      expect(service.getToken()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
      
      // Restore localStorage
      globalThis.localStorage = originalLocalStorage;
    });
  });
});
