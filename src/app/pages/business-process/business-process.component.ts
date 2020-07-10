import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-bussiness-process',
  template: `<div class="module-heading">
              <div class="container">
                <i class="fa fa-arrow-left" aria-hidden="true" (click)="route()"></i>&nbsp;&nbsp;&nbsp;
                <img class="module-heading-image" src='..\\assets\\busineeprocessstudionewicon.svg'>
                <span class="module-heading-title">Business Process Studio</span>
              </div>
            </div><router-outlet></router-outlet>`,
  styleUrls: ['./business-process.component.css'] 
})
export class BusinessProcessComponent {

  constructor(private router:Router) { }
route()
{
this.router.navigate(['/pages/home']);
}
}
