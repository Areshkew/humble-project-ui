import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopsService {

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
}
