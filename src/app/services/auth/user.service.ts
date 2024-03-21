import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { User } from '@models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userRegistrationSubject = new BehaviorSubject<any>(null);
  private userLoginSubject = new BehaviorSubject<any>(null);
  private userUpdateSubject = new BehaviorSubject<any>(null);
  private userDeleteSubject = new BehaviorSubject<any>(null);
  private userRootChangePasswordSubject = new BehaviorSubject<any>(null);

  private userAdminSubject = new BehaviorSubject<User[]>([]);
  private userRootSubject = new BehaviorSubject<User[]>([]);

  userRegistration$ = this.userRegistrationSubject.asObservable();
  userLogin$ = this.userLoginSubject.asObservable();
  userUpdate$ = this.userUpdateSubject.asObservable();
  userDelete$ = this.userDeleteSubject.asObservable();
  userRootChangePassword$ = this.userRootChangePasswordSubject.asObservable();

  userAdmin$ = this.userAdminSubject.asObservable();
  userRoot$ = this.userRootSubject.asObservable();
  

  constructor(private http: HttpClient) { }

  //Servicios de envío de información
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

  updateUser(data: any): Observable<any> {
    return this.http.put(`/api/user/update`, data).pipe(
      tap(response => this.userUpdateSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.userUpdateSubject))
    );
  }
  
  deleteUser(DNIuser: String): Observable<any> {
    return this.http.put(`/api/user/delete`, DNIuser).pipe(
      tap(response => this.userRootChangePasswordSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.userRootChangePasswordSubject))
    );
  }
  
  changeRootPassword(password: String): Observable<any> {
    return this.http.put(`/api/user/delete`, password).pipe(
      tap(response => this.userDeleteSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.userDeleteSubject))
    );
  }

  //Servicios de recibir información
  getAdminUsers(): Observable<any> {
    return this.http.get<User[]>(`/api/user/adminusers`).pipe(
      tap(users => this.userAdminSubject.next(users)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.userAdminSubject))
    );
  }

  getRootInformation(): Observable<any> {
    return this.http.get<User[]>(`/api/user/root`).pipe(
      tap(users => this.userRootSubject.next(users)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.userRootSubject))
    );
  }

  


  private handleError(error: any, subject: BehaviorSubject<any>): Observable<never> {
    subject.error(error);
    subject.next(null);

    return throwError(() => new Error(`${error.error.detail}`));
  }
}

//Comunicacion con el back, donde se envian los datos
