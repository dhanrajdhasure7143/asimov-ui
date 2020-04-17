import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bussiness-process',
  template: `<div class="module-heading">
              <div class="container">
                <img class="module-heading-image" src='..\\assets\\busineeprocessstudionewicon.svg'>
                <span class="module-heading-title">Process Intelligence</span>
              </div>
            </div><router-outlet></router-outlet>`
})
export class ProcessIntelligenceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
