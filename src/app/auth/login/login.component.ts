import { CommonModule } from '@angular/common';
import {  Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@services/auth/user.service';
import { CookieService } from '@services/cookie.service';
import { InputTextModule } from 'primeng/inputtext';
import { AuthShared } from '../auth.shared';
import { ToastService } from '@services/toast.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    InputTextModule, AuthShared
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent { 
  userLogin!: FormGroup;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private cookieService: CookieService, 
              private router: Router, private toastService: ToastService) {}

  ngOnInit() {
    this.userLogin = this.formBuilder.group({
      correo_electronico: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
      clave: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]]
    });
  }

  onSubmit() {
    if(this.userLogin.invalid){
      // Mark FormControls as Touched
      Object.keys(this.userLogin.controls).forEach(field => {
        const control = this.userLogin.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      
      return;
    }

    this.userService.login(this.userLogin.value).subscribe({
      next: (response) => {
        if (response.token) {
          this.cookieService.setCookie("Bearer", response.token, 1);
          this.router.navigate(['/inicio']);
        } else {
          console.error('No se encontro el token en la respuesta del servidor.');
        }
      },
      error: (error) => {
        this.toastService.showErrorToast("Error", error);
      }
    })
  }

}