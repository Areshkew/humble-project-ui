import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new Subject<boolean>();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationStart)
        this.startLoading();
      else if(event instanceof NavigationEnd)
        this.stopLoading();
    })
  }

  public startLoading(){
    this.loadingSubject.next(true);
  }

  public stopLoading(){
    this.loadingSubject.next(false);
  }
}