import { Injectable } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationStart)
        this.startLoading();
      else if(event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError)
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