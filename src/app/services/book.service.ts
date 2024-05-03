import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(private http: HttpClient) { }

  searchBooks(query: string): Observable<any>{
    const params = new HttpParams()
        .set("q", query)

    return this.http.get("/api/book/search", { params })
      .pipe(
        catchError((error) => {
          console.error('Error searching books:', error);
          throw error;
        })
    );
  }

  getBooks(filters: any): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    });
    return this.http.get("/api/book/explore", { params: params })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error al cargar los libros', error);
          const message = `Error al cargar libros: No se encontraron libros`;
          return throwError(() => new Error(message));
        })
      );
  }

  getBookByISSN(issn: string): Observable<any> {
    return this.http.get(`/api/book/${issn}`).pipe(
      catchError(error => {
        console.error('Error fetching book by ISSN:', error);
        throw error;
      })
    );
  }

}
