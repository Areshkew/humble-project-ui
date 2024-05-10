import { Component, OnInit } from '@angular/core';
import { BooksComponent } from '../../books/books.component';
import { IconComponent } from '../../../shared/icon/icon.component';
import { AccordionComponent } from '../accordion/accordion.component';
import { NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';


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
  
  constructor(private route: ActivatedRoute) { 
    
  }
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const filters = {
        category: params['categoria'] || null,
        min_price: params['precioMin'] || null,
        max_price: params['precioMax'] || null,
        price_order: params['orden'] || null,
        state: params['estado'] || null,
        language: params['idioma'] || null,
        start_date: params['fechaInicio'] || null,
        end_date: params['fechaFinal'] || null,
        min_page: params['paginaMin'] || null,
        max_page: params['paginaMax'] || null,
        
      };

      this.handleFiltersChanged(filters);
    });
  }

  showAccordion() {
    this.accordionVisible = !this.accordionVisible;
  }

  handleFiltersChanged(filters: any) {
    this.filters = {...this.filters, ...filters};
    this.filters.size = 30
  }
}
