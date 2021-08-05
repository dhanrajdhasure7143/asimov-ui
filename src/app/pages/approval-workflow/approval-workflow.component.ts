import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-approval-workflow',
  template: `<div class="main-content">
              <div class="row content-area">
                <div class=" row module-heading title">
                  <span class="module-back-button" routerLink="/home">
                    <i class="fas fa-arrow-left" aria-hidden="true"></i>
                  </span>
                  <span class="module-heading-title">Business Process Studio / Approval Workflow</span>
                </div>
                <router-outlet></router-outlet>
              </div>
            </div>`
})
export class ApprovalWorkflowComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
