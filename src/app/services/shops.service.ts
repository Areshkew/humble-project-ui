import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Shop } from '@models/shop.model';
import { Observable, Subject, catchError, shareReplay, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopsService {
  private shopsCreationSubject = new Subject<any>();
  private shopsSubject = new Subject<any>();
  shopCreation$ = this.shopsCreationSubject.asObservable()
  shops$ = this.shopsSubject.asObservable();

  constructor(private http: HttpClient) { }

  getShops(): Observable<any>{
    return this.http.get(`/api/shop/get`)
      .pipe(
        catchError((error: any) => {
          console.error('Error al cargar tiendas', error);
          const message = `Error: ${error.error.detail}`;
          return throwError(() => new Error(message));
        })
      );
  }
  
  createShop(data: Shop): Observable<any> {
    return this.http.post(`/api/shop/create`, data).pipe(
      tap(response => this.shopsCreationSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.shopsCreationSubject))
    );
  }

  deleteShops(data: any): Observable<any> {
    console.log(data);
    
    return this.http.post(`/api/shop/delete`, data).pipe(
      tap(response => this.shopsCreationSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.shopsCreationSubject))
    );
  }

  getShop(ID: number, fields: string[]): Observable<any> {
    return this.http.post(`/api/shop/${ID}`, fields).pipe(
      tap(response => this.shopsSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.shopsSubject))
    );
  }
  editShop(ID: number, fields: string[]): Observable<any> {
    return this.http.post(`/api/shop/edit/${ID}`, fields).pipe(
      tap(response => this.shopsSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.shopsSubject))
    );
  }

  private handleError(error: any, subject: Subject<any>): Observable<never> {
    subject.error(error);
    subject.next(null);

    console.log(error.error)
    return throwError(() => new Error(`${error.error.detail}`));
  }
}
