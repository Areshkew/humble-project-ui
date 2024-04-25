import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root' // This makes the service available application-wide
})
class PermissionsService {
  constructor(private authService: AuthService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    const expectedRole: string[] = route.data['Roles'];
    const isGuestAllowed = route.data['Guest'];
    const userRole = this.authService.getUserRoleFromToken();
    const isAuthenticated = this.authService.isAuthenticated();

    return (
      (isGuestAllowed != isAuthenticated)  // If guest, authenticated can't enter.
      &&
      (!expectedRole || expectedRole.includes(userRole)) // Allow if no specific role needed or if user has the expected role
    ) ;
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  const permissionsService = inject(PermissionsService);
  const canActivateResult = permissionsService.canActivate(route, state);

  if (!canActivateResult) {
    const router = inject(Router);
    return router.createUrlTree(['/inicio']);
  }

  return canActivateResult;
};


//Verifica si el usuario esta logged o si es un visitante