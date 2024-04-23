import { NgClass } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { GENRES } from '@models/genres';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  booksGenres = GENRES
  selectedGenre!: any


  onCategorySelected(genero: string) {
    this.selectedGenre = genero;
    console.log(this.selectedGenre);
    
  }

  clearSelection() {
    this.selectedGenre = null;
  }
}
