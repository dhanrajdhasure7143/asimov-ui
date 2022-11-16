import { Component, OnInit } from '@angular/core';
import {PagesComponent} from '../pages.component'
import * as $ from 'jquery';
import { DataTransferService } from "./../../pages/services/data-transfer.service";
import { RestApiService } from "./../services/rest-api.service"

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isExpanded = true;
  showSubmenu: boolean = false;
  showprocessesSubmenu: boolean = false;
  showadminSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  showadminSubSubMenu: boolean = false;
  public userRoles:any = [];
  freetrail: boolean;
  tenantId: string;
  plansList: any;
  expiry: any;
  showProjectsSubmenu: boolean = false;
  constructor(public obj:PagesComponent, private dt:DataTransferService,
    private rest_service: RestApiService) { }

  ngOnInit() {
    //this.disable();
    document.cookie = "card_enabled=false";
    if(this.getCookie("card_enabled")!="false"){
      document.cookie = "card_enabled=true";
    }
    this.getexpiryInfo();
    this.rest_service.getUserRole(2).subscribe(res=>{
      this.userRoles=res.message
    });
    let active_module=localStorage.getItem('selectedModule')
    if(active_module){
    let selected_module=active_module.split('&')
        $('.link').removeClass('active');
        $('#'+selected_module[0]).addClass("active");
        if(selected_module[1]){
          $('#'+selected_module[1]).addClass("active");
        }
    }else{
      localStorage.setItem('selectedModule','eiap-home&'+ null);
      $('#eiap-home').addClass("active");
    }

    setTimeout(() => {
      // this.userRoles = localStorage.getItem("userRole")
    }, 200);
  this.getAllPlans();
  }
  getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  hightlight(element,name){
    localStorage.setItem('selectedModule',element+'&'+name)
     $('.link').removeClass('active');
     $('#'+element).addClass("active");
     if(name){
      $('#'+name).addClass("active");
     }
     this.obj.sideBarOpen=false;
     this.obj.sidebar.showSubmenu=false;
     this.obj.sidebar.showprocessesSubmenu=false;
      this.obj.sidebar.showadminSubmenu=false;
      this.obj.sidebar.showProjectsSubmenu=false;
      this.obj.contentMargin = 60;
  }
  
  selection(){
     this.obj.sideBarOpen=true;
     this.obj.contentMargin=260;
   }

   getAllPlans() {
    this.tenantId = localStorage.getItem('tenantName');
    this.rest_service.getProductPlans("EZFlow", this.tenantId).subscribe(data => {
      this.plansList = data
      if(this.plansList.length > 1){
     this.plansList.forEach(element => {
       if(element.subscribed==true){
        this.plansList=element
       }
     });
     if(this.plansList.nickName=='Standard'){
       this.freetrail=true
     }
     else{
      this.freetrail=false
     }
    }
  })
}

getexpiryInfo(){
  this.rest_service.expiryInfo().subscribe(data => {
    this.expiry = data.Expiresin;
    console.log("left over days ----",this.expiry)

  })
}
}
