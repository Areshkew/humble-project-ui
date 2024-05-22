import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private addCardSubject = new Subject<any>();
  private getCardsSubject = new Subject<any>();
  private deleteCardSubject = new Subject<any>();

  addCard$ = this.addCardSubject.asObservable();
  getCards$ = this.getCardsSubject.asObservable();
  deleteCard$ = this.deleteCardSubject.asObservable();

  constructor(private http: HttpClient) { }

  addCard(card: any): Observable<any> {
    return this.http.post(`/api/payment/create-card`, card).pipe(
      tap(response => this.addCardSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.addCardSubject))
    );
  }

  getCards(): Observable<any> {
    return this.http.get(`/api/payment/cards`).pipe(
      tap(response => this.getCardsSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.getCardsSubject))
    );
  }

  deleteCard(card_num: string): Observable<any> {
    return this.http.post(`/api/payment/delete-card/${card_num}`, {}).pipe(
      tap(response => this.deleteCardSubject.next(response)),
      shareReplay(1),
      catchError(error => this.handleError(error, this.deleteCardSubject))
    );
  }

  private handleError(error: any, subject: Subject<any>): Observable<never> {
    subject.error(error);
    subject.next(null);
    return throwError(() => new Error(`${error.error.detail}`));
  }
}
