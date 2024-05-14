import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NormalizeSpacesDirective } from '../../../shared/directives/normalizeSpace.directive';
import { DashboardShared } from '../../dashboard.shared';
import { ShopsService } from '@services/shops.service';
import { User } from '@models/user.model';
import { ToastService } from '@services/utils/toast.service';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-edit-shop',
  standalone: true,
  imports: [DashboardShared, InputTextModule, ReactiveFormsModule],
  templateUrl: './edit-shop.component.html',
  styleUrl: './edit-shop.component.css'
})
export class EditShopComponent implements OnInit{

  editShopForm!: FormGroup
  ID!: number
  shop: string[] = [
    "id",
    "ubicacion",
    "nombre",
    "num_contacto",
    "correo",
    "hora_apertura",
    "hora_cierre"
  ]
  initialShopData: any = {}

  constructor(private formBuilder: FormBuilder, private shopService: ShopsService,
    private toastService: ToastService, private config: DynamicDialogConfig, private ref: DynamicDialogRef
  ){}

  ngOnInit(): void {

    this.ID = this.config.data.ID
    console.log(this.ID);
    
    this.editShopForm = this.formBuilder.group({
      'ubicacion': ['', [Validators.required, Validators.maxLength(32)]],
      'nombre': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
      'num_contacto': ['', [Validators.required, Validators.minLength(10),Validators.maxLength(10), Validators.pattern(/^\d+$/)]],
      'correo': ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(32), Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) ]],
      'hora_apertura': ['', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/)]],
      'hora_cierre': ['', [Validators.required,Validators.pattern(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/) ]]
    })

    this.shopService.getShop(this.ID, this.shop).subscribe(
      shop => {
        this.shop = shop
        console.log(shop);
        

        this.editShopForm.patchValue({
          id: shop.id,
          ubicacion: shop.ubicacion,
          nombre: shop.nombre,
          num_contacto: shop.num_contacto,
          correo: shop.correo,
          hora_apertura: shop.hora_apertura,
          hora_cierre: shop.hora_cierre
        })
      }
    )
  }

  onSubmit(){
    if(this.editShopForm.invalid){
      Object.keys(this.editShopForm.controls).forEach(field => {
        const control = this.editShopForm.get(field);
        control?.markAsTouched({ onlySelf: true})
      })

      return;
    }
    const formData: User = Object.assign({}, this.editShopForm.value);
  
    const changeData = this.getChangedData(formData) ;
    
    this.shopService.editShop(this.ID, changeData).subscribe({
      next: (response) => {
        if(response.success) this.toastService.showSuccessToast("Tienda actualizada", "Se actualizaron los datos de la tienda.")
          this.ref.close()
      },
      error: (error) => {
        this.toastService.showErrorToast("Error", error)
      }
    })
  }

  private getChangedData(formData: any) {
    const changedData: any = {};

    Object.keys(formData).forEach(key => {
      if (formData[key] !== this.initialShopData[key]) {
          changedData[key] = formData[key];      
      }
    });
    return changedData;
  }
}
