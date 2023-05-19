import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-approval-workflow',
  template: `<div class="maincont">
                <div class="maincont-contentarea">
                  <div class="maincontent">
                    <div class="row main-content-head">
                    <h3>
                    <label id="popup_title">
                      <a routerLink="/pages/businessProcess/home" class="imageBox">
                      <span class="active-icon" >
                      <img src="./../../../../assets/images-n/projects/backarrow1.png" alt="">
                    </span>
                    <span class="hover-icon" >
                      <img src="./../../../../assets/images-n/projects/backarrow.svg" alt="">
                    </span>
                      </a>
                    </label>
                    <span class="title_text_haspath">
                      <span class="breadcrum-back" routerLink="/pages/businessProcess/home">Business Process Studio</span> <span class="breadcrum-align">/</span> <span
                        class="sub_title_text">Approval Workflow</span>
                    </span>
                  </h3>
                    </div>
                    <router-outlet></router-outlet>
                  </div>
                </div>
              </div>`
})
export class ApprovalWorkflowComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
