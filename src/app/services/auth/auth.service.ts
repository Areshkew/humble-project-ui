import { Injectable } from '@angular/core';
import { CookieService } from '@services/utils/cookie.service';
import { ConfirmationService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private roleSubject = new BehaviorSubject<string>("guest");
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  role$ = this.roleSubject.asObservable();
  
  constructor(private cookieService: CookieService, private confirmationService: ConfirmationService) { 
    this.checkAuthStatus();
  }

  checkAuthStatus(){
    const isAuthenticated = this.isAuthenticated();
    const userRole = this.getUserRoleFromToken();
    this.isAuthenticatedSubject.next(isAuthenticated);
    this.roleSubject.next(userRole);
  }

  logout(){
    this.cookieService.deleteCookie("Bearer");
    this.isAuthenticatedSubject.next(false);
    this.roleSubject.next("guest");
  }

  getUserRoleFromToken() {
    const token = this.cookieService.getCookie('Bearer');
    if (!token)
      return "guest";
    
    const decodedPayload = this.decodeJwtPayload(token);
    const userRole = decodedPayload ? decodedPayload.role : null;
   
    this.roleSubject.next(userRole);
    return userRole;
  }

  isAuthenticated(): boolean {
    const token = this.cookieService.getCookie('Bearer');
    if (!token)
      return false;

    const decodedPayload = this.decodeJwtPayload(token);
    const expirationDate = new Date(decodedPayload.exp * 1000);
    const isValid = expirationDate > new Date();
    const userRole = decodedPayload ? decodedPayload.role : null;

    this.roleSubject.next(userRole);
    this.isAuthenticatedSubject.next(isValid);

    return isValid;
  }

  getUserIdFromToken(): string | null {
    const token = this.cookieService.getCookie('Bearer');

    if (!token)
      return null;
    
    const decodedPayload = this.decodeJwtPayload(token);
    const userId = decodedPayload ? decodedPayload.sub : null;
   
    return userId;
  }

  private decodeJwtPayload(token: string) {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Formato de token JWT inválido.');
    }
    
    const payload = parts[1];
    const decodedPayload = atob(payload);
    
    return JSON.parse(decodedPayload);
  }

}
