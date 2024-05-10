import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardShared } from '../dashboard.shared';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { Subscription } from 'rxjs';
import { RootService } from '@services/root.service';
import { ToastService } from '@services/utils/toast.service';
import { EditAdminComponent } from './edit-admin/edit-admin.component';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [
    DashboardShared,
  ],
  templateUrl: './admins.component.html',
  styleUrl: './admins.component.css',
  providers: [DialogService]
})
export class AdminsComponent implements OnInit, OnDestroy{ 
  admins!: any;
  adminSuscription!: Subscription;
  selectedAdmins!: any;
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  ref: DynamicDialogRef | undefined;


  constructor(private confirmationService: ConfirmationService, public dialogService: DialogService, private rootService: RootService, private toastService: ToastService)  {}

  ngOnInit(): void {
    this.items = [{ label: 'Administradores' }];
    this.home = { icon: 'pi pi-home', routerLink: '/panel-admin' };

    this.fetchAdmins();
  }

  ngOnDestroy(): void {
      if(this.adminSuscription) this.adminSuscription.unsubscribe();
  }

  show() {
    this.ref = this.dialogService.open(CreateAdminComponent, { header: 'Crear un Administrador'});

    this.ref.onClose.subscribe(() => {
      this.fetchAdmins();
    })
  }

  fetchAdmins(){
    if(this.adminSuscription) this.adminSuscription.unsubscribe();

    this.adminSuscription = this.rootService.getAdmins().subscribe({
      next: admins => {
        this.admins = admins;
      },
      error: (e) => {
        this.admins = []
        this.selectedAdmins = []
        this.toastService.showErrorToast("Error", e)
      }
    })
  }

  editAdmin(DNI: string){
    this.ref = this.dialogService.open(EditAdminComponent, { 
      header: `Editando administrador con DNI: ${DNI}.`,
      data: {
        DNI: DNI
      }
    });

    this.ref.onClose.subscribe(() => {
      this.fetchAdmins();
    })
  }

  confirm_single_delete(event: Event, DNI: string) {
    this.confirmationService.confirm({
        target: (event.target ? event.target : undefined),
        message: 'Estás seguro de realizar esta acción?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: "Si",
        accept: () => {
          const deletedDNI = [DNI];

          this.rootService.deleteAdmins({ dnis: deletedDNI }).subscribe({
            next: (response) => {
              this.toastService.showInfoToast("Borrado de Admin", `Se ha eliminado el admin con DNI ${DNI}.`);
              this.fetchAdmins();
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
          const deletedDNIS = this.selectedAdmins.map((admin: any) => { return admin.DNI });

          this.rootService.deleteAdmins({ dnis: deletedDNIS } ).subscribe({
            next: (response) => {
              this.toastService.showInfoToast("Borrado de Admin", "Se han eliminado multiples administradores.");
              this.fetchAdmins();
            },
            error: (error) => {
              this.toastService.showErrorToast("Error", error)
            }
          })
        }
    });
  }
}
