import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { CookieService } from '@services/cookie.service';

@Injectable({
  providedIn: 'root' // This makes the service available application-wide
})
class PermissionsService {
  constructor(private cookieService: CookieService, private router: Router){}

  isAuthenticated(): boolean {
    return !!this.cookieService.getCookie('Bearer');
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    return route.data['Guest'] != this.isAuthenticated();
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  return inject(PermissionsService).canActivate(route, state);
};


//Verifica si el usuario esta logged o si es un visitante