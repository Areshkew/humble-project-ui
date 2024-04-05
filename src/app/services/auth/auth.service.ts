import { Injectable } from '@angular/core';
import { CookieService } from '@services/cookie.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  constructor(private cookieService: CookieService) { 
    this.checkAuthStatus();
  }

  checkAuthStatus(){
    const isAuthenticated = this.isAuthenticated();
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  logout(){
    this.cookieService.deleteCookie("Bearer");
    this.isAuthenticatedSubject.next(false);
  }

  getUserRoleFromToken() {
    const token = this.cookieService.getCookie('Bearer');
    if (!token) return null;
  
    const decodedPayload = this.decodeJwtPayload(token);
    return decodedPayload ? decodedPayload.role : null;
  }

  isAuthenticated(): boolean {
    const token = this.cookieService.getCookie('Bearer');
    if (!token) return false;

    const decodedPayload = this.decodeJwtPayload(token);
    const expirationDate = new Date(decodedPayload.exp * 1000);
    const isValid = expirationDate > new Date();

    this.isAuthenticatedSubject.next(isValid);
    return isValid;
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
