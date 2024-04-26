import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@models/user.model';
import { Observable, Subject, catchError, shareReplay, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RootService {
  private adminCreationSubject = new Subject<any>();
  private adminsSubject = new Subject<any>();
  private editInfoSubject = new Subject<any>();

  adminCreation$ = this.adminCreationSubject.asObservable();
  admins$ = this.adminsSubject.asObservable();
  

  constructor(private http: HttpClient) { }  

  createAdmin(data: User): Observable<any> {
    return this.http.post(`/api/root/create-admin`, data).pipe(
      tap(response => this.adminCreationSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.adminCreationSubject))
    );
  }
  getAdmins(): Observable<any> {
    return this.http.get(`/api/root/admins`).pipe(
      tap(response => this.adminsSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.adminsSubject))
    );
  }
  deleteAdmins(data: any): Observable<any> {
    return this.http.post(`/api/root/delete-admins`, data).pipe(
      tap(response => this.adminCreationSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.adminCreationSubject))
    );
  }
  getAdmin(DNI:string, fields: string[]): Observable<any> {
    return this.http.post(`/api/root/admin/${DNI}`, fields).pipe(
      tap(response => this.adminsSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.adminsSubject))
    );
  }
  editAdmin(DNI:string, fields: string[]): Observable<any> {
    return this.http.post(`/api/root/edit-admin/${DNI}`, fields).pipe(
      tap(response => this.adminsSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.adminsSubject))
    );
  }

  editPassword(data: any): Observable<any> {
    return this.http.post(`/api/root/change-password`, data).pipe(
      tap(response => this.editInfoSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.editInfoSubject))
    );
  }

  private handleError(error: any, subject: Subject<any>): Observable<never> {
    subject.error(error);
    subject.next(null);

    console.log(error.error)
    return throwError(() => new Error(`${error.error.detail}`));
  }
}
