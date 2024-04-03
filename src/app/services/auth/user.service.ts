import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { User } from '@models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userRegistrationSubject = new Subject<any>();
  private userLoginSubject = new Subject<any>();
  private emailSubject = new BehaviorSubject<any>(null);
  private codeSubject = new Subject<string | null>();
  private passwordSubject = new Subject<string | null>();
  private editInfoSubject = new Subject<any>();
  private editPasswordSubject = new Subject<any>();
  
  userRegistration$ = this.userRegistrationSubject.asObservable();
  userLogin$ = this.userLoginSubject.asObservable();
  email$ = this.emailSubject.asObservable();
  code$ = this.codeSubject.asObservable();
  password$ = this.passwordSubject.asObservable();
  editInfo$ = this.editInfoSubject.asObservable();
  editPassword$ = this.editPasswordSubject.asObservable();
  
  
  constructor(private http: HttpClient, private authService: AuthService) { }  
  // EndPoint Access
  register(data: User): Observable<any> {
    return this.http.post(`/api/user/signup`, data).pipe(
      tap(response => this.userRegistrationSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.userRegistrationSubject))
    );
  }

  login(data: any): Observable<any> {
    return this.http.post(`/api/user/login`, data).pipe(
      tap(response => this.userLoginSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.userLoginSubject))
    );
  }

  setData(data: any) {
    this.emailSubject.next(data)
  }

  getData() {
    return this.emailSubject.asObservable();
  }

  sendRecoveryEmail(email: string): Observable<any> {
    return this.http.post(`/api/user/passwordrecover`, email ).pipe(
      tap(response => this.emailSubject.next(email)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.emailSubject))
    );
  }

  verifyRecoveryCode(code: string): Observable<any> {
    return this.http.post(`/api/user/codeverification`, code).pipe(
      tap(response => this.codeSubject.next(code)),
      catchError(error => this.handleError(error, this.codeSubject))
    );
  }

  resetPassword(newPassword: string): Observable<any> {
    return this.http.post(`/api/user/newpassword`, newPassword).pipe(
      tap(response => this.passwordSubject.next(newPassword)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.passwordSubject))
    );
  }

  editPersonalInfo(data: User): Observable<any> {
    return this.http.post(`/api/user/editPersonalInfo`, data).pipe(
      tap(response => this.editInfoSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.editInfoSubject))
    );
  }
  
  editPassword(data: any): Observable<any> {
    return this.http.post(`/api/user/editPasssword`, data).pipe(
      tap(response => this.editPasswordSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.editPasswordSubject))
    );
  }

  private handleError(error: any, subject: Subject<any>): Observable<never> {
    subject.error(error);
    subject.next(null);

    return throwError(() => new Error(`${error.error.detail}`));
  }
}

//Comunicacion con el back, donde se envian los datos
