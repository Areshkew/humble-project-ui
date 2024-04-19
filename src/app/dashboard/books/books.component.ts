import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardShared } from '../dashboard.shared';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    DashboardShared,
  ],
  template: `<p>books works!</p>`,
  styleUrl: './books.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksComponent { }
