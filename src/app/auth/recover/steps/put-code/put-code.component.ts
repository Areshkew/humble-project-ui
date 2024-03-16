import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-put-code',
  standalone: true,
  imports: [InputTextModule],
  templateUrl: './put-code.component.html',
  styleUrl: './put-code.component.css'
})
export class PutCodeComponent {

  constructor(private router: Router){}

  nextPage(){
    this.router.navigate(['recuperar-contraseña','ingresar-contraseña'])
  }
}
  