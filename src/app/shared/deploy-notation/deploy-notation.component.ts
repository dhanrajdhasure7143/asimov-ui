import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { APP_CONFIG } from 'src/app/app.config';
import Swal from 'sweetalert2';
import { DataTransferService } from 'src/app/pages/services/data-transfer.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

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
  isLoading:boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private rest: RestApiService,
    public dialogRef: MatDialogRef<DeployNotationComponent>,
    private dt:DataTransferService,
    private router: Router,
    private messageService: MessageService,
    @Inject(APP_CONFIG) private config
  ) { 
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.endPoint = this.config.bussinessProcessEndPoint+"/deployprocess/notation";
  }

  deployNotation() {
    this.isLoading = true;
    let selecetedTenant =  localStorage.getItem("tenantName");
    let splitTenant:any;
    if(selecetedTenant){
       splitTenant = selecetedTenant.split('-')[0];
    }
    var formData: any = new FormData();
    formData.append('file', this.data.dataKey)
    formData.append('deploymentName', this.depName)
    formData.append('tenantID', selecetedTenant)
    formData.append('enableDuplicateFilter', 'true')
    formData.append('deploymentSource', this.data.fileNme)
    formData.append('fileName', this.data.fileNme)
    formData.append('fieldName', this.data.fileNme)
    formData.append('engine',  splitTenant);
    formData.append('department',  this.data.category);
    // formData.append('categoryId', this.data.categoryId)
    
    this.rest.deployBPMNNotation('/deployprocess/notation', formData)
      .subscribe(res => {
        let response:any = res;
        this.isLoading = false;
        if(response.status == 'success' || response.status == 'Success'){
        this.deploy_success = true;
        if(response.definitionId !=''){
          let obj={startprocess:true,definationId:response.definitionId}
          this.dt.deployNotationValue(obj);
        }else{
          let obj={startprocess:false,definationId:response.definitionId}
          this.dt.deployNotationValue(obj);
        }
        
        } else{
        this.isLoading = false;
        this.messageService.add({
          key: 'deplyBpmn',
          severity: 'error',
          summary: 'Error',
          detail: "Oops " + response.message
        })
          // Swal.fire({
          //   title: 'Oops!',
          //   text: response.message,
          //   icon: 'error',
          //   heightAuto: false,
          // })
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
    let navigateBackTo=this.router.url;
    window.location.href = this.config.camundaUrl+"/workflow/app/welcome/"+splitTenant+"/#!/login?accessToken=" + token + "&userID="+userId+"&tenentID="+selecetedTenant+"&navigate_back="+navigateBackTo;
  }

  closedeplyNonation() {
    this.dialogRef.close();
  }
}
