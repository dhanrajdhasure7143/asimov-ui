import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTransferService } from "../services/data-transfer.service";
import { PagesHints } from '../model/pages.model';
import { RestApiService } from '../services/rest-api.service';


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
  
  constructor(private router: Router, private dt:DataTransferService, private rest_api: RestApiService, private route: ActivatedRoute, private hints:PagesHints) {
  }

  ngOnInit() {
    this.getAllPlans();
    this.rest_api.getUserRole(2).subscribe(res=>{
    this.userRole=res.message;
    if(this.userRole.includes('Process Owner') || this.userRole.includes('Process Architect') || this.userRole.includes('Process Analyst') || this.userRole.includes('RPA Developer')){
      this.isdivShow=true;
    }else{
      this._isShow=true;
    }
      localStorage.setItem('userRole',this.userRole);
      localStorage.setItem('project_id',null);
    },error => {
      //this.error = "Please complete your registration process";
    })
  }

  navigateToModule(){
    this.router.navigateByUrl('/pages/'+this.dataArr[this.selectedIndex].link);
  }

  loopTrackBy(index, term){
    return index;
  }

  getAllPlans() {
    this.tenantId = localStorage.getItem('tenantName');
    this.rest_api.expiryInfo().subscribe(data => {
      this.expiry = data.Expiresin;
      localStorage.setItem('expiresIn',this.expiry)
      // if(this.expiry<0){
      //   this.router.navigate(['/pages/subscriptions'])
      // }  
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
})
}

}
