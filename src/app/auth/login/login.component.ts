import { CommonModule } from '@angular/common';
import {  Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent { 
  userLogin!: FormGroup;
  
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.userLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]]
    });
  }

  onSubmit() {
    console.log(this.userLogin.value);
  }

}