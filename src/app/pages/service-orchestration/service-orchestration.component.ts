import { Component } from '@angular/core';

@Component({
  selector: 'app-service-orchestration',
  template: `<div class="module-heading">
              <div class="container-fluid">
                <img class="module-heading-image" src='..\\assets\\busineeprocessstudionewicon.svg'>
                <span class="module-heading-title">Service Orchestration</span>
              </div>
            </div><router-outlet></router-outlet>`,
  styles:[`
      ::ng-deep .mat-tab-label{
      height :50px !important;
      padding: 0 10px !important;
      min-width: 10px !important;
      }
      ::ng-deep .mat-ink-bar{
      min-width:10px !important;
      }
      ::ng-deep.mat-tab-label.mat-tab-label-active:not(.mat-tab-disabled),
      ::ng-deep.mat-tab-label.mat-tab-label-active.cdk-keyboard-focused:not(.mat-tab-disabled) {
        font-weight: 500;
        color: black;
        opacity: 1;
      }

  `],
})
export class ServiceOrchestrationComponent {
  constructor() { }
}



