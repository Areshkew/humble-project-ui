import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';

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

}