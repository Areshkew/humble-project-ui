import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardShared } from '../dashboard.shared';

@Component({
  selector: 'app-shops',
  standalone: true,
  imports: [
    DashboardShared,
  ],
  template: `<p>shops works!</p>`,
  styleUrl: './shops.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopsComponent { }
