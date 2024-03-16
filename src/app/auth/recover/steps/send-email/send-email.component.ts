import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [InputTextModule, RouterOutlet, ButtonModule],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.css'
})
export class SendEmailComponent {

  constructor(private router: Router){}

  nextPage(){
    this.router.navigate(['recuperar-contraseña','verificar-codigo'])
  }
}
