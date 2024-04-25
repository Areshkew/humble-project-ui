import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import {  Router } from '@angular/router';
import { AuthShared } from '../auth.shared';

@Component({
  selector: 'app-recover',
  standalone: true,
  imports: [InputTextModule, ToastModule, StepsModule, AuthShared],
  templateUrl: './recover.component.html',
  styleUrl: './recover.component.css',

})
export class RecoverComponent implements OnInit {
  items!: MenuItem[];

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
