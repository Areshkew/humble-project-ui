import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NormalizeSpacesDirective } from '../../../shared/directives/normalizeSpace.directive';
import { DashboardShared } from '../../dashboard.shared';
import { ShopsService } from '@services/shops.service';
import { User } from '@models/user.model';
import { ToastService } from '@services/utils/toast.service';
import { InputTextModule } from 'primeng/inputtext';
import { Shop } from '@models/shop.model';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-create-shop',
  standalone: true,
  imports: [DashboardShared, NormalizeSpacesDirective, InputTextModule],
  templateUrl: './create-shop.component.html',
  styleUrl: './create-shop.component.css'
})
export class CreateShopComponent implements OnInit{

  createShopForm!: FormGroup

  constructor(private formBuilder: FormBuilder, private shopService: ShopsService,
    private toastService: ToastService, private ref: DynamicDialogRef
  ){}

  ngOnInit(): void {
    this.createShopForm = this.formBuilder.group({
      'ubicacion': ['', [Validators.required, Validators.maxLength(32)]],
      'nombre': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
      'num_contacto': ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10),Validators.pattern(/^\d+$/)]],
      'correo': ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(32), Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) ]],
      'hora_apertura': ['', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/)]],
      'hora_cierre': ['', [Validators.required,Validators.pattern(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/) ]]
    })
  }

  onSubmit(){
    if(this.createShopForm.invalid){
      Object.keys(this.createShopForm.controls).forEach(field => {
        const control = this.createShopForm.get(field);
        control?.markAsTouched({ onlySelf: true})
      })

      return;
    }
    const formData: Shop = Object.assign({}, this.createShopForm.value);
    
    
  
    this.shopService.createShop(formData).subscribe({
      next: (response) => {
        this.toastService.showSuccessToast("Tienda agregada", "Se ha agregado una nueva tienda.")
        this.ref.close()
      },
      error: (error) => {
        this.toastService.showErrorToast("Error", error)
      }
    })
  }

}
