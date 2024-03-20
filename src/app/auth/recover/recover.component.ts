import { Component, OnInit } from '@angular/core';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { StepsModule } from 'primeng/steps';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { RouterOutlet, Route, Router } from '@angular/router';
import { SendEmailComponent } from './steps/send-email/send-email.component';

@Component({
  selector: 'app-recover',
  standalone: true,
  imports: [InputTextModule, ToastModule, StepsModule, RouterOutlet],
  templateUrl: './recover.component.html',
  styleUrl: './recover.component.css',

})
export class RecoverComponent implements OnInit {
  items!: MenuItem[];
  subscription!: Subscription;

  constructor(private router: Router) {
    
  }
  
  ngOnInit() {
    this.items = [
      {
        label: '‎ ', //Caracter vacio  uwu
        routerLink: 'enviar-correo'
      },
      {
        routerLink: 'verificar-codigo'
      },
      {
        routerLink: 'ingresar-contraseña'
      }
    ];

    
    
  }
}
