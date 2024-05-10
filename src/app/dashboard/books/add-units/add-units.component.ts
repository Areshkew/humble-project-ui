import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardShared } from '../../dashboard.shared';
import { ShopsService } from '@services/shops.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-units',
  standalone: true,
  imports: [
    DashboardShared,
  ],
  templateUrl: './add-units.component.html',
  styleUrl: './add-units.component.css',
})
export class AddUnitsComponent implements OnInit, OnDestroy{
  shops!: any;
  shopsSubscription!: Subscription;

  constructor(private shopsService: ShopsService){}

  ngOnInit(): void {
    this.shopsSubscription = this.shopsService.getShops().subscribe((shops) => {
      this.shops = shops;
      console.log(shops)
    })
  }

  ngOnDestroy(): void {
    if(this.shopsSubscription) this.shopsSubscription.unsubscribe();
  }
}
