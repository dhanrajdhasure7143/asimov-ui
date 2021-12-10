import { Component } from '@angular/core';

@Component({
  selector: 'app-service-orchestration',
  template: `<router-outlet></router-outlet>`,
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
        font-weight: 600;
        color: black;
        opacity: 1;
      }

  `],
})
export class ServiceOrchestrationComponent {
  constructor() { }
  ngOnDestroy(){
    localStorage.removeItem("orc_tab");
}

}



