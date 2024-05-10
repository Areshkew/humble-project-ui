import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, pipe, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(private http: HttpClient) { }

  getBook(ISSN: string): Observable<any>{
    return this.http.get(`/api/book/${ISSN}`)
      .pipe(
        catchError((error: any) => {
          console.error('Error al cargar libro', error);
          const message = `Error al cargar libro: ${error.error.detail}`;
          return throwError(() => new Error(message));
        })
      );
  }

  createBook(data: any): Observable<any> {
    return this.http.post(`/api/book/create-book`, data)
      .pipe(
        catchError((error: any) => {
          console.error('Error al cargar los libros', error);
          const message = `Error al crear libro: ${error.error.detail}`;
          return throwError(() => new Error(message));
        })
      );
  }
  searchBooks(query: string): Observable<any>{
    const params = new HttpParams()
        .set("q", query)

    return this.http.get("/api/book/search", { params })
      .pipe(
        catchError((error) => {
          console.error('Error buscando libros:', error);
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


  deleteBooks(data: any): Observable<any> {
    return this.http.post(`/api/book/delete-books`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error al cargar los libros', error);
          const message = `Error al borrar libros.`;
          return throwError(() => new Error(message));
        })
      );
  }
}
