import { Component, OnInit } from '@angular/core';
import { IconComponent } from '../../../../shared/icon/icon.component';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@services/utils/toast.service';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { PaymentService } from '@services/payment.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-financial-info',
  standalone: true,
  imports: [IconComponent, InputTextModule, ButtonModule, ConfirmPopupModule, CalendarModule,
    CommonModule, ReactiveFormsModule,DropdownModule,DialogModule
  ],
  templateUrl: './financial-info.component.html',
  styleUrls: ['./financial-info.component.css'],
})
export class FinancialInfoComponent implements OnInit {
  balance!: number;

  type = [
    { label: 'Debito', value: 0 },
    { label: 'Credito', value: 1 },
  ];
  cards: any[] = [];
  minDate!: Date;

  tarjetaForm!: FormGroup;

  addBalanceDialogVisible: boolean = false;
  addBalanceForm!: FormGroup;
  installments: { label: string; value: number }[] = [];
  transformedCards: any[] = []

  constructor(
    private formBuilder: FormBuilder, private confirmationService: ConfirmationService, private toastService: ToastService, private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.tarjetaForm = this.formBuilder.group({
      num_tarjeta: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      fec_vencimiento: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      tipo: ['', [Validators.required]],
    });

    this.addBalanceForm = this.formBuilder.group({
      saldo: ['', [Validators.required, Validators.min(1)]],
      card: ['', [Validators.required]],
      installments: [null],
    });

    const today = new Date();
    let nextMonth = today.getMonth() + 1;
    let year = today.getFullYear();

    if (nextMonth > 11) {
      nextMonth = 0;
      year += 1;
    }

    this.minDate = new Date(year, nextMonth, 1);
    this.getUserCards();
    this.getWallet();

    this.installments = Array.from({ length: 36 }, (_, i) => ({
      label: `${i + 1}`,
      value: i + 1,
    }));
  }

  showAddBalanceDialog() {
    this.addBalanceDialogVisible = true;
  }

  onAddBalanceSubmit() {
    if (this.addBalanceForm.invalid) {
      return;
    }
    const formData = {
      saldo: this.addBalanceForm.get('saldo')?.value,
    };

    
    this.paymentService.addBalance(formData).subscribe({
      next: (r) => {
        if(r.Success){
          this.toastService.showSuccessToast("Exito", "Se añadio el saldo a su cuenta.")
          this.addBalanceDialogVisible = false;
          this.addBalanceForm.reset()
          this.getWallet()
        }
      },
      error: (error) => {
        this.toastService.showErrorToast("Error", error);
      }
     })

  }

  isCreditCardSelected(): boolean {
    const selectedCard = this.addBalanceForm.get('card')?.value;
    return selectedCard && selectedCard.tipo == true; 
  }

  onCardSelect() {
    const selectedCard = this.addBalanceForm.get('card')?.value;
    
    if (selectedCard && selectedCard.tipo !== true) {
      this.addBalanceForm.get('installments')?.reset();
    }
  }

  onSubmit() {
    const formData = Object.assign({}, this.tarjetaForm.value);

    formData.num_tarjeta = formData.num_tarjeta.toString();
    formData.cvv = formData.cvv.toString();

    if (!this.isLuhnValid(formData.num_tarjeta)) {
      this.toastService.showErrorToast('Error', 'Ingrese una tarjeta válida');
      return;
    }

    this.paymentService.addCard(formData).subscribe({
      next: (r) => {
        this.tarjetaForm.reset();
        if (r.Success) {
          this.toastService.showSuccessToast(
            'Exito',
            'Se añadio la tarjeta a su cuenta.'
          );
          this.getUserCards();
        }
      },
      error: (error) => {
        this.toastService.showErrorToast('Error', error);
      },
    });
  }

  isLuhnValid(cardNumber: string): boolean {   
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return (sum % 10 === 0);
  }

  deleteCard(event: Event, card_num: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      accept: () => {
        this.paymentService.deleteCard(card_num).subscribe({
          next: () => {
            this.toastService.showSuccessToast(
              'Tarjeta Eliminada',
              'La tarjeta ha sido eliminada con éxito.'
            );
            this.removeCardFromList(card_num);
            this.transformCards()
          },
          error: (error) => {
            this.toastService.showErrorToast('Error', error);
          },
        });
      },
    });
  }

  private getUserCards() {
    this.paymentService.getCards().subscribe({
      next: (cards) => {
        this.cards = cards;
        this.transformCards();
      },
      error: (error) => {
        this.toastService.showErrorToast('Error', error);
      },
    });
  }

  private transformCards() {
    this.transformedCards = this.cards.map(card => {
      return {
        ...card,
        num_tarjeta: 'XXXX . ' + this.getLastFourDigits(card.num_tarjeta)
      };
    });

    console.log(this.transformedCards);
    
  }

  private getLastFourDigits(cardNumber: string): string {
    return cardNumber.slice(-4);
  }

  private removeCardFromList(card_num: string) {
    this.cards = this.cards.filter((card) => card.num_tarjeta !== card_num);
  }

  private getWallet() {
    this.paymentService.getWallet().subscribe({
      next: (balance) => {
        this.balance = balance;
      },
      error: (error) => {
        this.toastService.showErrorToast('Error', error);
      },
    });
  }
}
