import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { CookieService } from '@services/cookie.service';
import { UserService } from '@services/auth/user.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [InputTextModule, RouterOutlet, ButtonModule, CommonModule, ReactiveFormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.css'
})
export class SendEmailComponent {
  sendEmail!: FormGroup;

  constructor(private router: Router, private formbuilder: FormBuilder, private userService: UserService,
              private cookieService: CookieService, private messageService: MessageService){}

  ngOnInit(): void {
    this.sendEmail = this.formbuilder.group({
      correo_electronico: ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(32)]],
    })
    
  }

  onSubmit(){
    if(this.sendEmail.invalid){
      // Mark FormControls as Touched
      Object.keys(this.sendEmail.controls).forEach(field => {
        const control = this.sendEmail.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      
      return;
    }

    this.userService.recover(this.sendEmail.value).subscribe({
      next: (response) => {
        if (response.token) {
          this.cookieService.setCookie("Bearer", response.token, 1);
          this.router.navigate(['recuperar-contraseña','verificar-codigo']);
        } else {
          console.error('No se encontro el token en la respuesta del servidor.');
        }
      },
      error: (error) => {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: error });
      }
    })
  }


}
