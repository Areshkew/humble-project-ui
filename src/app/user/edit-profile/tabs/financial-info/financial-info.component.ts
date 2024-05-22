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
import { PaymentService } from '@services/payment.service';

@Component({
  selector: 'app-financial-info',
  standalone: true,
  imports: [IconComponent, InputTextModule, ButtonModule, ConfirmPopupModule, CalendarModule,
    CommonModule, ReactiveFormsModule, DropdownModule
  ],
  templateUrl: './financial-info.component.html',
  styleUrls: ['./financial-info.component.css']
})
export class FinancialInfoComponent implements OnInit{

  balance: string[] = [
    "saldo"
  ]

  type = [
    { label: "Debito", value: 0 },
    { label: "Credito", value: 1 }
  ];
  cards: any[] = []
  minDate!: Date;

  tarjetaForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private confirmationService: ConfirmationService, 
    private toastService: ToastService, private userService: UserService, private paymentService: PaymentService){}

  ngOnInit() {
    this.tarjetaForm = this.formBuilder.group({
      'num_tarjeta': ['', [Validators.required,Validators.pattern(/^\d{16}$/)]],
      'fec_vencimiento': ['', [Validators.required]],
      'cvv': ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      'tipo': ['',[Validators.required]]
    })

    const today = new Date();
    let nextMonth = today.getMonth() + 1; 
    let year = today.getFullYear();

    if (nextMonth > 11) {
      nextMonth = 0;
      year += 1;
    }

    this.minDate = new Date(year, nextMonth, 1); 

    
    this.userService.getCurrentUser(this.balance).subscribe(
      balance => {
        this.balance = balance.saldo
      }
    )

    this.getUserCards()
  }

  onSubmit(){
    const formData = Object.assign({}, this.tarjetaForm.value)

    formData.num_tarjeta = formData.num_tarjeta.toString();
    formData.cvv = formData.cvv.toString();

    this.paymentService.addCard(formData).subscribe({
      next: (r) => {
        this.tarjetaForm.reset();
        if(r.Success){
          this.toastService.showSuccessToast("Exito", "Se añadio la tarjeta a su cuenta.")
          this.getUserCards()
        } 
      },
      error: (error) => {
        this.toastService.showErrorToast("Error", error);
      }
    })
  }

  private getUserCards(){
    this.paymentService.getCards().subscribe({
      next: (cards) => {
        this.cards = cards;
      },
      error: (error) => {
        this.toastService.showErrorToast("Error", error);
      }
    });
  }

  deleteCard(event: Event, card_num: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "Sí",
      accept: () => {
        this.paymentService.deleteCard(card_num).subscribe({
          next: () => {
            this.toastService.showSuccessToast("Tarjeta Eliminada", "La tarjeta ha sido eliminada con éxito.");
            this.removeCardFromList(card_num);
          },
          error: (error) => {
            this.toastService.showErrorToast("Error", error);
          }
        });
      },
    });
  }

  private removeCardFromList(card_num: string) {
    this.cards = this.cards.filter(card => card.num_tarjeta !== card_num);
  }
}
