import { Component, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-bussiness-process',
  template: `<div class="module-heading">
              <div class="container">
                <i class="fa fa-arrow-left" aria-hidden="true" (click)="route()"></i>&nbsp;&nbsp;&nbsp;
                <img class="module-heading-image" src='..\\assets\\busineeprocessstudionewicon.svg'>
                <span class="module-heading-title">{{isShowConformance ? 'Process Intelligence' : 'Business Process Studio' }}</span>
              </div>
            </div><router-outlet></router-outlet>`,
  styleUrls: ['./business-process.component.css'] 
})
export class BusinessProcessComponent implements AfterViewChecked {

  isShowConformance:boolean = false;

  constructor(private router:Router,private activatedRoute:ActivatedRoute) { }

  ngAfterViewChecked(){
    this.activatedRoute.queryParams.subscribe(params => {
      this.isShowConformance = params['isShowConformance'] == 'true';
    });
  }

  route(){
    this.router.navigate(['/pages/home']);
  }
  

}
