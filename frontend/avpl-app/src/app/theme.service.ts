import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = false;

  constructor() {
    const storedTheme = localStorage.getItem('isDarkMode');
    if (storedTheme) {
      this.isDarkMode = JSON.parse(storedTheme);
      this.updateTheme();
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkMode', JSON.stringify(this.isDarkMode));
    this.updateTheme();
  }

  private updateTheme() {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  isDark(): boolean {
    return this.isDarkMode;
  }
}
