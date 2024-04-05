import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/auth/user.service';

interface User {
  dni: string;
  password: string;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  rootUser: User | null = null;
  errorMessage: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(){
    this.loadRootInformation()
  }

  onSave(currentPassword: string, newPassword: string, confirmPassword: string){
    if (!currentPassword || !newPassword || !confirmPassword) {
      this.errorMessage = 'Por favor, complete todos los campos.';
      return;
    }

    if (newPassword !== confirmPassword) {
      this.errorMessage = 'La contraseña nueva no coinciden.';
      return;
    }

    const regexNumber = /\d/; // Expresión regular para verificar si hay al menos un número
    const regexSpecialChar = /[!@#$%^&*(),.?":{}|<>]/; // Expresión regular para verificar si hay al menos un carácter especial
    if (newPassword.length < 8 || !regexNumber.test(newPassword) || !regexSpecialChar.test(newPassword)) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres, un número y un carácter especial.';
      return;
    }

    //Verificación y envío 
    if (this.errorMessage == ''){
      if (this.rootUser?.password == currentPassword){
        this.userService.editPassword(newPassword).subscribe({
          error: () => {
            this.errorMessage = 'Error en la actualización!';
          }
        });        
      }
      else{
        this.errorMessage = 'Contraseña incorrecta';
      }
      
    }
    else{
      this.errorMessage = '';
    }    
  }
  loadRootInformation(){
    this.userService.getRootInformation().subscribe(
      (user: User) => {
        this.rootUser = user;
      },
      (error) => {
        console.error('Error fetching root users:', error);
        // Manejo de errores
      }
    );
  }
}
