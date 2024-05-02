import { Component, OnInit } from '@angular/core';
import { BooksComponent } from '../../books/books.component';
import { IconComponent } from '../../../shared/icon/icon.component';
import { AccordionComponent } from '../accordion/accordion.component';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-advanced-search',
  standalone: true,
  imports: [BooksComponent, IconComponent, AccordionComponent, NgClass, RouterLink],
  templateUrl: './advanced-search.component.html',
  styleUrl: './advanced-search.component.css'
})
export class AdvancedSearchComponent implements OnInit{
  accordionVisible = true;
  filters: any
  
  ngOnInit(): void {
    this.handleFiltersChanged({})
  }

  showAccordion() {
    this.accordionVisible = !this.accordionVisible;
  }

  handleFiltersChanged(filters: any) {
    this.filters = filters
    this.filters.size = 27
    console.log('datos busqueda avan', filters);
  }
}
