import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonService {
    private jsonPath = '../../assets/json/';

    constructor(private http: HttpClient){}

    fetchJson(name: string): Observable<any>{
        return this.http.get(`${this.jsonPath}${name}.json`);
    }
}