import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[normalizeSpaces]',
  standalone: true
})
export class NormalizeSpacesDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    const normalized = value.replace(/^ +/, '').replace(/\s+/g, ' ');
    this.el.nativeElement.value = normalized;
  }
}
