import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-unified-login',
  templateUrl: './unified-login.component.html',
  styleUrls: ['./unified-login.component.css']
})
export class UnifiedLoginComponent {
  credentials = { email: '', password: '' };

  constructor(private authService: AuthService) { }

  onSubmit() {
    this.authService.authenticate(this.credentials).subscribe();
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:5000/api/auth/google';
  }
}
