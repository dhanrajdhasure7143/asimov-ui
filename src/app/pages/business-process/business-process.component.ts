import { Component, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-bussiness-process',
  template: `<div class="main-content">
              <div class="row content-area">
                <div class="module-heading">
                  <i class="fa fa-arrow-left" aria-hidden="true" (click)="route()"></i>&nbsp;&nbsp;&nbsp;
                  <img class="module-heading-image" src='..\\assets\\busineeprocessstudionewicon.svg'>
                  <span class="module-heading-title">{{isShowConformance ? 'Process Intelligence' : 'Business Process Studio' }}</span>
                </div>
                <router-outlet></router-outlet>
              </div>
            </div>`,
  styleUrls: ['./business-process.component.css']
})
export class BusinessProcessComponent implements AfterViewChecked {

  isShowConformance: boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngAfterViewChecked() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.isShowConformance = params['isShowConformance'] == 'true';
    });
  }

  route() {
    this.router.navigate(['/pages/home']);
  }


}
