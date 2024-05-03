import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IconComponent } from '../../../shared/icon/icon.component';
import { CarouselModule } from 'primeng/carousel';
import { GENRES } from '@models/genres';
import { BookService } from '@services/book.service';

@Component({
  selector: 'app-recommendation-board',
  standalone: true,
  imports: [IconComponent, CarouselModule],
  templateUrl: './recommendation-board.component.html',
  styleUrl: './recommendation-board.component.css'
})
export class RecommendationBoardComponent implements OnInit{
  imageUrl: string = environment.api_host;  
  booksGenres = GENRES
  booksNumber = 3
  books: any[] = []


  constructor(private bookService: BookService){}

  ngOnInit(): void {
    let randomKeys = this.getRandomKeys();
    randomKeys.forEach((element: { key: any; }) => {
        this.loadBook(element.key)     
      }); 
    
      
  }

  loadBook(categoryKey: string): void {
    const filters = {
      category: categoryKey,
      page: 1,
      size: 1,
    };
    
    this.bookService.getBooks(filters).subscribe({
      next: (response) => {       
        if (response.books.length > 0) {
          this.books = [...this.books, response.books[0]];
        }
      },
      error: (error) => {
        console.error('Error al cargar los libros:', error);
      }
    });
  }

  getRandomKeys(): any {
    const copy = [...this.booksGenres];
    copy.sort(() => Math.random() - 0.5);
    return copy.slice(0,this.booksNumber)
  }

  getLanguageEmoji(languageCode: string): string {
    const languageMap: any = {
      "inglés": 'language_us',
      "español": 'language_spanish'
    };

    return languageMap[languageCode.toLowerCase()] || 'question_mark'; // Default to question mark emoji if unknown
  }

  getState(state: boolean): string {
    return state ? 'Nuevo' : 'Usado';
  }

  getStateEmoji(state: boolean): string {
    const stateMap: any = {
      true: "bookmark_added",
      false: "bookmark_remove"
    }

    return stateMap[state.toString()] 
    
  }
}
