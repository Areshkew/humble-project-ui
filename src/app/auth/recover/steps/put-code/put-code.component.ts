import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '@services/auth/user.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthShared } from '../../../auth.shared';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-put-code',
  standalone: true,
  imports: [InputTextModule, RouterOutlet, ButtonModule, AuthShared],
  templateUrl: './put-code.component.html',
  styleUrl: './put-code.component.css'
})
export class PutCodeComponent {
  putCode!: FormGroup;

  constructor(private router: Router, private formbuilder: FormBuilder, private userService: UserService, private toastService: ToastService){}

  ngOnInit(): void {
    this.putCode = this.formbuilder.group({
      codigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
    })
    
  }

  onSubmit(){
    if(this.putCode.invalid){
      // Mark FormControls as Touched
      Object.keys(this.putCode.controls).forEach(field => {
        const control = this.putCode.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      
      return;
    }

    this.userService.verifyRecoveryCode(this.putCode.value).subscribe({
      next: (response) => {
          this.router.navigate(['recuperar-contraseña','ingresar-contraseña']);
      },
      error: (error) => {
        this.toastService.showErrorToast("Error", error);
      }
    })
  }

  
}
  