import { Component, OnInit } from '@angular/core';
import {PagesComponent} from '../pages.component'
import * as $ from 'jquery';
import { DataTransferService } from "./../../pages/services/data-transfer.service";
import { RestApiService } from "./../services/rest-api.service"
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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
  showCustomerSupportBotsSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  showadminSubSubMenu: boolean = false;
  public userRoles:any = [];
  freetrail: boolean;
  tenantId: string;
  plansList: any;
  expiry: any;
  showProjectsSubmenu: boolean = false;
  screensList:any=[];
  role: any;
  _selectedModule:any;
  isProcessLogsEnable:boolean = false;
  isCopilotEnable:boolean = false;
  dashboardDetails:any={};
  isCustomerBots:boolean = false;
  isSideMenuDisabled: boolean = false;
  highestExpireIn:any;
  isSubscriptionModuleEnable:boolean = false;
  isPredefinedBots:boolean = true;

  constructor(public obj:PagesComponent, private dt:DataTransferService,
    private rest_service: RestApiService,private router:Router,) { }

  ngOnInit() {
    //this.disable();
    this.isSubscriptionModuleEnable = environment.isSubscriptionModuleEnable;
    document.cookie = "card_enabled="+environment.isSubscrptionEnabled;
    if(this.getCookie("card_enabled")!="false"){
      document.cookie = "card_enabled=true";
    }
    this.getexpiryInfo();
    this.rest_service.getUserRole(2).subscribe(res=>{
      this.userRoles=res.message
    });
    if(this.dashboardDetails)
    {
      this.rest_service.getDashBoardsList().subscribe((res:any)=>{
        let dashbordlist:any=res.data;
        this.dashboardDetails = dashbordlist.find(item=>item.defaultDashboard == true);
      })
    }
    let active_module=localStorage.getItem('selectedModule')
    if(active_module){
    let selected_module=active_module.split('&')
      this._selectedModule = selected_module[0];
        $('.link').removeClass('active');
        $('#'+selected_module[0]).addClass("active");
        if(selected_module[1]){
          $('#'+selected_module[1]).addClass("active");
        }
    }else{
      localStorage.setItem('selectedModule','eiap-home&'+ null);
      $('#eiap-home').addClass("active");
      this._selectedModule ='eiap-home';
    }

    setTimeout(() => {
      // this.userRoles = localStorage.getItem("userRole")
    }, 200);
  this.getAllPlans();
  // this.getUserScreenList();
  this.isCopilotEnable = environment.isCopilotEnable
  this.isCustomerBots = environment.isCustomerBots

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
    this.dt.triggerReset();
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
      this.obj.sidebar.showCustomerSupportBotsSubmenu=false;
      this.obj.sidebar.showProjectsSubmenu=false;
      this.obj.contentMargin = 62;
      if(element=='dashboard')
      {
        this.rest_service.getDashBoardsList().subscribe((res:any)=>{
          let dashbordlist:any=res.data;
          let defaultDashBoard = dashbordlist.find(item=>item.defaultDashboard == true);
          if(defaultDashBoard == undefined || dashbordlist.length == 0 ){
            this.router.navigate(["/pages/dashboard/create-dashboard"])
          }else{
            const newObj = Object.assign({}, {dashboardId: defaultDashBoard.id,dashboardName : defaultDashBoard.dashboardName});
            this.router.navigate(['/pages/dashboard/dynamicdashboard'], { queryParams: newObj})
          }
        })
      }
      if(element=='eiap-home')
      {
        this.router.navigate(['/pages/home'])
      }
  }
  
  selection(){
    this.role = localStorage.getItem("role")
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
  if(environment.isSubscrptionEnabled)
    this.rest_service.expiryInfo().subscribe(data => {
      this.expiry = data.Expiresin;
      // this.isSideMenuDisabled = data.expiresIn === 0;
      this.isSideMenuDisabled = data.expiresIn === 0 || data.expiresIn <= 0;
      this.isPredefinedBots = data.isPredefinedBots;
    });
}

// onClickScreen(screen:any){
//   this.dt.setScreenList(screen)
//   this.router.navigate(["/pages/admin/user"],{queryParams:{Screen_ID:screen.Screen_ID,Table_Name:screen.Table_Name}});

// }

// getUserScreenList(){
//   this.rest_service.getUserScreenList().subscribe((data:any)=>{
//     this.screensList=data;
//   });
// }
userManagement(){
  this.router.navigate(["/pages/admin/user-management"],{
    queryParams:{index:0}
  })
}

onClickSubscription(){
this.router.navigate(["/pages/subscriptions"],{
  queryParams:{index:0}
})
}

navigateToDashBoard(){
        this.rest_service.getDashBoardsList().subscribe((res:any)=>{
        let dashbordlist:any=res.data;
        let defaultDashBoard = dashbordlist.find(item=>item.defaultDashboard == true);
        if(dashbordlist.length == 0){
          this.router.navigate(["/pages/dashboard/create-dashboard"])
        }else{
          this.router.navigate(['/pages/dashboard/dynamicdashboard'], { queryParams: {dashboardId:defaultDashBoard.id,dashboardName:defaultDashBoard.dashboardName}})
        }
      })
}
}
