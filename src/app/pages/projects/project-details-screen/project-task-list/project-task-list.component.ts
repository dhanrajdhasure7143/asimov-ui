import { Component, OnInit, ViewChild } from '@angular/core';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import moment from 'moment';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTransferService } from 'src/app/pages/services/data-transfer.service';


@Component({
  selector: "app-project-task-list",
  templateUrl: "./project-task-list.component.html",
  styleUrls: ["./project-task-list.component.css"],
})
export class ProjectTaskListComponent implements OnInit {
  tasks_list: any;
  project_id: any;
  columns_list: any[] = [];
  representatives: any[] = [];
  users_data: any = [];

  _tabsList: any = [
    { tabName: "All", count: "0" ,img_src:"all-tasks.svg"},
    {tabName:"New","count":"0", img_src:"inprogress-tasks.svg"},
    { tabName: "In Progress", count: "0", img_src:"inprogress-tasks.svg" },
    { tabName: "In Review", count: "0", img_src:"inreview-tasks.svg"},
    { tabName: "Closed", count: "0", img_src:"completed-tasks.svg"}
  ];

  constructor(
    private rest_api: RestApiService,
    private route: ActivatedRoute,
    private Router: Router,
    private dataTransfer: DataTransferService
  ) {
    this.route.queryParams.subscribe((data) => {
      this.project_id = data.id;
    });
  }

  ngOnInit(): void {
    this.getUsersList()
  }

  getUsersList() {
    this.dataTransfer.tenantBased_UsersList.subscribe((res) => {
      if (res) {
            this.users_data = res;
            this.getTasksList();
      }
    });
  }

  getUserName(event) {
    var userName;
    this.users_data.forEach((element) => {
      if (element.userId == event) {
        userName = element.firstName + " " + element.lastName;
      }
    });
    return userName;
  }

  getTasksList() {
    this.rest_api.gettaskandComments(this.project_id).subscribe((data) => {
      this.tasks_list = data;
      console.log("tasks Data", data);
      this.tasks_list.map((item) => {
        item["timeStamp_converted"] = moment(item.lastModifiedTimestamp);
        item["endDate_converted"] = moment(item.endDate).format("lll");
        item["assignedTo"] = this.getUserName(item.resources);
        item["representative"] = {"name":item.priority}
        return item;
      });
      this.tasks_list.sort(function (a, b) {
        return b.timeStamp_converted - a.timeStamp_converted;
      });
      this._tabsList.forEach(element => {
        if(element.tabName == "All"){
          element.count = this.tasks_list.length
        }else{
        element.count = this.tasks_list.filter(
          (item) => item.status == element.tabName
        ).length;
        }
      });
    });

    this.columns_list = [
      {
        ColumnName: "taskName",
        DisplayName: "Task Name",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "taskCategory",
        DisplayName: "Type",
        ShowFilter: true,
        ShowGrid: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "priority",
        DisplayName: "Priority",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "multiSelect",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "assignedTo",
        DisplayName: "Assigned To",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "endDate_converted",
        DisplayName: "Due Date",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "date",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "action",
        DisplayName: "Action",
        ShowGrid: true,
        ShowFilter: false,
        sort: false,
        multi: false,
      }
    ];

    this.representatives = [
      {name: "High"},
      {name: "Medium"},
      {name: "Low"}
    ];
  }

  projectDetails() {
    this.Router.navigate(["listOfProjects"]);
  }

  deleteById(event) {}

  viewDetails(event) {}

  onTabChanged(event) {
    console.log(event)
  }
}