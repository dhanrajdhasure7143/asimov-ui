import { Component } from '@angular/core';

@Component({
  selector: 'app-service-orchestration',
  template: `<div class="module-heading">
              <div class="container-fluid">
                <img class="module-heading-image" src='..\\assets\\busineeprocessstudionewicon.svg'>
                <span class="module-heading-title">Service Orchestration</span>
              </div>
            </div><router-outlet></router-outlet>`
})
export class ServiceOrchestrationComponent {
  constructor() { }
}
