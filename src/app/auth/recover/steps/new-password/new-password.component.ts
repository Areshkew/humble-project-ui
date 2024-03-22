import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '@services/auth/user.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthShared } from '../../../auth.shared';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    AuthShared,
    InputTextModule, RouterOutlet, ButtonModule
  ],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent {
  newPass!: FormGroup;
  data!: string;

  constructor(private router: Router, private formbuilder: FormBuilder, private userService: UserService, private toastService: ToastService){}

  ngOnInit(): void {

    this.userService.getData().subscribe({
      next: data =>{
        this.data = data;
        console.log(this.data);
           
      }
    })

    this.newPass = this.formbuilder.group({
      clave: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)]],
      claveRepetida: ['', [Validators.required]],
      correo_electronico: [this.data]
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

    if(this.newPass.get('clave')?.value === this.newPass.get('claveRepetida')?.value) {
      
        this.userService.resetPassword(this.newPass.value).subscribe({
          next: (response) => {
              this.router.navigate(['/ingreso']);            
          },
          error: (error) => {
            this.toastService.showErrorToast("Error", error)
          }
        })
      }
      
    }

}