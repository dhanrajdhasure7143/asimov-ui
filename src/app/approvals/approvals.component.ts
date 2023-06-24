import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../services/loader/loader.service';
import { ActivatedRoute } from '@angular/router';
import { Base64 } from 'js-base64';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
// import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.css']
})
export class ApprovalsComponent implements OnInit {

  public tokenData:any;
  public status:any;
  public http:any;
  public approvalsList:any[]=[];
  public loading = true;
  public columns_list = [
    // {ColumnName: "sno",DisplayName: "S.No",ShowGrid: true,ShowFilter: false,filterWidget: "normal",filterType: "text",sort: false},
    {ColumnName: "approvalInfo",DisplayName: "Approval Info",ShowGrid: true,ShowFilter: false,filterWidget: "normal",filterType: "text",sort: false},
    {ColumnName: "approverName",DisplayName: "Approver Name",ShowGrid: true,ShowFilter: false,filterWidget: "normal",filterType: "text",sort: false,multi: false,showTooltip:false},
    {ColumnName: "createdAt",DisplayName: "Created At",ShowGrid: true,ShowFilter: false,filterWidget: "normal",filterType: "text"},
];
  
  constructor(private activeRoute:ActivatedRoute, private httpBackend:HttpBackend) {
    this.http=new HttpClient(this.httpBackend);
   }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe((params:any)=>{
      let tokenData:any=JSON.parse(Base64.decode(params.token));
      this.tokenData=tokenData;
      this.tokenData["status"]=params.status;
      this.status=params.status;
      this.loginUser();
    });
  }

  loginUser(){
    this.loading = true;
    let user=JSON.parse(this.tokenData.loggedUser);
    this.http.post(environment.idm_url+"/api/login/beta/token", {userId:user.loggedUser}).subscribe((response:any)=>{
      this.getTenantBasedAccessToken(response, user);
      //this.getApprovals(response);
    },err=>{
      this.loading = false;
      Swal.fire("Error","Unable to get access token","error");
    })
  }

  getTenantBasedAccessToken(authToken:any, user:any){
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken.accessToken}`)
    .set('Refresh-Token', authToken.refreshToken)
    .set('Timezone', timezone);
    this.http.get(environment.idm_url+"/api/login/beta/newAccessToken?tenant_id="+user.tenantId, {headers}).subscribe((authResponse:any)=>{
      this.getApprovals(authResponse,authToken.refreshToken);
    },err=>{
      this.loading = false;
      Swal.fire("Error","Unable to get access token", "error")
    })
  }

  getApprovals(authToken:any, refreshToken:any){
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken.accessToken}`)
    .set('Refresh-Token', refreshToken)
    .set('Timezone', timezone);
    this.http.get(environment.rpa_url+`/rpa-service/rpa-inbox/${this.tokenData.toUser}`, {headers}).subscribe((response:any)=>{
      this.updateApprovals(headers, response["data"])
    },err=>{
      this.loading = false;
      Swal.fire("Error","Unable to get pending approvals","error");
    })
  }


  updateApprovals(headers:any, approvals:any[]){
    let filteredApprovals:any[]=[]
    filteredApprovals=approvals.filter((item:any)=>{
      if(item.status=="Pending" && item.botId==this.tokenData.botId && item.runId==this.tokenData.runId){
        item["modifiedBy"]=this.tokenData.toUser;
        item["status"]=this.tokenData.status;
        return item;
      }
    });
    if(filteredApprovals.length==0){
      this.loading = false;
      return;
    }

    this.http.post(`/rpa-service/update-approval-status`, filteredApprovals, {headers}).subscribe((response:any)=>{
      this.loading = false;
      if(response.status){
        this.approvalsList=filteredApprovals;
        Swal.fire("Success", response.status, "success");
      } else {
        Swal.fire("Error","Unable to get update approvals","error");
      }
    },err=>{
      this.loading = false;
      Swal.fire("Error","Unable to get update approvals","error");
    })
  }

}
