import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { DataTransferService } from '../services/data-transfer.service';
import { RestApiService } from '../services/rest-api.service';
import { APP_CONFIG } from 'src/app/app.config';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PagesComponent } from '../pages.component'
import Swal from 'sweetalert2';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Location, TitleCasePipe } from '@angular/common';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-header',
  templateUrl: './headernew.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  selectedIndex: number;
  logintype: string;
  parent_link: any = {};
  child_link: any = {};
  pages: any[] = [];
  parent_subscription;
  child_subscription;
  overlay_acc_model: boolean = false;
  overlay_user_manage_model: boolean = false;
  overlay_config_alert_model: boolean = false;
  overlay_invite_user_model: boolean = false;
  overlay_notifications_model: boolean = false;
  public userRole: any = [];
  error: string;
  compIndex = 0;
  lastname: string;
  firstname: string;
  firstletter: string;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  public profilePicture: boolean = false;
  tenantId: string;
  role: string;
  public notificationList: any[];
  public dataid: any;
  notificationscount: any;
  public stopnotificationsapicall: any;
  user_name: any;
  user_designation: any;
  sideBarOpen: Boolean = false;
  notificationbody: { tenantId: string; };
  notificationreadlist: any;
  notificationsList: any;
  user_details:any;
  user_firstletter:any;
  user_lName:any
  user_fName:any;
  lastName:any;
  firstName:any;
  tenantName:any;
  ProfileuserId:any;
  newAccessToken:any;
  tenantsList: any=[];
  navigationTenantName:any;
  items = [
    {label: "My Account",icon: 'pi pi-user',command: (e) => {this.myAccount()}},
    {label: "Change Password",icon: 'pi pi-lock',command: (e) => {this.changepassword()}},
    {label: "Signout",icon: 'pi pi-sign-out',command: (e) => {this.logout()}},
  ];
  ismyAccount : boolean = false;
  isClose : boolean;
  isPassword : boolean;
  isChatOpen:boolean=false;
  isChatEnable:boolean= false;
  highestExpireIn:any;
  tenantSwitchDropdown:boolean = false;
  isPredefinedBots:boolean = true;

  constructor(
    private router: Router,
    public page_obj: PagesComponent,
    private dataTransfer: DataTransferService,
    private rest_api: RestApiService,
    private spinner: LoaderService,
    private jwtHelper: JwtHelperService,private route: ActivatedRoute,
    @Inject(APP_CONFIG) private config,
    private titlecasePipe:TitleCasePipe,
    private location: Location,) {
    this.route.queryParams.subscribe(params => {
      if (params['accessToken']) {
        var acToken = params['accessToken']
        var refToken = params['refreshToken']
        this.firstName = params['firstName']
        this.lastName = params['lastName']
        this.ProfileuserId = params['ProfileuserId']
        this.tenantName = params['tenantName']
        var authKey = params['authKey']
        var ipadd = params['userIp']
        var loginType = params['loginType']
        if (acToken && refToken) {
          var accessToken = atob(acToken);
          var refreshToken = atob(refToken);
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("masterTenant", this.tenantName);
          localStorage.setItem("firstName", this.firstName);
          localStorage.setItem("lastName", this.lastName);
          localStorage.setItem("ProfileuserId", this.ProfileuserId);
          localStorage.setItem("tenantName", this.tenantName);
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
      this.rest_api.getNewAccessTokenByTenantId(tenantId,masterTenant).subscribe(resp => {
        this.newAccessToken = resp;
        localStorage.setItem('accessToken', this.newAccessToken.accessToken);
      });
    // this.getexpiryInfo();
  }

  ngOnInit() {
    this.parent_subscription = this.dataTransfer.current_parent_module.subscribe(res => this.parent_link = res);

    this.child_subscription = this.dataTransfer.current_child_module.subscribe(res => this.child_link = res);
    this.rest_api.getUserRole(2).subscribe(res => {
      this.userRole = res.message;
      localStorage.setItem('userRole', this.userRole);
    }, error => {
      //this.error = "Please complete your registration process";

    })
    setTimeout(() => {
      this.userDetails();
    }, 3000);

    this.dataTransfer.logged_userData.subscribe(res=>{
      if(res){
        this.addUserName(res);
        // this.getAllUsers(res.tenantID)
      }
    });
    // this.getTenantLists();
    this.navigationTenantName = localStorage.getItem("tenantSwitchName")
    this.isChatEnable = environment.isChatEnable? environment.isChatEnable : false;
  }

  loopTrackBy(index, term) {
    return index;
  }

  removenodes() {
    $(".bot-close").click();
  }

  ngOnDestroy() {
    this.parent_subscription.unsubscribe();
    this.child_subscription.unsubscribe();
  }

  myAccount() {
    this.ismyAccount = true;
    // this.router.navigate(['/pages/admin/myaccount']);
  }

  changepassword() {
    this.isPassword = true;
    // this.router.navigate(['/pages/admin/changepassword']);
  }

  userManagement() {
    var input = btoa("userManagement")
    window.location.href = this.config.logoutRedirectionURL + '?input=' + input;
  }

  configAlerts() {
    var input = btoa("alertsConfig")
    window.location.href = this.config.logoutRedirectionURL + '?input=' + input;
  }

  inviteUser() {
    var input = btoa("invite")
    window.location.href = this.config.logoutRedirectionURL + '?input=' + input;
  }

  logout() {
    this.logintype = localStorage.getItem('userRole');
    clearTimeout(this.stopnotificationsapicall)
    localStorage.clear();
    sessionStorage.clear();
    if (this.logintype == 'User') {
      window.location.href = 'https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=' + this.config.socialLoginRedirectURL
    }

    var input = btoa("Signout")
    this.router.navigate(['/redirect']);
  }

  userDetails() {
    var userDetails = localStorage.getItem('accessToken');
    var deCryptUserDetails = this.jwtHelper.decodeToken(userDetails);
    let userid = deCryptUserDetails.userDetails.userId;
    this.rest_api.getUserDetails(userid).subscribe(res => {
      this.retrieveResonse = res;
      if (res) {
        localStorage.setItem("company",this.retrieveResonse.company)
        this.user_details = this.retrieveResonse;
        // this.getAllNotifications(); \\ enable to show notification in header
        // this.getNotificationsList(); \\ enable to show notification in header
        this.user_name = this.retrieveResonse.firstName;
        this.user_designation = this.retrieveResonse.designation;
        this.dataTransfer.userDetails(this.user_details);
        this.addUserName(this.user_details);
        if (this.retrieveResonse.image == null || this.retrieveResonse.image == "") {
          this.profilePicture = false;
        } else {
          this.profilePicture = true;
        }
        this.base64Data = this.retrieveResonse.image;
        this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
      }
    });
  }

  getCount() {
    let userId = localStorage.getItem("ProfileuserId")
    this.stopnotificationsapicall = setTimeout(() => {
      if (this.role != null && userId != null) {
        this.getAllNotifications();
      }
    }, 10000);
  }

  getAllNotifications() {
    let userId = this.user_details.userId;
    this.tenantId = this.user_details.tenantID;
    this.role = this.userRole[0];
    let notificationbody = {
      "tenantId": this.tenantId
    }

    this.rest_api.getNotificationaInitialCount(this.role, userId, notificationbody).subscribe(data => {
      this.notificationList = data
      this.notificationscount = this.notificationList
      if (this.notificationscount == undefined || this.notificationscount == null) {
        this.notificationscount = 0;
      }
    })
    // this.getCount(); \\ enable to show notification in header
  }

  deletnotification(id) {
    this.dataid = id
  }

  canceldeleteNotification(index) {
    this.dataid = '';
  }

  deleteNotification(data) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn bluebg-button',
        cancelButton:  'btn new-cancelbtn',
      },
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.rest_api.deleteNotification(data).subscribe(resp => {
          Swal.fire({
            title: 'Success',
            text: `Notification deleted successfully!`,
            position: 'center',
            icon: 'success',
            showCancelButton: false,
            customClass: {
              confirmButton: 'btn bluebg-button',
              cancelButton:  'btn new-cancelbtn',
            },
    
            heightAuto: false,
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.value) {
              this.getNotificationsList();
            }
          })
        });
      }
    });
  }

  getNotificationsList() {
    let userId = this.user_details.userId
    this.tenantId = this.user_details.tenantID;
    this.role = this.userRole[0];
    let notificationbody = {
      "tenantId": this.tenantId
    }
    let resp_data:any;
    this.rest_api.getNotifications(this.role, userId, notificationbody).subscribe(data => {
      resp_data = data
      if(Array.isArray(resp_data)){
        this.notificationsList=resp_data.reverse()
      }
      if (resp_data.errorMessage == 'No Records Found') {
        this.error = "No Records Found"
      }
    })
  }

  notificationclick(id) {
    let userId = this.user_details.userId;
    this.tenantId = this.user_details.tenantID;
    this.role = this.userRole[0];
    this.notificationbody = {
      "tenantId": this.tenantId
    }
    if (this.notificationsList.find(ntf => ntf.id == id).status != 'read') {
      this.rest_api.getReadNotificaionCount(this.role, userId, id, this.notificationbody).subscribe(data => {
        this.notificationreadlist = data
        this.notificationsList.find(ntf => ntf.id == id).status = 'read'
        // this.getNotificationsList();
      })
    }
  }

  addUserName(data){
    this.user_fName=data.firstName;
        this.user_lName=data.lastName;
        var fname_fLetter = data.firstName.charAt(0);
        var lname_fLetter = data.lastName.charAt(0);
        this.user_firstletter = fname_fLetter + lname_fLetter;
  }

  getAllUsers(masterTenant){
    let tenantid=localStorage.getItem("tenantName")
  this.rest_api.getuserslist(masterTenant,tenantid).subscribe((res) => {
    let data =res
    if(Array.isArray(data)){
    data.forEach(element => {
      element["user_email"]= element.userId.userId
      element["firstName"]= element.userId.firstName
      element["lastName"]= element.userId.lastName
      element["user_role"] = element.roleID.displayName
      element["fullName"] = this.titlecasePipe.transform(element.userId.firstName)+' '+this.titlecasePipe.transform(element.userId.lastName)
    });
    this.dataTransfer.tenantBasedUsersList(data)
    }
  });
}

