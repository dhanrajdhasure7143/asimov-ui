import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import { Inject } from '@angular/core';
import { RestApiService } from 'src/app/pages/services/rest-api.service';

@Component({
  selector: 'app-deploy-notation',
  templateUrl: './deploy-notation.component.html',
  styleUrls: ['./deploy-notation.component.css']
})
export class DeployNotationComponent implements OnInit {
  deploy_success: boolean = false;
  depName:string;
  tenantId:string;
  endPoint:string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private rest: RestApiService
  ) { }

  ngOnInit() {
    this.deploy_success = false;
    console.log(this.data)
  }

  deployNotation(){
    //this.deploy_success = true;
    console.log(this.depName);
    var formData: any = new FormData();
    formData.append('file', this.data.dataKey)
    formData.append('deployment-name', this.depName)
    formData.append('tenant-id', this.tenantId)
    formData.append('enable-duplicate-filtering', 'true')
    formData.append('deployment-source', this.data.fileNme)
    formData.append('content-type', ' text/xml')
    formData.append('file-name', this.data.fileNme)
    formData.append('field-name', this.data.fileNme)
    formData.append('engine', '424d2067');
  console.log(JSON.stringify(formData));
  for (var key of formData.entries()) {
    console.log(key[0] + ', ' + key[1])
  }
  

  // var xmlHttp = new XMLHttpRequest();
  //       xmlHttp.onreadystatechange = function()
  //       {
  //           if(xmlHttp.readyState == 4 && xmlHttp.status == 200)
  //           {
  //               alert(xmlHttp.responseText);
  //           }
  //       }
  //       xmlHttp.open("post", "/camunda/api/admin/deploy-rest/deploy/create"); 
  //       xmlHttp.setRequestHeader( "Content-Type","multipart/form-data")
  //       xmlHttp.setRequestHeader( "timezone","ignore")
        
  //       xmlHttp.send(formData); 
  
    this.rest.deployBPMNNotation('/camunda/api/admin/deploy-rest/deploy/create', formData)
      .subscribe(res =>{
        console.log(res)
      })


  }
  playDeployedNotation(){

  }
}
