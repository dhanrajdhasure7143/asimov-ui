import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { DataTransferService } from '../../services/data-transfer.service';
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from 'ngx-spinner';
import * as $ from 'jquery';
@Component({
  selector: 'app-orchestration',
  templateUrl: './orchestration.component.html',
  styleUrls: ['./orchestration.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class OrchestrationComponent implements OnInit {

  constructor(private dt:DataTransferService, private route:ActivatedRoute, private spinner:NgxSpinnerService, private router: Router) { }
  public selectedTab=0;
  public check_tab=0;
  public param:any=0;
  public back_button:boolean =false;
  ngOnInit() {
    $('.link').removeClass('active')
    $('#so').addClass("active")
    $("#nav-link-3").addClass("active");
    $("#nav-link-2").removeClass("active");
    $("#nav-link-1").removeClass("active");
    $("#nav-link-0").removeClass("active");
    //  if(localStorage.getItem('project_id')!="null"){
      const queryParams = this.route.snapshot.queryParams;
      if (Object.keys(queryParams).length > 0) {
      this.back_button = true;
      }else{
      this.back_button = false;
     }
    //  }

    //.className+="active"
    this.dt.changeParentModule({"route":"/pages/serviceOrchestration/home", "title":"Service Orchestration"});
    this.dt.changeChildModule(undefined);
    let processId;

    this.route.queryParams.subscribe(params => {
        processId=params;
      if(this.isEmpty(processId))
      {
        this.selectedTab=0;
        this.param=0;
        this.check_tab=0
      }
      else
      {
        this.selectedTab=1;
      //  this.selectedTab=3;
        this.param=processId.processid;
        this.check_tab=1;
      // this.check_tab=3;
       
      }
    });
    if(localStorage.getItem("orc_tab")){
      this.selectedTab = Number(localStorage.getItem("orc_tab"));
      this.check_tab = Number(localStorage.getItem("orc_tab"));
      }
  
  }

  routeToProjectDetails(){
   this.router.navigate(["/pages/businessProcess/uploadProcessModel"], 
   {queryParams:{"bpsId":localStorage.getItem('bpsId'),"ver":localStorage.getItem("ver"),"ntype":localStorage.getItem("ntype")}})
  }


  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }
  onTabChanged(event)
  {
    localStorage.setItem("orc_tab", event.index)
    this.check_tab=event.index;
  }

  options:any
  option(page)
  {
    this.spinner.show();
    this.options=page
  }


}
