import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from '../../services/rest-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import moment from 'moment';
import { Table } from 'primeng/table';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { columnList } from 'src/app/shared/model/table_columns';
@Component({
  selector: 'app-rpa-auditlogs',
  templateUrl: './rpa-auditlogs.component.html',
  styleUrls: ['./rpa-auditlogs.component.css'],
  providers:[columnList]
})
export class RpaAuditlogsComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  botId: any;
  auditLogsData: any = [];
  displayedColumns: string[] = ["versionNew", "changedDate_new", 'botName', "changedBy", "comments"];
  dataSource: MatTableDataSource<any>;
  @ViewChild("paginator") paginator: MatPaginator;
  columns_list: any = [];
  logsData: any =[];
  table_searchFields:any=['versionNew','changedDate','changeActivity','changedBy','comments','taskName','newValue','previousValue']

  constructor(private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private rest: RestApiService, 
    private spinner: LoaderService,
    private columnList : columnList
    ) { }
  
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params == undefined) {
        this.router.navigate(["home"])
      } else {
        this.botId = params.botId;
        this.spinner.show();
        this.getEnvironments(params.catergoryId)
      }
    })
    this.spinner.show();
    this.columns_list = this.columnList.auditLogs_column
  }

  getEnvironments(categoryId: number) { //to get environments
    this.rest.getFilteredEnvironment(categoryId).subscribe(data => {
      let response: any = data
      if (response.errorMessage == undefined) {
        let environments: any = [];
        environments = response.filter(item => item.activeStatus == 7);
       this.getAuditLogs(environments)
      }
      else {
        this.spinner.hide();
        Swal.fire("Error", response.errorMessage, "error")
      }
    },err=>{
      this.spinner.hide();
    })
  }

  getAuditLogs(environments) {  // api to get audit logs
    this.spinner.show()
    this.rest.getAuditLogs(this.botId).subscribe((data: any) => {
      // let response: any = data
      this.logsData = data.Status
      this.spinner.hide()
      if (this.logsData.errorMessage == undefined) {
        this.auditLogsData = [this.logsData.map((item: any) => {
          if (item.botName.split("|")[1] != undefined) {        
            if (item.versionNew != null) {
              item["versionNew"] =  "V"+ parseFloat(item.versionNew).toFixed(1) 
            }
            item["changedDate_new"] = new Date(item.changedDate)
            item["Status"] = item.botName.split("|")[1];
            if (item["Status"] == 'AddedEnv' || item['Status'] == 'RemovedEnv') {
              let envId = parseInt(item.taskName);
              item["taskName"] = environments.find((envItem: any) => envItem.environmentId == envId) == undefined ? 'Deleted Environment' : environments.find((envItem: any) => envItem.environmentId == envId).environmentName;
            }
            if(item['status']=='UpdatedVersion'){
              item["taskName"]=`Version ${item.previousValue} is upgraded to Version ${item.newValue}</b>`
            }
            if(item['Status']=='UpdatedConfig')
            {
              if(item.changeActivity=='Email')
              {
                if(item.newValue!="")
                {  
                  let newValue:any=JSON.parse(item.newValue);
                  if(newValue.credentialId!=undefined)
                  {
                    item['newValue']=newValue.userName;
                  }
                }
                if(item["previousValue"]!="")
                {
                  let previouseValue:any=JSON.parse(item.previousValue);
                  if(previouseValue.credentialId!=undefined)
                  {
                    item['previousValue']=previouseValue.userName;
                  }
                }
              }
            }
          } else {
            item["Status"] = "UpdatedConfig";
          }
          return item;
        })].reverse();
        //  this.auditLogsModelRef=this.modalService.show(this.auditLogsPopup, {class:"logs-modal"});
      }
      else {
        Swal.fire("Error", this.logsData.errorMessage, "error")
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      Swal.fire("Error", "Unable to get audit logs", "error")
    })
  }

  open() {
    this.router.navigate(["/pages/rpautomation/designer"], { queryParams: { botId: this.botId } })
  }

  fitTableViewCategory(processName) {
    if (processName && processName.length > 30)
      return processName.substr(0, 30) + '..';
    return processName;
  }
  
  clear(table: Table) {
    table.clear();
}
}