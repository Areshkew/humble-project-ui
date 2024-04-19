import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardShared } from '../dashboard.shared';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [
    DashboardShared
  ],
  template: `<p>support works!</p>`,
  styleUrl: './support.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportComponent { }
