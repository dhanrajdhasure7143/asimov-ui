
import { Component, OnInit } from "@angular/core";
import { LoaderService } from "../services/loader/loader.service";
import { ActivatedRoute } from "@angular/router";
import { Base64 } from "js-base64";
import { HttpBackend, HttpClient, HttpHeaders } from "@angular/common/http";
import Swal from "sweetalert2";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-so-approval',
  templateUrl: './so-approval.component.html',
  styleUrls: ['./so-approval.component.css']
})
export class SoApprovalComponent implements OnInit {
  public tokenData: any;
  public status: any;
  public http: any;
  public approvalsList: any[] = [];
  public loading = true;

  constructor(
    private activeRoute: ActivatedRoute,
    private httpBackend: HttpBackend
  ) {
    this.http = new HttpClient(this.httpBackend);
  }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe((params: any) => {
      let tokenData: any = JSON.parse(Base64.decode(params.token));
      console.log(tokenData)
      this.tokenData = tokenData;
      this.tokenData["status"] = params.status;
      this.status = params.status;
      this.loginUser();
    });
  }

  loginUser() {
    this.loading = true;
    this.http.post(environment.idm_url + "/api/login/beta/token", { userId: this.tokenData.emailId,}).subscribe((response: any) => {
          this.getTenantBasedAccessToken(response);
          //this.getApprovals(response);
    },(err) => {
          this.loading = false;
          Swal.fire("Error", "Unable to get access token", "error");
        }
      );
  }

  getTenantBasedAccessToken(authToken: any,) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const headers = new HttpHeaders()
      .set("Authorization", `Bearer ${authToken.accessToken}`)
      .set("Refresh-Token", authToken.refreshToken)
      .set("Timezone", timezone);
    this.http.get(environment.idm_url + "/api/login/beta/newAccessToken?tenant_id=" +this.tokenData.tenantId,{ headers })
      .subscribe((authResponse: any) => {
          console.log("authResponse"+authResponse);
          this.getApprovals(authResponse, authToken.refreshToken);
        },(err) => {
          this.loading = false;
          Swal.fire("Error", "Unable to get access token", "error");
        }
      );
  }

  getApprovals(authToken: any, refreshToken: any) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const headers = new HttpHeaders()
      .set("Authorization", `Bearer ${authToken.accessToken}`)
      .set("Refresh-Token", refreshToken)
      .set("Timezone", timezone);
    this.http.get(environment.rpa_url + `/rpa-service/inbox`,{ headers })
      .subscribe((response: any) => {
        // console.log(response)
          this.updateApprovals(headers, response);
        },(err) => {
          this.loading = false;
          Swal.fire("Error", "Unable to get pending tasks", "error");
        }
      );
  }

  updateApprovals(headers: any, approvals) {
    let filteredApprovals: any[] = [];
    filteredApprovals = approvals.filter((item: any) => { return item.status == "Pending";});
    if (filteredApprovals.length == 0) {
      this.loading = false;
        Swal.fire("Info", "No pending tasks", "info");
      return;
    }
    filteredApprovals.map(each=>{
      each.status = this.status
      return each
    })
    console.log(filteredApprovals)
    var _self= this
    this.http.post(environment.rpa_url + '/rpa-service/human-task-actions-list',filteredApprovals,{ headers })
      .subscribe((response: any) => {
          this.loading = false;
          if (response.status) {
            this.approvalsList = filteredApprovals;
            let status= "List of tasks "+_self.status+" successfully!";
            Swal.fire("Success", status, "success");
          } else {
            Swal.fire("Error", "Unable to update Pending tasks", "error");
          }
        },(err) => {
          this.loading = false;
          Swal.fire("Error", "Unable to update Pending tasks", "error");
        }
      );
  }
}
