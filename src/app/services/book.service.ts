import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, pipe, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(private http: HttpClient) { }

  getBook(ISSN: string): Observable<any> {
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
  searchBooks(query: string): Observable<any> {
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

  editBook(issn: string, data: any): Observable<any> {
    return this.http.post(`api/book/edit-book/${issn}`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error al editar libro: ', error);
          const message = `Error al editar libro.`;
          return throwError(() => new Error(message));
        })
      )
  }

  getPersonalBook(ISSN: string): Observable<any> {
    return this.http.get(`/api/book/personal/${ISSN}`)
      .pipe(
        catchError((error: any) => {
          console.error('Error al cargar libro personal', error);
          const message = `Error al cargar libro personal: ${error.error.detail}`;
          return throwError(() => new Error(message));
        })
      );
  }

  getMultiplePersonalBook(ISSN: string[]): Observable<any> {
    const issnString = ISSN.join(',');
    return this.http.get(`/api/book/multiple-personal/${issnString}`)
      .pipe(
        catchError((error: any) => {
          console.error('Error al cargar libro personal', error);
          const message = `Error al cargar libro personal: ${error.error.detail}`;
          return throwError(() => new Error(message));
        })
      );
  }

  getMultiplesBook(ISSN: string[]): Observable<any> {
    const issnString = ISSN.join(',');
    return this.http.get(`/api/book/multiple/${issnString}`)
      .pipe(
        catchError((error: any) => {
          console.error('Error al cargar los libros', error);
          const message = `Error al cargar los libros: ${error.error.detail}`;
          return throwError(() => new Error(message));
        })
      );
  }

  realizarReservas(ISSN: string[]): Observable<any> {
    const issnString = ISSN.join(',');
    return this.http.post(`/api/book/reservar/${issnString}`, null)
      .pipe(
        catchError((error: any) => {
          console.error('No se pudo realizar la reserva', error);
          const message = `No se pudo realizar la reserva: ${error.error.detail}`;
          return throwError(() => new Error(message));
        })
      );
  }

  getUserReservations(id: string): Observable<any> {
    return this.http.get(`/api/book/obtener-reservas/${id}`)
      .pipe(
        catchError((error: any) => {
          console.error('No se pudo obtener las reservas', error);
          const message = `No se pudo obtener las reservas: ${error.error.detail}`;
          return throwError(() => new Error(message));
        })
      );
  }

  cancelarReservas(userId: string, ISSN: string, fecha: string, tienda:string): Observable<any> {
    const body = userId+","+ISSN+","+fecha+","+tienda
    return this.http.post(`/api/book/cancelar-reserva/${body}`, null)
      .pipe(
        catchError((error: any) => {
          console.error('No se pudo cancelar la reserva', error);
          const message = `No se pudo cancelar la reserva: ${error.error.detail}`;
          return throwError(() => new Error(message));
        })
      );
  }

  obtenerTiendas(): Observable<any> {
    return this.http.get(`/api/shop/get/`)
      .pipe(
        catchError((error: any) => {
          console.error('No se pudo obtener las tiendas', error);
          const message = `No se pudo obtener las tiendas: ${error.error.detail}`;
          return throwError(() => new Error(message));
        })
      );
  }

  entregarTodos(): Observable<any> {
    return this.http.post(`/api/book/entregarTodos/`, null)
      .pipe(
        catchError((error: any) => {
          const message = `No se pudo cancelar la reserva: ${error.error.detail}`;
          return throwError(() => new Error(message));
        })
      );
  }
}
