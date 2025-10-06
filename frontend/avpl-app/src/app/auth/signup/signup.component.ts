import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  credentials = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService.signup(this.credentials).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
