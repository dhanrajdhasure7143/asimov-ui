import { Component, OnInit, ViewChild } from '@angular/core';
import {PagesComponent} from '../pages.component'
import * as $ from 'jquery';
import { DataTransferService } from "./../../pages/services/data-transfer.service";
import { RestApiService } from "./../services/rest-api.service"
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { OverlayPanel } from 'primeng/overlaypanel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { PredefinedBotsService } from '../services/predefined-bots.service';

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
  workspacedsiabled:boolean = false
  agentOrcheDisabled:boolean = false;
  @ViewChild('overlayPanel') overlayPanel: OverlayPanel;
  firstName:string;
  lastName:string;
  userName :string='';
  userEmail:string=''
  user_firstletter:string;
  ismyAccount:boolean = false;
  isPassword:boolean = false;
  showContactUs:boolean = false;
  contactForm: FormGroup;
  messageTooShort: boolean = true;

  constructor(public obj:PagesComponent, 
    private dt:DataTransferService,
    private rest_service: RestApiService,
    private router:Router,
    private route : ActivatedRoute,
    private fb: FormBuilder,
    private toastService: ToasterService,
    private toastMessage :toastMessages,
    private spinner : LoaderService,
    private rest_api: PredefinedBotsService
  ) {
      this.route.queryParams.subscribe(params => {
        if (params['accessToken']) {
          var acToken = params['accessToken']
          var refToken = params['refreshToken']
          this.firstName = params['firstName']
          this.lastName = params['lastName']
          let ProfileuserId = params['ProfileuserId']
          let tenantName = params['tenantName']
          var authKey = params['authKey']
          var ipadd = params['userIp']
          var loginType = params['loginType'];

          if (acToken && refToken) {
            var accessToken = atob(acToken);
            var refreshToken = atob(refToken);
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("masterTenant", tenantName);
            localStorage.setItem("firstName", this.firstName);
            localStorage.setItem("lastName", this.lastName);
            localStorage.setItem("ProfileuserId", ProfileuserId);
            localStorage.setItem("tenantName", tenantName);
            localStorage.setItem("authKey", authKey);
            var ipp = atob(ipadd)
            localStorage.setItem('ipAddress', ipp);
          }
          if (loginType) {
            var officeUser = atob(loginType);
            localStorage.setItem("officeUser", officeUser);
          }
        }
      });
        let tenantId=localStorage.getItem("tenantName")
        let masterTenant=localStorage.getItem("masterTenant")
        this.rest_service.getNewAccessTokenByTenantId(tenantId,masterTenant).subscribe(resp => {
          let newAccessToken:any = resp;
          localStorage.setItem('accessToken', newAccessToken.accessToken);
        });
        setTimeout(() => {
          this.getUserDetails();
        }, 500);

     }

  ngOnInit() {
    //this.disable();
    this.isSubscriptionModuleEnable = environment.isSubscriptionModuleEnable;
    document.cookie = "card_enabled="+environment.isSubscrptionEnabled;
    if(this.getCookie("card_enabled")!="false"){
      document.cookie = "card_enabled=true";
    }

    // this.getexpiryInfo();
    this.rest_service.getUserRole(2).subscribe(res=>{
      this.userRoles=res.message
    });
    // if(this.dashboardDetails)
    // {
    //   this.rest_service.getDashBoardsList().subscribe((res:any)=>{
    //     let dashbordlist:any=res.data;
    //     this.dashboardDetails = dashbordlist.find(item=>item.defaultDashboard == true);
    //   })
    // }
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
  // this.getAllPlans();
  // this.getUserScreenList();
  this.isCopilotEnable = environment.isCopilotEnable
  this.isCustomerBots = environment.isCustomerBots

  this.contactForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    userEmail: [''],
    message: ['', Validators.required]
  });

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
      if(this.isPredefinedBots){
      if(this.getCookie("workspacedsiabled")!="false"){
        document.cookie = "workspacedsiabled=true";
        this.workspacedsiabled = true;
      }else{
        this.workspacedsiabled = false;
      }

      // cookie for AI agents orchestration hide
      if(this.getCookie("agentOrcheDisabled")!="false"){
        document.cookie = "agentOrcheDisabled=true"
        this.agentOrcheDisabled = true;
      }else{
        this.agentOrcheDisabled = false;
      }
    }else{
      this.workspacedsiabled = false
      this.agentOrcheDisabled = false
    }
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
  openUserMenu(event){
    this.overlayPanel.toggle(event);
    this.getUserDetails();
  }
  getUserDetails(){
    this.user_firstletter = localStorage.getItem('firstName').charAt(0).toUpperCase()+localStorage.getItem('lastName').charAt(0).toUpperCase();
    this.userName = localStorage.getItem('firstName') + ' ' + localStorage.getItem('lastName');
    this.userEmail = localStorage.getItem('ProfileuserId');
  }

  closeFormOverlay(event?) {
    this.ismyAccount = false;
    this.isPassword = false;
  }

  myAccount() {
    this.ismyAccount = true;
    this.overlayPanel.hide();
  }

  changepassword() {
    this.isPassword = true;
    this.overlayPanel.hide();
  }

  logout() {
    // this.logintype = localStorage.getItem('userRole');
    // clearTimeout(this.stopnotificationsapicall)
    localStorage.clear();
    sessionStorage.clear();
    // if (this.logintype == 'User') {
    //   window.location.href = 'https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=' + this.config.socialLoginRedirectURL
    // }

    // var input = btoa("Signout")
    this.router.navigate(['/redirect']);
  }

  showContactSupport(){
    this.showContactUs = true;
  }

  contactUs() {
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const userEmail = localStorage.getItem('ProfileuserId');
    this.contactForm.patchValue({
      firstName: firstName,
      lastName: lastName,
      userEmail: userEmail
    });
    this.spinner.show();
      const payload = this.contactForm.value;
      this.rest_api.contactUs(payload).subscribe((response: any) => {
        this.spinner.hide();
        if (response.code == 4200) {
          this.toastService.showSuccess(this.toastMessage.contactUsSuccess, 'response')
          this.showContactUs = false;
        } else {
          this.toastService.showError(this.toastMessage.contactUsError)
        }
      }, error => {
        this.spinner.hide();
        this.toastService.showError(this.toastMessage.apierror)
      });
  }

  onMessageInput() {
    const message = this.contactForm.get('message').value || '';
    this.messageTooShort = message.length < 150;
  }

  resetForm() {
    this.contactForm.reset()
  }
}
