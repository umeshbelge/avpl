import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient, private router: Router) { }

  authenticate(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/authenticate`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        if (res.isFirstLogin) {
          localStorage.setItem('isFirstLogin', 'true');
        }
        this.router.navigate(['/dashboard']);
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        if (res.isFirstLogin) {
          localStorage.setItem('isFirstLogin', 'true');
        }
        this.router.navigate(['/dashboard']);
      })
    );
  }

  signup(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, credentials);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isFirstLogin');
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
