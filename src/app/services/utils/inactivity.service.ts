import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { CookieService } from './cookie.service';


type sessionStatus = 'inactive' | 'expired' | null;

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private lastActivityTimestamp = Date.now();
  private readonly inactivityLimit = 3 * 60 * 1000; // 3 min
  private inactiveOrExpiredSubject = new Subject<sessionStatus>();
  private inactivityInterval: any;
  inactiveOrExpire$ = this.inactiveOrExpiredSubject.asObservable();

  constructor(private confirmationService: ConfirmationService, private authService: AuthService, private router: Router, private cookieService: CookieService) { 
    this.startActivityMonitor();
  }

  recordActivity() {
    this.inactiveOrExpiredSubject.next(null);
    this.lastActivityTimestamp = Date.now();
  }

  private startActivityMonitor() {
    const token = this.cookieService.getCookie('Bearer');

    this.inactivityInterval = setInterval(() => {
      if (Date.now() - this.lastActivityTimestamp > this.inactivityLimit) {
        const authenticated = this.authService.isAuthenticated();

        if(authenticated && token) this.inactiveOrExpiredSubject.next("inactive")
        else if(!authenticated && token) this.inactiveOrExpiredSubject.next("expired")
      }
      this.lastActivityTimestamp = Date.now();
    }, this.inactivityLimit);
  }

  showInactivityDialog() {
    this.confirmationService.confirm({
      key: "global-dialog",
      message: 'Se ha detectado inactividad, ¿Deseas terminar la sesión?',
      acceptLabel: "Extender Sesión",
      rejectLabel: "Cerrar Sesión",
      reject: () => {
        this.authService.logout()
        this.router.navigate(["/inicio"])
      }
    });
  }

  showTokenExpirationDialog(){
    this.confirmationService.confirm({
      key: "global-dialog",
      message: 'Tu sesión expiró, inicia sesión nuevamente.',
      acceptLabel: "Aceptar",
      accept: () =>{
        this.authService.logout()
        this.router.navigate(["/inicio"])
      }
        ,
      rejectVisible: false
    })
  }
}
