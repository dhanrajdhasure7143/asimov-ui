import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { APP_CONFIG } from 'src/app/app.config';
import Swal from 'sweetalert2';
import { DataTransferService } from 'src/app/pages/services/data-transfer.service';

@Component({
  selector: 'app-deploy-notation',
  templateUrl: './deploy-notation.component.html',
  styleUrls: ['./deploy-notation.component.css']
})
export class DeployNotationComponent implements OnInit {
  deploy_success: boolean = false;
  depName: string;
  tenantId: string;
  endPoint: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private rest: RestApiService,
    public dialogRef: MatDialogRef<DeployNotationComponent>,
    private dt:DataTransferService,
    @Inject(APP_CONFIG) private config
  ) { 
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.endPoint = this.config.bussinessProcessEndPoint+"/deployprocess/notation";
  }

  deployNotation() {
    
    let selecetedTenant =  localStorage.getItem("tenantName");
    let splitTenant:any;
    if(selecetedTenant){
       splitTenant = selecetedTenant.split('-')[0];
    }
    var formData: any = new FormData();
    formData.append('file', this.data.dataKey)
    formData.append('deploymentName', this.depName)
    formData.append('tenantID', this.tenantId)
    formData.append('enableDuplicateFilter', 'true')
    formData.append('deploymentSource', this.data.fileNme)
    //formData.append('content-type', ' text/xml')
    formData.append('fileName', this.data.fileNme)
    formData.append('fieldName', this.data.fileNme)
    formData.append('engine',  splitTenant);
    // formData.append('engine', '424d2067');
    
    this.rest.deployBPMNNotation('/deployprocess/notation', formData)
      .subscribe(res => {
        let response:any = res;
        if(response.status == 'success' || response.status == 'Success'){
        this.deploy_success = true;
        let obj={startprocess:true,definationId:response.definitionId}
        this.dt.deployNotationValue(obj);
        } else{
          Swal.fire(
            'Oops!',
            response.message,
            'error'
          )
        }
      })
  }
  playDeployedNotation() {

  }

  gotoBPMNPlatform() {
    var token = localStorage.getItem('accessToken');
    let selecetedTenant =  localStorage.getItem("tenantName");
    let userId = localStorage.getItem("ProfileuserId");
    let splitTenant:any;
    if(selecetedTenant){
       splitTenant = selecetedTenant.split('-')[0];
    }
    window.location.href = this.config.bpmPlatfromUrl+"/camunda/app/welcome/"+splitTenant+"/#!/login?accessToken=" + token + "&userID="+userId+"&tenentID="+selecetedTenant;
   //var token=localStorage.getItem('accessToken');
    // window.location.href=this.config.bpmPlatfromUrl+"/camunda/app/welcome/424d2067/#!/login?accessToken="+token+"&userID=karthik.peddinti@epsoftinc.com&tenentID=424d2067-41dc-44c1-b9a3-221efda06681"
  }

  closedeplyNonation() {
    this.dialogRef.close();
  }
}
