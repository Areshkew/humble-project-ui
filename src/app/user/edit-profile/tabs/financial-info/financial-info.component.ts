import { Component, OnInit } from '@angular/core';
import { IconComponent } from '../../../../shared/icon/icon.component';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@services/utils/toast.service';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { UserService } from '@services/user.service';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-financial-info',
  standalone: true,
  imports: [IconComponent, InputTextModule, ButtonModule, ConfirmPopupModule, CalendarModule,
    CommonModule, ReactiveFormsModule, DropdownModule
  ],
  templateUrl: './financial-info.component.html',
  styleUrl: './financial-info.component.css'
})
export class FinancialInfoComponent implements OnInit{

  balance: string[] = [
    "saldo"
  ]

  type = [
    "Debito",
    "Credito"
  ]
  cards = [
    { num_tarjeta: '1234 5678 9101 1121', fec_vencimiento: '12/23', cvv: '123', tipo: 'credito' },
    { num_tarjeta: '1234 5678 9101 1122', fec_vencimiento: '12/23', cvv: '123', tipo: 'credito' }
  ];
  minDate!: Date;

  tarjetaForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private confirmationService: ConfirmationService, 
    private toastService: ToastService, private userService: UserService){}

  ngOnInit() {
    this.tarjetaForm = this.formBuilder.group({
      'num_tarjeta': ['', [Validators.required,Validators.pattern(/^\d{12}$/)]],
      'fec_vencimiento': ['', [Validators.required]],
      'cvv': ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      'tipo': ['',[Validators.required]]
    })
    const today = new Date();
    this.minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.userService.getCurrentUser(this.balance).subscribe(
      balance => {
        this.balance = balance.saldo
        
        
      }
    )

    this.userService.getCardsUser().subscribe({
      next: (r) => {
        this.cards = r
        
      },
      error: (error) => {
        console.error('No hay tarjetas', error);
        this.toastService.showErrorToast("No se encontraron tarjetas", error.message);
      }
    }
    )
  }

  onSubmit(){

    


    const formData = Object.assign({}, this.tarjetaForm.value)

    formData.num_tarjeta = formData.num_tarjeta.toString();

    
    console.log(formData);
    console.log(typeof(formData.num_tarjeta));
    
    

    this.cards.push(formData)

    console.log(this.cards);
    
    this.userService.addCardUser(formData).subscribe({
      next: (response) => {
        this.toastService.showSuccessToast("Tarjeta Añadida", "Se ha añadido una nueva tarjeta.");
      },
      error: (error) => {
        this.toastService.showErrorToast("Error", error);
      }
    })
    
  }

  eliminarTarjeta(event: Event, id: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Estas seguro?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "Si",
      accept: () => {
        this.cards = this.cards.filter(tarjeta => tarjeta.num_tarjeta !== id);
        this.toastService.showInfoToast("Tarjeta Eliminada", '')
      },
      
    })
    
  }
}
