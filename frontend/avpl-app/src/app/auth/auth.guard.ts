import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = route.queryParams['token'];

  if (authService.isLoggedIn() || token) {
    return true;
  } else {
    router.navigate(['/auth']);
    return false;
  }
};
