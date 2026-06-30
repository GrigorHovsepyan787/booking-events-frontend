import { HeaderComponent } from './header.component';
import { AuthService } from '../core/services/auth.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let authService: any;

  beforeEach(() => {
    authService = { logout: vi.fn(), isAuthenticated: vi.fn() };
    component = new HeaderComponent(authService as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('authentication state', () => {
    it('should have authService injected', () => {
      expect(component.authService).toBe(authService);
    });
  });

  describe('logout functionality', () => {
    it('should call authService.logout when logout() is called', () => {
      component.authService.logout();
      expect(authService.logout).toHaveBeenCalled();
    });
  });

  describe('authentication check', () => {
    it('should call authService.isAuthenticated', () => {
      authService.isAuthenticated.mockReturnValue(true);
      const result = component.authService.isAuthenticated();
      expect(result).toBe(true);
      expect(authService.isAuthenticated).toHaveBeenCalled();
    });
  });
});