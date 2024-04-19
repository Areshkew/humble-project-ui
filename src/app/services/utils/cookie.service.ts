import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor() { }

  setCookie(name: string, value: string, hours: number, sameSite: 'Lax' | 'Strict' | 'None' = 'Lax', secure: boolean = true) {
    let expires = '';
    if (hours) {
      const date = new Date();
      date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
      expires = `; expires=${date.toUTCString()}`;
    }
    // Build the cookie string with the SameSite and Secure attributes
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${expires}; path=/`;
    cookieString += `; SameSite=${sameSite}`;
    if (secure || sameSite === 'None') {
      // Secure must be set if SameSite is None
      cookieString += '; Secure';
    }
    document.cookie = cookieString;
  }

  getCookie(name: string): string | null {
    const nameEQ = encodeURIComponent(name) + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  }

  deleteCookie(name: string) {
    this.setCookie(name, '', -1, 'Lax', false);
  }
}
