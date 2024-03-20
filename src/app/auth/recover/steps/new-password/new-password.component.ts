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
  selector: 'app-new-password',
  standalone: true,
  imports: [InputTextModule, RouterOutlet, ButtonModule, CommonModule, ReactiveFormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent {
  newPass!: FormGroup;

  constructor(private router: Router, private formbuilder: FormBuilder, private userService: UserService,
              private cookieService: CookieService, private messageService: MessageService){}

  ngOnInit(): void {
    this.newPass = this.formbuilder.group({
      contraseña: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)]],
      'confirmar-contraseña': ['', [Validators.required]]
    })
  }

  onSubmit(){
    if(this.newPass.invalid){
      // Mark FormControls as Touched
      Object.keys(this.newPass.controls).forEach(field => {
        const control = this.newPass.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      
      return;
    }

    if(this.newPass.get('contraseña')?.value === this.newPass.get('confirmar-contraseña')?.value) {
      
        this.userService.resetPassword(this.newPass.value).subscribe({
          next: (response) => {
              this.router.navigate(['/ingreso']);            
          },
          error: (error) => {
            this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: error });
          }
        })
      }
      
    }

}