import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };

  constructor(private authService: AuthService) { }

  onSubmit() {
    this.authService.authenticate(this.credentials).subscribe();
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:5000/api/auth/google';
  }
}
