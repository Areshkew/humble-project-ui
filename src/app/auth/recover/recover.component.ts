import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-recover',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<p>recover works!</p>`,
  styleUrl: './recover.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoverComponent { }
