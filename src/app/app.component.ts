import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MenuComponent } from './shared/menu/menu.component';
import { IconComponent } from './shared/icon/icon.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InactivityService } from '@services/utils/inactivity.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenuComponent, IconComponent, ToastModule, ConfirmDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy{
  hiddenURLS = ["/panel-admin"];
  inactivitySubscription!: Subscription;

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:keypress', ['$event'])
  @HostListener('document:mousedown', ['$event'])
  @HostListener('document:scroll', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  recordActivity(event: Event) {
    this.inactivityService.recordActivity();
  }
  
  constructor(private router: Router, private inactivityService: InactivityService){}

  hideURL(): boolean {
    return !this.hiddenURLS.some(hiddenPath => this.router.url.startsWith(hiddenPath));
  }

  ngOnInit(): void {
    this.inactivitySubscription = this.inactivityService.inactiveOrExpire$.subscribe(sessionStatus => {
      if(sessionStatus == "inactive") this.inactivityService.showInactivityDialog()
      else if(sessionStatus == "expired") this.inactivityService.showTokenExpirationDialog()
    })
  }

  ngOnDestroy(): void {
      if(this.inactivitySubscription) this.inactivitySubscription.unsubscribe()
  }

}
