import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [InputTextModule],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent {

  constructor(private router: Router) {}
  
  nextPage(){
    this.router.navigate(['inicio'])
  }

}
