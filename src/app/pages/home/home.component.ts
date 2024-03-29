import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTransferService } from "../services/data-transfer.service";
import { PagesHints } from '../model/pages.model';
import { RestApiService } from '../services/rest-api.service';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/services';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataArr:any[] = [];
  public userRole:any = [];
  selectedIndex: number=0;
  error: string;
  newAccessToken:any;
  customUserRole: any;
  hintsArray:any[]=[];
  isdivShow:boolean=false;
  _isShow:boolean=false;
  isLoading:boolean=true;
  ProfileuserId:any;
  lastName:any;
  firstName:any;
  tenantName:any;
  tenantId: string;
  plansList: any;
  freetrail: boolean;
  expiry: any;
  _params:any={};
  highestExpireIn:boolean = false;
  showWarningPopup:boolean;
  constructor(private router: Router, 
    private dt:DataTransferService, 
    private rest_api: RestApiService, 
    private route: ActivatedRoute,
    private authService: AuthenticationService
    ) 
    {
      this.route.queryParams.subscribe(params => {
        this._params = params
      })
    }

  ngOnInit() {
        // Disable service worker
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            for (const registration of registrations) {
              registration.unregister();
            }
          });
      }
    
    this.getAllPlans();
    // this.rest_api.getUserRole(2).subscribe(res=>{
    // this.userRole=res.message;
    // if(this.userRole.includes('Process Owner') || this.userRole.includes('Process Architect') || this.userRole.includes('Process Analyst') || this.userRole.includes('RPA Developer')){
    //   this.isdivShow=true;
    // }else{
    //   this._isShow=true;
    // }
    //   localStorage.setItem('userRole',this.userRole);
    //   localStorage.setItem('project_id',null);
    // },error => {
    //   //this.error = "Please complete your registration process";
    // })

    //  --- Redirection to copilot ---
    if (!environment.isSubscrptionEnabled) {
      if (environment.isCopilotEnable)
        this.router.navigate(["/pages/copilot/home"], { queryParams: this._params });
      if (!environment.isCopilotEnable)
        this.rest_api.getDashBoardsList().subscribe((res: any) => {
          let dashbordlist: any = res.data;
          let defaultDashBoard = dashbordlist.find(item => item.defaultDashboard == true);
          if (defaultDashBoard == undefined || dashbordlist.length == 0) {
            this.router.navigate(["/pages/dashboard/create-dashboard"], { queryParams: this._params })
          } else {
            const newObj = Object.assign({}, this._params, { dashboardId: defaultDashBoard.id, dashboardName: defaultDashBoard.dashboardName });
            this.router.navigate(['/pages/dashboard/dynamicdashboard'], { queryParams: newObj })
          }
        })
    }
  }

  navigateToModule(){
    this.router.navigateByUrl('/pages/'+this.dataArr[this.selectedIndex].link);
  }

  loopTrackBy(index, term){
    return index;
  }

  getAllPlans() {
    this.tenantId = localStorage.getItem('tenantName');
    this.rest_api.getUserRole(2).subscribe(res=>{
      this.userRole=res.message;
  if(environment.isSubscrptionEnabled){
    this.rest_api.expiryInfo().subscribe(data => {
      this.expiry = data;
      console.log("left over days ----",this.expiry)
      // if(this.expiry<0){
      //   this.router.navigate(['/pages/subscriptions'])
      // }  
      // this.highestExpireIn = data.expiresIn === 0;
      this.highestExpireIn = data.expiresIn === 0 || data.expiresIn <= 0;
      if (this.highestExpireIn) {
        if (this.userRole.includes('System Admin')) {
            this.showWarningPopup = true;
        } else if (this.userRole.includes('Process Owner')) {
            this.showWarningPopup = true;
        }
     } else {
      if(environment.isCopilotEnable)
      this.router.navigate(["/pages/copilot/home"], {queryParams:this._params});
        if(!environment.isCopilotEnable)
          this.rest_api.getDashBoardsList().subscribe((res:any)=>{
          let dashbordlist:any=res.data;
          let defaultDashBoard = dashbordlist.find(item=>item.defaultDashboard == true);
          if(defaultDashBoard == undefined || dashbordlist.length == 0 ){
            this.router.navigate(["/pages/dashboard/create-dashboard"],{ queryParams: this._params})
          }else{
            const newObj = Object.assign({}, this._params, {dashboardId: defaultDashBoard.id,dashboardName : defaultDashBoard.dashboardName});
            this.router.navigate(['/pages/dashboard/dynamicdashboard'], { queryParams: newObj})
          }
        })
     }
  })

    this.rest_api.getProductPlans("EZFlow", this.tenantId).subscribe(data => {
      this.plansList = data
      if(this.plansList.length > 1){
     this.plansList.forEach(element => {
       if(element.subscribed==true){
        this.plansList=element
       }
     });
     if(this.plansList.nickName=='Standard'){
       this.freetrail=true;
      this.isLoading=false;
      console.log("expiry-----",this.expiry)
      if(this.expiry>0){
       this.router.navigate(['/pages/projects/listOfProjects'])}
       localStorage.setItem('freetrail',JSON.stringify(this.freetrail))
     }
     else{
      this.freetrail=false;
      this.isLoading=false;
      localStorage.setItem('freetrail',JSON.stringify(this.freetrail))
     }
    }
  })
}
});
}

onResubscribe(){
  this.router.navigate(["/pages/subscriptions"], { queryParams: { index: 0 } });
}

onClickLogout(){
  this.authService.logout();
  this.router.navigate(['/redirect']);
}

}
