import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {
  
  @Input() allowedKeys: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Backspace", "Tab"];

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  constructor() { }

}
