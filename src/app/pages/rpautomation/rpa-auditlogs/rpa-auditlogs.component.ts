import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from '../../services/rest-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { cpuUsage } from 'process';
import moment from 'moment';
@Component({
  selector: 'app-rpa-auditlogs',
  templateUrl: './rpa-auditlogs.component.html',
  styleUrls: ['./rpa-auditlogs.component.css']
})
export class RpaAuditlogsComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  constructor(private activatedRoute:ActivatedRoute,private router: Router, private rest:RestApiService,private spinner:NgxSpinnerService) { }
  botId:any;
  auditLogsData:any=[];
  displayedColumns: string[] = ["changedDate",'botName',"changedBy",];
  dataSource:MatTableDataSource<any>;
  @ViewChild("paginator",{static:false}) paginator: MatPaginator;
  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe((params:any)=>{
      console.log("params",params)
      if(params==undefined)
      {
        this.router.navigate(["home"])
      }
      else
      {
        this.botId=params.botId;
        this.getEnvironments(params.catergoryId)
      }
    })

}
getEnvironments(categoryId:number){
  this.rest.getFilteredEnvironment(categoryId).subscribe(data=>{
    let response:any=data
    if(response.errorMessage==undefined)
    {
      let environments:any=[];
      environments=response.filter(item=>item.activeStatus==7);
      this.getAuditLogs(environments)
    }
    else
    {
    }
  })

}
getAuditLogs(environments)
{

  this.rest.getAuditLogs(this.botId).subscribe((data:any)=>{
    console.log("data",data)
     if(data.errorMessage==undefined)
     {
      this.dataSource= new MatTableDataSource(data.Status);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;
       this.auditLogsData=[...data.Status.map((item:any)=>{
         if(item.botName.split("|")[1]!=undefined)
         {
          item["changedDate"] = moment(new Date(item.changedDate)).format('LLL')
           item["Status"]=item.botName.split("|")[1];
           if(item["Status"]=='AddedEnv'|| item['Status']=='RemovedEnv')
           {
             let envId=parseInt(item.taskName);
             item["taskName"]=environments.find((envItem:any)=>envItem.environmentId==envId)==undefined?'Deleted Environment':environments.find((envItem:any)=>envItem.environmentId==envId).environmentName;
           }
         }
         else
         {
           item["Status"]="UpdatedConfig"
         }
         return item;
       })].reverse();
     //  this.auditLogsModelRef=this.modalService.show(this.auditLogsPopup, {class:"logs-modal"});
     }
     else{
       Swal.fire("Error",data.errorMessage,"error")
     }
  },err=>{
    this.spinner.hide();
    Swal.fire("Error","Unable to get audit logs","error")
  })
}

open(){
  this.router.navigate(["/pages/rpautomation/designer"],{queryParams:{botId:this.botId}})
}
}