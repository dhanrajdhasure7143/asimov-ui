import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from "@angular/router";
import { DataTransferService } from '../services/data-transfer.service';
import { RestApiService } from '../services/rest-api.service';
import { APP_CONFIG } from 'src/app/app.config';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthenticationService } from 'src/app/services/authentication.service';
import {PagesComponent} from '../pages.component'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  selectedIndex: number;
  logintype: string;
  parent_link:any={};
  child_link:any={};
  pages:any[] = [];
  parent_subscription;
  child_subscription;
  overlay_acc_model: boolean=false;
  overlay_user_manage_model: boolean=false;
  overlay_config_alert_model: boolean=false;
  overlay_invite_user_model: boolean=false;
  overlay_notifications_model: boolean=false;
  public userRole:any = [];
  error: string;
  compIndex = 0;
  lastname: string;
  firstname: string;
  firstletter: string;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  public profilePicture:boolean=false;
  tenantId: string;
 role: string;
 public notificationList: any[];
 public dataid: any;
 notificationscount: any;
 public stopnotificationsapicall:any;
 user_name:any;
 user_designation:any;
 sideBarOpen:Boolean=false;
  constructor(
    private router:Router,
    private page_obj:PagesComponent,
    private dataTransfer:DataTransferService,
    private rpa:RestApiService,
    private spinner:NgxSpinnerService,
    @Inject(APP_CONFIG) private config) { }

  ngOnInit() {
    this.parent_subscription = this.dataTransfer.current_parent_module.subscribe(res => this.parent_link = res);

    this.child_subscription = this.dataTransfer.current_child_module.subscribe(res => this.child_link = res);
    this.rpa.getUserRole(2).subscribe(res=>{
    this.userRole=res.message;
    localStorage.setItem('userRole',this.userRole);
    if(this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('User')){
      this.pages = [
        {"img":"assets/images/pi.svg", "title":"Process Intelligence", "link":"/pages/processIntelligence/upload"},
        {"img":"assets/images/busstudioicon1.svg", "title":"Business Process Studio", "link":"/pages/businessProcess/home"},
        {"img":"assets/images/robothand.svg", "title":"RPA Studio", "link":"/pages/rpautomation/home"},
        {"img":"assets/images/settingsicon.svg", "title":"Service Orchestration", "link":"/pages/serviceOrchestration/home"}
         ];
    }
    if(this.userRole.includes('RPA Admin')){
      if(this.pages.filter(f=>f.title === 'RPA Studio' ).length <= 0){
        this.pages.push({"img":"assets/images/robothand.svg", "title":"RPA Studio", "link":"/pages/rpautomation/home"})
      }
      if(this.pages.filter(f=>f.title === 'Service Orchestration' ).length <= 0){
        this.pages.push({"img":"assets/images/settingsicon.svg", "title":"Service Orchestration", "link":"/pages/serviceOrchestration/home"})
      }
      // this.pages = [
      //   {"img":"assets/images/robothand.svg", "title":"RPA Studio", "link":"/pages/rpautomation/home"},
      //   {"img":"assets/images/settingsicon.svg", "title":"Service Orchestration", "link":"/pages/serviceOrchestration/home"}

      // ];
    }
     if(this.userRole.includes('RPA Designer')){
      if(this.pages.filter(f=>f.title === 'RPA Studio' ).length <= 0){
        this.pages.push({"img":"assets/images/robothand.svg", "title":"RPA Studio", "link":"/pages/rpautomation/home"})
      }
      // this.pages = [
      //   {"img":"assets/images/robothand.svg", "title":"RPA Studio", "link":"/pages/rpautomation/home"},

      // ];

     }
     if(this.userRole.includes('Data Architect') || this.userRole.includes('Process Designer') || this.userRole.includes('Automation Designer')){
      if(this.pages.filter(f=>f.title === 'Business Process Studio' ).length <= 0){
        this.pages.push({"img":"assets/images/busstudioicon1.svg", "title":"Business Process Studio", "link":"/pages/businessProcess/home"})
      }

      // this.pages = [
      //   {"img":"assets/images/busstudioicon1.svg", "title":"Business Process Studio", "link":"/pages/businessProcess/home"},

      // ];

     }
     if(this.userRole.includes('Process Analyst')){
      if(this.pages.filter(f=>f.title === 'Process Intelligence' ).length <= 0){
        this.pages.push({"img":"assets/images/pi.svg", "title":"Process Intelligence", "link":"/pages/processIntelligence/upload"})
      }

      // this.pages = [
      //   {"img":"assets/images/pi.svg", "title":"Process Intelligence", "link":"/pages/processIntelligence/upload"},

      // ];

     }
     if(this.userRole.includes('Process Architect')){
      if(this.pages.filter(f=>f.title === 'Business Process Studio' ).length <= 0){
        this.pages.push({"img":"assets/images/busstudioicon1.svg", "title":"Business Process Studio", "link":"/pages/businessProcess/home"})
      }
      // this.pages = [
      //   {"img":"assets/images/busstudioicon1.svg", "title":"Business Process Studio", "link":"/pages/approvalWorkflow/home"}
      // ];

     }

    },error => {
      //this.error = "Please complete your registration process";

    })
    this.spinner.show();
    setTimeout(() => {
      this.getImage();
      this.profileName();
      this.getAllNotifications();
        },1000);
        setTimeout(() => {
          this.spinner.hide();
        }, 900);


  }

  loopTrackBy(index, term){
    return index;
  }

  removenodes()
  {
    $(".bot-close").click();
  }
  closeAllModules(){
    this.overlay_user_manage_model = false;
    this.overlay_config_alert_model = false;
    this.overlay_invite_user_model = false;
    this.overlay_acc_model = false;
    this.overlay_notifications_model=false;
  }

  slideUp(e){
    this.closeAllModules();
    this.overlay_acc_model = e=="my_acc";
    this.overlay_user_manage_model = e=="user_manage";
    this.overlay_config_alert_model = e=="config_alert";
    this.overlay_invite_user_model = e=="invite_user";
    if(e!="my_acc" && e!="user_manage" && e!="config_alert" && e!="invite_user")
      this.overlay_notifications_model = true;
    var modal = document.getElementById('header_overlay');
    modal.style.display="block";
  }

  ngOnDestroy(){
    this.parent_subscription.unsubscribe();
    this.child_subscription.unsubscribe();
  }
  myAccount(){
    var input = btoa("myAccount")
    window.location.href=this.config.logoutRedirectionURL+'?input='+input;
  }
  userManagement(){
    var input = btoa("userManagement")
    window.location.href=this.config.logoutRedirectionURL+'?input='+input;
  }
  configAlerts(){
    var input = btoa("alertsConfig")
    window.location.href=this.config.logoutRedirectionURL+'?input='+input;
  }
  inviteUser(){
    var input = btoa("invite")
    window.location.href=this.config.logoutRedirectionURL+'?input='+input;
  }
  logout(){

   this.logintype = localStorage.getItem('userRole');
    clearTimeout(this.stopnotificationsapicall)
    localStorage.clear();
    sessionStorage.clear();
    
    if(this.logintype == 'User'){
      
      window.location.href = 'https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri='+this.config.socialLoginRedirectURL
    }

    var input = btoa("Signout")
    //window.location.href=this.config.logoutRedirectionURL+'?input='+input;
    // window.location.href=this.config.logoutRedirectionURL+'?input='+input;
    this.router.navigate(['/redirect']);
  }

  profileName(){
    setTimeout(() => {
    this.firstname=localStorage.getItem('firstName');
      this.lastname=localStorage.getItem('lastName');
      var firstnameFirstLetter=this.firstname.charAt(0)
      var lastnameFirstLetter=this.lastname.charAt(0)
      this.firstletter=firstnameFirstLetter+lastnameFirstLetter
    }, 1000);
  }

  getImage() {
    // console.log("inside image")
      const userid=localStorage.getItem('ProfileuserId');
          this.rpa.getUserDetails(userid).subscribe(res => {
                this.retrieveResonse = res;
                setTimeout(() => {
                    this.user_name=this.retrieveResonse.firstName
                    this.user_designation=this.retrieveResonse.designation
                  }, 500);
                if(this.retrieveResonse.image==null||this.retrieveResonse.image==""){
                 this.profileName();
                  this.profilePicture=false;
                }
                else{
                  this.profilePicture=true;
                }
                this.base64Data= this.retrieveResonse.image;
               // console.log("image",this.base64Data);
               // localStorage.setItem('image', this.base64Data);
                this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
               // console.log(this.retrievedImage);
              }
            );
        }

        getCount(){
        let userId =  localStorage.getItem("ProfileuserId")
          this.stopnotificationsapicall=setTimeout(() => {
         if(this.role!=null&&userId!=null){
          this.getAllNotifications();
           }
          }, 10000);
          }
          getAllNotifications() {
            let userId =  localStorage.getItem("ProfileuserId")
              this.tenantId=localStorage.getItem('tenantName');
              this.role=localStorage.getItem('userRole')
             let notificationbody ={
             "tenantId":this.tenantId
               }

                this.rpa.getNotificationaInitialCount(this.role,userId,notificationbody).subscribe(data => {
                  this.notificationList = data
                  this.notificationscount=this.notificationList
                  // console.log(this.notificationscount)
                  if(this.notificationscount==undefined||this.notificationscount==null)
                  {
                    this.notificationscount=0;
                  }
              // console.log("count",this.notificationList.length)
               })
                this.getCount();

             }
}
