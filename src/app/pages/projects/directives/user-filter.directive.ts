import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appUserFilter]'
})
export class UserFilterDirective {
  @Output() filteredUsers = new EventEmitter<string[]>();

  constructor(private el: ElementRef) {
    el.nativeElement.addEventListener('input', () => {
      const inputValue = el.nativeElement.value;
      const usernames = inputValue.match(/@(\w+)/g);
      const filteredUsernames = usernames ? usernames.map(username => username.slice(1)) : [];
      this.filteredUsers.emit(filteredUsernames);
    });
  }
}
