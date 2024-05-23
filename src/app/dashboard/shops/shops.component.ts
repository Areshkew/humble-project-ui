import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardShared } from '../dashboard.shared';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { Subscription } from 'rxjs';
import { ShopsService } from '@services/shops.service';
import { ToastService } from '@services/utils/toast.service';


import { CreateShopComponent } from './create-shop/create-shop.component';
import { EditShopComponent } from './edit-shop/edit-shop.component';


@Component({
  selector: 'app-shops',
  standalone: true,
  imports: [
    DashboardShared,
  ],
  templateUrl: './shops.component.html',
  styleUrl: './shops.component.css',
  providers: [DialogService]
})
export class ShopsComponent implements OnInit, OnDestroy { 
  shops!: any;
  shopSuscription!: Subscription;
  selectedShops!: any;
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  ref: DynamicDialogRef | undefined;

  constructor(private confirmationService: ConfirmationService, public dialogService: DialogService, private shopService: ShopsService, private toastService: ToastService)  {}

  ngOnInit(): void {
    this.items = [{ label: 'Tiendas' }];
    this.home = { icon: 'pi pi-home', routerLink: '/panel-admin' };

    this.fetchShops();
  }

  ngOnDestroy(): void {
    if(this.shopSuscription) this.shopSuscription.unsubscribe()
  }

  show(){
    this.ref = this.dialogService.open(CreateShopComponent ,{header: 'Añadir nueva tienda'})
    this.ref.onClose.subscribe(() => {
      this.fetchShops();
    })
  }

  fetchShops(){
    if(this.shopSuscription) this.shopSuscription.unsubscribe();

    this.shopSuscription = this.shopService.getShops().subscribe({
      next: shops => {
        this.shops = shops;
      },
      error: (e) => {
        this.shops = []
        this.selectedShops = []
        this.toastService.showErrorToast("Error", e)
      }
    })
  }

  editShop(ID: string){
    this.ref = this.dialogService.open(EditShopComponent, { 
      header: `Editando tienda con ID: ${ID}.`,
      data: {
        ID: ID
      }
    });

    this.ref.onClose.subscribe(() => {
      this.fetchShops();
    })
  }

  confirm_single_delete(event: Event, ID: any) {
  
    
    this.confirmationService.confirm({
        target: (event.target ? event.target : undefined),
        message: 'Estás seguro de realizar esta acción?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: "Si",
        accept: () => {
          const deletedIDS = [ID];

          this.shopService.deleteShops({ ids: deletedIDS }).subscribe({
            next: (response) => {
              this.toastService.showInfoToast("Tienda eliminada", `Se ha eliminado la tienda con ID: ${ID}.`);
              this.fetchShops();
            },
            error: (error) => {
              this.toastService.showErrorToast("Error", error);
              
            }
          })
        }
    });
  }

  confirm_multiple_delete(event: Event) {
    this.confirmationService.confirm({
        target: (event.target ? event.target : undefined),
        message: 'Estás seguro de realizar esta acción?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: "Si",
        accept: () => {
          const deletedIDS = this.selectedShops.map((shop: any) => { return shop.id });

          this.shopService.deleteShops({ ids: deletedIDS } ).subscribe({
            next: (response) => {
              this.toastService.showInfoToast("Tienda eliminada", "Se han eliminado multiples tiendas.");
              this.fetchShops();
            },
            error: (error) => {
              this.toastService.showErrorToast("Error", error)
            }
          })
        }
    });
  }
}
