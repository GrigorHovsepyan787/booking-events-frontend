import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginRequest } from '../../models/login.request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  public loginForm: FormGroup;
  public errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get form() {
    return this.loginForm.controls;
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;

    const request: LoginRequest = {
      username: this.form['username'].value,
      password: this.form['password'].value
    };

    this.authService.login(request)
      .subscribe({
        next: response => {
          this.authService.setToken(response.accessToken);
          console.log('Login successful', response);
          this.router.navigate(['/events']);
        },
        error: err => {
          console.error('Login failed:', err);
          this.errorMessage = 'Login failed. Please check your credentials.';
        }
      });
  }
}
