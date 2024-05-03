import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BookService } from '@services/book.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { environment } from '../../../environments/environment';
import { IconComponent } from '../icon/icon.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    CommonModule, ProgressSpinnerModule, IconComponent, RouterLink
  ],
  templateUrl: "./search-results.component.html",
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent implements OnChanges { 
  oldValue!: string;
  loading: boolean = true;
  books!: string | any[];
  imageUrl: string = environment.api_host;

  @Input() absolute: boolean = true; 
  @Input() receivedValue!: string;

  constructor(private bookService: BookService){}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["receivedValue"] && (changes["receivedValue"].currentValue != this.oldValue) ) {

      this.loading = true;
      this.bookService.searchBooks(this.receivedValue).subscribe({
        next: (response) => {
          if(response.success) this.books = response.results;
          
        },
        error: (response) => {
          this.books = response.error.detail;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      })

      this.oldValue = this.receivedValue;
    }
  }

  isBookError(): boolean { return (typeof this.books === 'string'); }

  getLanguageEmoji(languageCode: string): string {
    const languageMap: any = {
      "inglés": 'language_us',
      "español": 'language_spanish'
    };

    return languageMap[languageCode.toLowerCase()] || 'question_mark'; // Default to question mark emoji if unknown
  }

}
