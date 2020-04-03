import { Component } from '@angular/core';

@Component({
  selector: 'app-bussiness-process',
  template: `<div class="module-heading">
              <div class="container">
                <img class="module-heading-image" src='..\\assets\\busineeprocessstudionewicon.svg'>
                <span class="module-heading-title">Business Process Studio</span>
              </div>
            </div><router-outlet></router-outlet>`,
  styleUrls: ['./business-process.component.css'] 
})
export class BusinessProcessComponent {

  constructor() { }

}
