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
  showadminSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  showadminSubSubMenu: boolean = false;
  public userRoles:any = [];
  constructor(private obj:PagesComponent, private dt:DataTransferService,
    private rest_service: RestApiService) { }

  ngOnInit() {
    //this.disable();
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
    }, 1000);
   
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
      this.obj.sidebar.showadminSubmenu=false;
      this.obj.contentMargin = 60;
  }
  
  selection(){
     this.obj.sideBarOpen=true;
     this.obj.contentMargin=260;
   }

}
