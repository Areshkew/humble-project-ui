import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RootService } from '@services/root.service';
import { ToastService } from '@services/utils/toast.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'contrasena-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contrasena-root.component.html',
  styleUrls: ['./contrasena-root.component.css']
})
export class ContrasenaRootComponent implements OnInit {
  editPassword!: FormGroup;

  constructor(private formBuilder: FormBuilder, private rootService: RootService, private toastService: ToastService) { }

  ngOnInit() {
    this.editPassword = this.formBuilder.group({
      'clave_actual': ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]],
      'clave': ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]],
      'confirmar_clave': ['', [Validators.required]]
    })
  }

  onSubmitPass() {
    if (this.editPassword.invalid) {
      Object.keys(this.editPassword.controls).forEach(field => {
        const control = this.editPassword.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    if (this.editPassword.get('clave')?.value === this.editPassword.get('confirmar_clave')?.value) {

      this.rootService.editPassword(this.editPassword.value).subscribe({
        next: (r) => {
          this.editPassword.get("clave")?.setValue("");
          this.editPassword.get("confirmar_clave")?.setValue("");
          this.editPassword.get("clave_actual")?.setValue("");
          if (r.success) this.toastService.showSuccessToast("Exito", "Se actualizaron los detalles de tu cuenta.")
        },
        error: (error) => {
          this.toastService.showErrorToast("Error", error);
        }
      });
    }
  }
}