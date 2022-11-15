import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from '../../services/rest-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import moment from 'moment';
@Component({
  selector: 'app-rpa-auditlogs',
  templateUrl: './rpa-auditlogs.component.html',
  styleUrls: ['./rpa-auditlogs.component.css']
})
export class RpaAuditlogsComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  botId: any;
  auditLogsData: any = [];
  displayedColumns: string[] = ["versionNew", "changedDate", 'botName', "changedBy", "comments"];
  dataSource: MatTableDataSource<any>;
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private rest: RestApiService, private spinner: NgxSpinnerService) { }
  
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params == undefined) {
        this.router.navigate(["home"])
      } else {
        this.botId = params.botId;
        this.getEnvironments(params.catergoryId)
      }
    })
    this.spinner.show();
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
        Swal.fire("Error", response.errorMessage, "error")
      }
    })
  }

  getAuditLogs(environments) {  // api to get audit logs
    this.rest.getAuditLogs(this.botId).subscribe((data: any) => {
      let response: any = data
      if (response.errorMessage == undefined) {
        this.dataSource = new MatTableDataSource(response.Status);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.auditLogsData = [...response.Status.map((item: any) => {
          if (item.botName.split("|")[1] != undefined) {
            if (item.versionNew != null) {
              item["versionNew"] = parseFloat(item.versionNew).toFixed(1)
            }
            item["changedDate"] = moment(new Date(item.changedDate)).format('lll')
            item["Status"] = item.botName.split("|")[1];
            if (item["Status"] == 'AddedEnv' || item['Status'] == 'RemovedEnv') {
              let envId = parseInt(item.taskName);
              item["taskName"] = environments.find((envItem: any) => envItem.environmentId == envId) == undefined ? 'Deleted Environment' : environments.find((envItem: any) => envItem.environmentId == envId).environmentName;
            }
          } else {
            item["Status"] = "UpdatedConfig"
          }
          return item;
        })].reverse();
        //  this.auditLogsModelRef=this.modalService.show(this.auditLogsPopup, {class:"logs-modal"});
      }
      else {
        Swal.fire("Error", response.errorMessage, "error")
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
}