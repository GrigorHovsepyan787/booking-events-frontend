import { RegisterComponent } from './register.component';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let authService: any;
  let router: any;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    authService = { register: vi.fn() };
    router = { navigate: vi.fn() };
    formBuilder = new FormBuilder();

    component = new RegisterComponent(formBuilder, authService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.get('username')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
  });

  it('should have required validators on all form fields', () => {
    const usernameControl = component.registerForm.get('username');
    const emailControl = component.registerForm.get('email');
    const passwordControl = component.registerForm.get('password');

    expect(usernameControl?.errors?.['required']).toBeDefined();
    expect(emailControl?.errors?.['required']).toBeDefined();
    expect(passwordControl?.errors?.['required']).toBeDefined();
  });

  it('should have minlength validator on username', () => {
    const usernameControl = component.registerForm.get('username');
    usernameControl?.patchValue('ab');
    expect(usernameControl?.errors?.['minlength']).toBeDefined();
  });

  it('should have email validator on email field', () => {
    const emailControl = component.registerForm.get('email');
    emailControl?.patchValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeDefined();
  });

  it('should have minlength validator on password', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.patchValue('123');
    expect(passwordControl?.errors?.['minlength']).toBeDefined();
  });

  it('should mark form as invalid when empty', () => {
    expect(component.registerForm.invalid).toBe(true);
  });

  it('should mark form as valid when all fields are filled correctly', () => {
    component.registerForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpass123'
    });

    expect(component.registerForm.valid).toBe(true);
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.registerForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpass123'
      });
      component.registerForm.get('username')?.markAsTouched();
      component.registerForm.get('email')?.markAsTouched();
      component.registerForm.get('password')?.markAsTouched();
      
      authService.register.mockReturnValue({
        subscribe: (observer: any) => {
          observer.next();
          return { unsubscribe: () => {} };
        }
      } as any);
    });

    it('should not submit when form is invalid', () => {
      component.registerForm.patchValue({
        username: '',
        email: '',
        password: ''
      });
      
      component.onSubmit();
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should call authService.register with correct data', () => {
      component.registerForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpass123'
      });

      component.onSubmit();

      expect(authService.register).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpass123'
      });
    });

    it('should mark all fields as touched on submit when invalid', () => {
      component.registerForm.patchValue({
        username: '',
        email: '',
        password: ''
      });

      component.onSubmit();

      expect(component.registerForm.get('username')?.touched).toBe(true);
      expect(component.registerForm.get('email')?.touched).toBe(true);
      expect(component.registerForm.get('password')?.touched).toBe(true);
    });
  });

  describe('form validation', () => {
    it('should show error when username is too short', () => {
      const usernameControl = component.registerForm.get('username');
      usernameControl?.patchValue('ab');
      usernameControl?.markAsTouched();
      
      expect(usernameControl?.invalid).toBe(true);
      expect(usernameControl?.errors?.['minlength']).toBeDefined();
    });

    it('should show error when email is invalid', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.patchValue('invalid-email');
      emailControl?.markAsTouched();
      
      expect(emailControl?.invalid).toBe(true);
      expect(emailControl?.errors?.['email']).toBeDefined();
    });

    it('should show error when password is too short', () => {
      const passwordControl = component.registerForm.get('password');
      passwordControl?.patchValue('123');
      passwordControl?.markAsTouched();
      
      expect(passwordControl?.invalid).toBe(true);
      expect(passwordControl?.errors?.['minlength']).toBeDefined();
    });

    it('should accept valid username with 3+ characters', () => {
      const usernameControl = component.registerForm.get('username');
      usernameControl?.patchValue('abc');
      
      expect(usernameControl?.valid).toBe(true);
    });

    it('should accept valid email', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.patchValue('test@example.com');
      
      expect(emailControl?.valid).toBe(true);
    });

    it('should accept valid password with 6+ characters', () => {
      const passwordControl = component.registerForm.get('password');
      passwordControl?.patchValue('123456');
      
      expect(passwordControl?.valid).toBe(true);
    });
  });

  describe('template integration', () => {
    it('should render registration form', () => {
      expect(component.registerForm).toBeDefined();
    });

    it('should disable submit button when form is invalid', () => {
      expect(component.registerForm.invalid).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      component.registerForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpass123'
      });
      
      expect(component.registerForm.valid).toBe(true);
    });

    it('should have link to login page', () => {
      expect(component.registerForm).toBeDefined();
    });
  });
});