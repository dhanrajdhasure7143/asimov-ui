import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-deploy-notation',
  templateUrl: './deploy-notation.component.html',
  styleUrls: ['./deploy-notation.component.css']
})
export class DeployNotationComponent implements OnInit {
  deploy_success: boolean = true;
  depName: string;
  tenantId: string;
  endPoint: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private rest: RestApiService,
    public dialogRef: MatDialogRef<DeployNotationComponent>,
  ) { }

  ngOnInit() {
    this.deploy_success = false;
    console.log(this.data)
  }

  deployNotation() {
    this.deploy_success = true;
    let selecetedTenant =  localStorage.getItem("tenantName");
    let splitTenant:any;
    if(selecetedTenant){
       splitTenant = selecetedTenant.split('-')[0];
    }
    var formData: any = new FormData();
    formData.append('file', this.data.dataKey)
    formData.append('deployment-name', this.depName)
    formData.append('tenant-id', this.tenantId)
    formData.append('enable-duplicate-filtering', 'true')
    formData.append('deployment-source', this.data.fileNme)
    formData.append('content-type', ' text/xml')
    formData.append('file-name', this.data.fileNme)
    formData.append('field-name', this.data.fileNme)
    //formData.append('engine',  splitTenant);
    formData.append('engine', '424d2067');
    this.rest.deployBPMNNotation('/camunda/api/admin/deploy-rest/deploy/create', formData)
      .subscribe(res => {
        console.log(res)
      })
  }
  playDeployedNotation() {

  }

  gotoBPMNPlatform() {
    var token = localStorage.getItem('accessToken');
    window.location.href = "http://localhost:8080/camunda/app/welcome/424d2067/#!/login?accessToken=" + token + "&userID=karthik.peddinti@epsoftinc.com&tenentID=424d2067-41dc-44c1-b9a3-221efda06681"
  }

  closedeplyNonation() {
    this.dialogRef.close();
  }
}
