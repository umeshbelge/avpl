import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isFirstLogin = false;
  user: any;
  stats: any[] = [];
  recentActivities: any[] = [];
  isDarkMode = false;

  constructor(
    private authService: AuthService, 
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.isDarkMode = this.themeService.isDark();
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const isFirstLogin = params['isFirstLogin'];

      if (token) {
        localStorage.setItem('token', token);
      }

      if (isFirstLogin) {
        localStorage.setItem('isFirstLogin', isFirstLogin);
      }

      // Clean the URL
      if(token || isFirstLogin){
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true
        });
      }
    });

    this.isFirstLogin = localStorage.getItem('isFirstLogin') === 'true';
    if (this.isFirstLogin) {
      localStorage.removeItem('isFirstLogin');
    }

    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get('http://localhost:5000/api/data', { headers }).subscribe((res: any) => {
      this.user = res.user;
      this.stats = res.stats;
      this.recentActivities = res.recentActivities;
    });
  }

  logout() {
    this.authService.logout();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.isDark();
  }
}
