import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: any;
  let router: any;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    authService = { login: vi.fn(), setToken: vi.fn(), isAuthenticated: vi.fn() };
    router = { navigate: vi.fn() };
    formBuilder = new FormBuilder();

    component = new LoginComponent(formBuilder, authService, router as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should have required validators on form fields', () => {
    const usernameControl = component.loginForm.get('username');
    const passwordControl = component.loginForm.get('password');

    expect(usernameControl?.errors?.['required']).toBeDefined();
    expect(passwordControl?.errors?.['required']).toBeDefined();
  });

  it('should mark form as invalid when empty', () => {
    expect(component.loginForm.invalid).toBe(true);
  });

  it('should mark form as valid when filled', () => {
    component.loginForm.patchValue({
      username: 'testuser',
      password: 'testpass123'
    });

    expect(component.loginForm.valid).toBe(true);
  });

  describe('login method', () => {
    beforeEach(() => {
      component.loginForm.patchValue({
        username: 'testuser',
        password: 'testpass123'
      });
      component.loginForm.get('username')?.markAsTouched();
      component.loginForm.get('password')?.markAsTouched();
      
      authService.login.mockReturnValue({
        subscribe: (observer: any) => {
          observer.next({ token: 'mock-token', username: 'testuser', email: 'test@example.com' });
          return { unsubscribe: () => {} };
        }
      } as any);
    });

    it('should not submit when form is invalid', () => {
      component.loginForm.patchValue({
        username: '',
        password: ''
      });
      
      component.login();
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should call authService.login with correct credentials', () => {
      component.loginForm.patchValue({
        username: 'testuser',
        password: 'testpass123'
      });

      component.login();

      expect(authService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpass123'
      });
    });

    it('should set token on successful login', () => {
      component.loginForm.patchValue({
        username: 'testuser',
        password: 'testpass123'
      });

      component.login();

      expect(authService.setToken).toHaveBeenCalledWith('mock-token');
    });

    it('should navigate to events on successful login', () => {
      component.loginForm.patchValue({
        username: 'testuser',
        password: 'testpass123'
      });

      component.login();

      expect(router.navigate).toHaveBeenCalledWith(['/events']);
    });

    it('should handle login error', () => {
      authService.login.mockReturnValue({
        subscribe: (observer: any) => {
          observer.error(new Error('Invalid credentials'));
          return { unsubscribe: () => {} };
        }
      } as any);

      component.loginForm.patchValue({
        username: 'testuser',
        password: 'wrongpass'
      });

      component.login();

      expect(authService.setToken).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('form validation', () => {
    it('should show error when username is touched and empty', () => {
      const usernameControl = component.loginForm.get('username');
      usernameControl?.markAsTouched();
      
      expect(usernameControl?.invalid).toBe(true);
      expect(usernameControl?.errors?.['required']).toBe(true);
    });

    it('should show error when password is touched and empty', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.markAsTouched();
      
      expect(passwordControl?.invalid).toBe(true);
      expect(passwordControl?.errors?.['required']).toBe(true);
    });

    it('should mark all fields as touched on submit when invalid', () => {
      component.loginForm.patchValue({
        username: '',
        password: ''
      });

      component.login();

      expect(component.loginForm.get('username')?.touched).toBe(true);
      expect(component.loginForm.get('password')?.touched).toBe(true);
    });
  });

  describe('template integration', () => {
    it('should render login form', () => {
      expect(component.loginForm).toBeDefined();
    });

    it('should disable submit button when form is invalid', () => {
      expect(component.loginForm.invalid).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      component.loginForm.patchValue({
        username: 'testuser',
        password: 'testpass123'
      });
      
      expect(component.loginForm.valid).toBe(true);
    });

    it('should have link to register page', () => {
      expect(component.loginForm).toBeDefined();
    });
  });
});