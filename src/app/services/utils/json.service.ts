import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JsonService {
    private jsonSubject = new BehaviorSubject<any>(null);
    private jsonPath = '../../assets/json/';
    json$ = this.jsonSubject.asObservable();
    
    constructor(private http: HttpClient){}

    fetchJson(name: string): Observable<any> {
      return this.http.get(`${this.jsonPath}${name}.json`).pipe(
        tap(response => this.jsonSubject.next(response)),
        shareReplay(1),
        catchError(error => this.handleError(error, this.jsonSubject))
      );
    }

    private handleError(error: any, subject: BehaviorSubject<any>): Observable<never> {
      subject.error(error);
      subject.next(null);
  
      return throwError(() => new Error(`${error.error.detail}`));
    }
}