import { Component, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-bussiness-process',
  templateUrl: './business-process.component.html' ,
  styleUrls: ['./business-process.component.css']
})
export class BusinessProcessComponent implements AfterViewChecked {

  isHeaderShow: any;
  isShowConformance: boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private cdRef: ChangeDetectorRef ) { }

  ngAfterViewChecked() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.isShowConformance = params['isShowConformance'] == 'true';
    });
    this.isHeaderShow = localStorage.getItem("isheader");
    this.cdRef.detectChanges();
  }

  route() {
    this.router.navigate(['/pages/home']);
  }


}
// <i class="fa fa-arrow-left" aria-hidden="true" (click)="route()"></i>&nbsp;&nbsp;&nbsp;
//                   <span class="module-heading-title">Business Process Studio</span>
//                   
