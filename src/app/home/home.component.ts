import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<h1>Texto provisional pa que se vea</h1>`,
  styleUrl: './home.component.css',
})
export class HomeComponent { }