getTenantLists(){
  this.rest_api.getTenantnameslist().subscribe((res) => {
    this.tenantsList = res;
    this.tenantsList.sort((a, b) => (a.tenant_name.toLowerCase() > b.tenant_name.toLowerCase()) ? 1 : ((b.tenant_name.toLowerCase() > a.tenant_name.toLowerCase()) ? -1 : 0));
    this.tenantsList.map(item=>{
      item["label"] = item.tenant_name,
      item["command"]= (e) => { this.onChangeTenant(e)}
      return item
    })
  this.tenantName= [...this.tenantsList.filter((item:any)=>item.role=="Admin")];
   if(!localStorage.getItem("tenantSwitchName")){
    this.navigationTenantName = this.tenantName[0].tenant_name
    localStorage.setItem("role", this.tenantName[0].role);
   }
  })
}

onChangeTenant(event:any){
  this.spinner.show();
  let value = event.item
  let masterTenant=localStorage.getItem("masterTenant")
  // let value = this.tenantsList.find(data=>data.tenant_name == event.value);
  this.rest_api.getNewAccessTokenByTenantId(value.tenant_id,masterTenant).subscribe(async (data:any) => {
  await localStorage.setItem("accessToken", data.accessToken);
  await localStorage.setItem("tenantName",value.tenant_id);
  await localStorage.setItem("tenantSwitchName", value.tenant_name);
  await localStorage.removeItem("role");
  this.spinner.show();
  setTimeout(()=>{
    if(value.role =='Admin'){
      localStorage.setItem("role",value.role)
    }
    let url=(window.location.href)
    if(url.includes("home?accessToken")){
      window.location.href=window.location.href.split("?accessToken")[0];
    window.location.reload();  
    } else{
      this.location.replaceState("/pages/home")
      localStorage.setItem('selectedModule','eiap-home&'+ null);
      window.location.reload();
    }
  }, 1000)  
  });
}

closeFormOverlay() {
  this.ismyAccount = this.isClose;
  this.isPassword = this.isClose;
  this.isChatOpen = this.isClose;
}
display(event){
  this.isClose = event
  this.closeFormOverlay();
}

chatClick(){
  this.isChatOpen = true;
}

getexpiryInfo(){
  if(environment.isSubscrptionEnabled)
  this.rest_api.expiryInfo().subscribe(data => {
    // this.tenantSwitchDropdown = data.expiresIn === 0;
    this.tenantSwitchDropdown = data.expiresIn === 0 || data.expiresIn <= 0;
    this.isPredefinedBots = data.isPredefinedBots;
    this.dataTransfer.tenantInfo(data);
  })
}
}
