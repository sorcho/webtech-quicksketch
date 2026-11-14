import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth-service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return toObservable(authService.authState).pipe(
    filter(s => s !== 'unknown'),
    take(1),
    map(s =>
      (s === "authenticated") ? true : router.parseUrl("/auth?mode=signin&reason=login-required")
    )
  )
};
