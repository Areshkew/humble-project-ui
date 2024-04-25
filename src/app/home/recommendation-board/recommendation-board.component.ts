import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IconComponent } from '../../shared/icon/icon.component';
import { CarouselModule } from 'primeng/carousel';
import { GENRES } from '@models/genres';
import { BookService } from '@services/book/book.service';

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
  
  carouselBooks = [
    {
      ISSN: '9789588263816',
      autor: 'Adolf Hitler',
      descuento: 20000,
      editorial: 1032,
      estado: false,
      fecha_publicacion: '1932-04-28',
      idioma: 'Español',
      num_paginas: 271,
      portada:
        'images/historia-arqueologia/2bd2e26e4fd06d9bff4e46f35c89aa3b.jpg',
      precio: 14000,
      resenia:
        'Mi Lucha es el libro que escribe Adolfo Hitler en el primer ciclo antes del ascenso al poder. Al finalizar la Primera Guerra Mundial, Alemania y sus aliados fueron los grandes derrotados, no solamente en lo militar sino también en lo económico y político. La debacle militar de la nación alemana permitió el ingreso masivo de capitales de orígenes judíos, que en pocos años se apoderaron de la debilitada economía germana.',
      titulo: 'Mi Lucha',
    },
    {
      ISSN: '9788418774447',
      autor: 'Mojang Ab',
      descuento: 89900,
      editorial: 177,
      estado: true,
      fecha_publicacion: '2022-03-20',
      idioma: 'Español',
      num_paginas: 96,
      portada: 'images/arte/2ff3b91f05e5c5977e92cbf90c9621d4.jpg',
      precio: 71920,
      resenia:
        'Hay muchas formas de jugar a Minecraft, y una de las más populares es el Modo Supervivencia, en el que tendrás que forjar tu propio camino en el juego, solo con los bloques que encuentres para fabricar cosas, y te enfrentarás a muchos peligros con la certeza de que, con un solo movimiento en falso, podrías perderlo todo. Es muy emocionante,  ¡y muy difícil!\n\n \nAsí que llena el inventario, construye una base y prepárate para sobrevivir a la noche con el Manual de Supervivencia de Minecraft, el único libro que necesitas para mejorar tus habilidades.\n\n \nAprenderás a conseguir recursos, fabricar herramientas, protegerte de criaturas hostiles y muchas otras cosas. Tambien incluye consejos avanzados sobre cómo sobrevivir en el Inframundo y el End y convertirte en el heroe que estás destinado a ser.',
      titulo: 'Manual de Supervivencia de Minecraft',
    },
    {
      ISSN: '9788491647539',
      autor: 'Meseguer Laura',
      descuento: 165708,
      editorial: 665,
      estado: true,
      fecha_publicacion: '2020-02-09',
      idioma: 'Español',
      num_paginas: 272,
      portada:
        'images/calificadores-de-lugar/0b8faf981f863c86c73e1357853b4a31.jpg',
      precio: 99425,
      resenia:
        'Pr¢logo de Perico Delgado y ep¡logo de PedroHorrilloLa relaci¢n de Espa¤a con el ciclismo delite es larga y exitosa. No por casualidad cuenta con algunos de losm s excepcionales ciclistas de todos los tiempos como Bahamontes,Oca¤a, Escart¡n, Perico, Indur in u Olano.Laura Meseguer, unade las periodistas m s respetadas y conocidas en el pelot¢ninternacional, repasa de manera din mica y profunda a travs dedecenas de entrevistas personales realizadas a los protagonistas, ysin evitar los temas polmicos, los £ltimos veinte a¤os del ciclismoespa¤ol, la poca m s dorada de este deporte, donde los Contador,Freire, Valverde y Purito, entre otros muchos, han logrado victoriaspicas en los puertos m s duros y en las carreras m sexigentes.Un relato humano imprescindible de esfuerzo,sacrificio y gloria de la denominada ®gran generaci¢n del ciclismoespa¤ol¯.',
      titulo: 'Metiendo Codos',
    }
  ]

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
          console.log(this.books);
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
