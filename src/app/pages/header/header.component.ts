import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { DataTransferService } from '../services/data-transfer.service';
import { RestApiService } from '../services/rest-api.service';
import { APP_CONFIG } from 'src/app/app.config';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PagesComponent } from '../pages.component'
import Swal from 'sweetalert2';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
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

  constructor(
    private router: Router,
    private page_obj: PagesComponent,
    private dataTransfer: DataTransferService,
    private rpa: RestApiService,
    private spinner: NgxSpinnerService,
    private jwtHelper: JwtHelperService,private route: ActivatedRoute,
    @Inject(APP_CONFIG) private config) {
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
    this.rpa.getNewAccessToken().subscribe(resp => {
      this.newAccessToken = resp;
      localStorage.setItem('accessToken', this.newAccessToken.accessToken);
    });
  }

  ngOnInit() {
    this.parent_subscription = this.dataTransfer.current_parent_module.subscribe(res => this.parent_link = res);

    this.child_subscription = this.dataTransfer.current_child_module.subscribe(res => this.child_link = res);
    this.rpa.getUserRole(2).subscribe(res => {
      this.userRole = res.message;
      localStorage.setItem('userRole', this.userRole);
    }, error => {
      //this.error = "Please complete your registration process";

    })
    this.spinner.show();    
    setTimeout(() => {
      this.userDetails();
    }, 3000);
    setTimeout(() => {
      this.spinner.hide();
    }, 900);

    this.dataTransfer.logged_userData.subscribe(res=>{
      if(res){
        this.addUserName(res);
      }
    });
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
    this.router.navigate(['/pages/admin/myaccount'])
  }

  changepassword() {
    this.router.navigate(['/pages/admin/changepassword'])
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
    this.rpa.getUserDetails(userid).subscribe(res => {
      this.retrieveResonse = res;
      if (res) {
        this.user_details = this.retrieveResonse;
        this.getAllNotifications();
        this.getNotificationsList();
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

    this.rpa.getNotificationaInitialCount(this.role, userId, notificationbody).subscribe(data => {
      this.notificationList = data
      this.notificationscount = this.notificationList
      if (this.notificationscount == undefined || this.notificationscount == null) {
        this.notificationscount = 0;
      }
    })
    this.getCount();
  }

  deletnotification(id) {
    this.dataid = id
  }

  canceldeleteNotification(index) {
    this.dataid = '';
  }

  deleteNotification(data, index) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.rpa.deleteNotification(data).subscribe(resp => {
          Swal.fire({
            title: 'Success',
            text: `Notification Deleted Successfully!!`,
            position: 'center',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#007bff',
            cancelButtonColor: '#d33',
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
    this.rpa.getNotifications(this.role, userId, notificationbody).subscribe(data => {
      resp_data = data
      if(Array.isArray(resp_data)){
        this.notificationsList=resp_data.reverse()
      }
      if (resp_data.errorMessage == 'No records found') {
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
      this.rpa.getReadNotificaionCount(this.role, userId, id, this.notificationbody).subscribe(data => {
        this.notificationreadlist = data
        this.notificationsList.find(ntf => ntf.id == id).status = 'read'
        this.getNotificationsList();
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
}
