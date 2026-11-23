import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { AuthService } from './auth-service';
import { Router } from '@angular/router';

export const authStateInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError(err => {
      if (err.status === 401 && authService.authState() === "authenticated" && router.url !== "/auth?mode=login") {
        authService.setLoggedIn(false);
        router.navigateByUrl("/auth?mode=signin&reason=login-required");
      }
      throw err;
    })
  );
};
