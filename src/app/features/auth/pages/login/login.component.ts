import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginRequest } from '../../models/login.request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService) {}

  login(): void {

    const request: LoginRequest = {
      username: this.username,
      password: this.password
    };

    this.authService.login(request)
      .subscribe({
        next: response => {
          console.log('Success', response);
        },
        error: err => {
          console.error(err);
        }
      });
  }
}
