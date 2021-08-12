import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, DoCheck, OnChanges, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bussiness-process',
  template: `<div class="main-content">
              <div class="row content-area">
                <div class="module-heading title">                  
                  <span class="module-header-title">Process Intelligence</span>
                  <span class="insight-back-button" *ngIf="isShow"> <a href="javascript:void(0);" (click)="gotoProcessgraph()">Go Back</a> </span>
                </div>
                <div class="module-body">
                <router-outlet></router-outlet>
                </div>
              </div>
            </div>`
})
export class ProcessIntelligenceComponent implements OnInit {
 isShow:boolean  = false;
 wpiIdNumber:any;
  constructor(private changeDetectorRef:ChangeDetectorRef,
    private router:Router,
    private route: ActivatedRoute) { 
   
  
  }

  ngOnInit() {
   
   
 }
 ngAfterViewChecked(){
 
    let windowUrl = window.location.href;
    if(windowUrl.indexOf('insights') == -1){
      this.isShow=false;
    } else{
      this.isShow=true;
  }
  this.route.queryParams.subscribe(params => {
    if(params['wpid']!=undefined){
        this.wpiIdNumber = parseInt(params['wpid']);
      }
    });
  this.changeDetectorRef.detectChanges();

 }

 gotoProcessgraph(){
  this.router.navigate(["/pages/processIntelligence/flowChart"],{queryParams:{wpiId:this.wpiIdNumber}})
}

}

// <img class="module-heading-image" src='..\\assets\\busineeprocessstudionewicon.svg'>