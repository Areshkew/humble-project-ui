import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<span [style.color]="color" 
              [style.font-size.px]="size"
              class="material-symbols-rounded" 
              style="pointer-events: none; user-select: none;">{{ icon }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent { 
    @Input() color!: string;
    @Input() size!: number;
    @Input() icon!: string;

    constructor(private el: ElementRef){
      this.el.nativeElement.style.display = "inline-flex";
      this.el.nativeElement.style.justifyContent = "center";
      this.el.nativeElement.style.alignItems = "center";
      this.el.nativeElement.style.width = `${this.size}px`;
      this.el.nativeElement.style.height = `${this.size}px`;
    }
}