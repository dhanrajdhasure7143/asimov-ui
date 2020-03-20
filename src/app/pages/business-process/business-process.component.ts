import { Component } from '@angular/core';

@Component({
  selector: 'app-bussiness-process',
  template: `<div class="container-fluid bps-heading">
                <div class="bps-heading-image">
                    <img src='..\\assets\\busineeprocessstudionewicon.svg'>
                </div>
                <div class="bps-heading-title">
                    <label>Business Process Studio</label>
                </div>
             </div><router-outlet></router-outlet>`,
  styleUrls: ['./business-process.component.css'] 
})
export class BusinessProcessComponent {

  constructor() { }

}
