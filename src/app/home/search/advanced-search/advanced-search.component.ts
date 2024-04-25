import { Component } from '@angular/core';
import { BooksComponent } from '../../books/books.component';
import { IconComponent } from '../../../shared/icon/icon.component';
import { AccordionComponent } from '../accordion/accordion.component';
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-advanced-search',
  standalone: true,
  imports: [BooksComponent, IconComponent, AccordionComponent, NgClass],
  templateUrl: './advanced-search.component.html',
  styleUrl: './advanced-search.component.css'
})
export class AdvancedSearchComponent {
  accordionVisible = true;
  booksNumber = 27;
  selectedCategory: string | null = null;
  

  showAccordion() {
    this.accordionVisible = !this.accordionVisible;
  }
}
