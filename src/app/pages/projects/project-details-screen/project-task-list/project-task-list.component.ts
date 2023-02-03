import { Component, OnInit, ViewChild } from "@angular/core";
import { RestApiService } from "src/app/pages/services/rest-api.service";
import moment from "moment";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { ActivatedRoute, Router } from "@angular/router";
import { DataTransferService } from "src/app/pages/services/data-transfer.service";
import { TabView } from "primeng/tabview";
import { LoaderService } from "src/app/services/loader/loader.service";
import Swal from 'sweetalert2';

@Component({
  selector: "app-project-task-list",
  templateUrl: "./project-task-list.component.html",
  styleUrls: ["./project-task-list.component.css"],
})
export class ProjectTaskListComponent implements OnInit {
  tasks_list: any[]=[];
  all_tasks_list: any[]=[];
  project_id: any;
  columns_list: any[] = [];
  representatives: any[] = [];
  users_data: any = [];
  project_details:any;
  projectName:any;
  _tabsList: any = [
    { tabName: "All", count: "0", img_src: "all-tasks.svg" },
    { tabName: "New", count: "0", img_src: "inprogress-tasks.svg" },
    { tabName: "In Progress", count: "0", img_src: "inprogress-tasks.svg" },
    { tabName: "In Review", count: "0", img_src: "inreview-tasks.svg" },
    { tabName: "Closed", count: "0", img_src: "completed-tasks.svg" },
  ];
  table_searchFields:any;

  constructor(
    private rest_api: RestApiService,
    private route: ActivatedRoute,
    private router: Router,
    private dataTransfer: DataTransferService,
    private spinner : LoaderService
  ) {
    this.route.queryParams.subscribe((data) => {
      this.project_id = data.id;
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getUsersList();
    this.getProjectDetails();
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
    this.rest_api.gettaskandComments(this.project_id).subscribe((data:any) => {
      this.all_tasks_list = data;
      console.log("tasks Data", data);
      this.all_tasks_list.map((item) => {
        item["timeStamp_converted"] = moment(item.lastModifiedTimestamp);
        item["endDate_converted"] = moment(item.endDate).format("lll");
        item["assignedTo"] = this.getUserName(item.resources);
        item["representative"] = { name: item.priority };
        return item;
      });
      this.all_tasks_list.sort(function (a, b) {
        return b.timeStamp_converted - a.timeStamp_converted;
      });
      this.tasks_list = this.all_tasks_list;
      this._tabsList.forEach((element) => {
        if (element.tabName == "All") {
          element.count = this.all_tasks_list.length;
        } else {
          element.count = this.all_tasks_list.filter(
            (item) => item.status == element.tabName
          ).length;
        }
      });
    });
    this.spinner.hide();
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
      },
    ];

    this.representatives = [
      { name: "High" },
      { name: "Medium" },
      { name: "Low" },
    ];
    this.table_searchFields=['taskName','taskCategory','priority','priority','assignedTo','endDate_converted']

  }
  
 async getProjectDetails(){
   await this.rest_api.getProjectDetailsById(this.project_id).subscribe( res=>{
      console.log(res)
      this.project_details = res
      this.projectName = this.project_details.projectName
    })
  }

  backToProjectDetails() {
    this.router.navigate(["/pages/projects/projectdetails"], {
      queryParams: { id: this.project_id },
    });
  }


  viewDetails(event) {
    console.log(event)
  }

  onTabChanged(event, tabView: TabView) {
    const tab = tabView.tabs[event.index].header;
    if (tab == "All") {
      this.tasks_list = this.all_tasks_list;
    } else {
      let filteredProjects = this.all_tasks_list.filter(
        (item) => item.status == tab
      );
      this.tasks_list = filteredProjects;
    }
  }

  deletetask(data) { // delete the task by selected id
    let deletetask = [{
      "id": data.id
    }];

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.rest_api.deleteTask(deletetask).subscribe(res => {
          let status: any = res;
          this.spinner.hide()
          Swal.fire({
            title: 'Success',
            text: "" + status.message,
            position: 'center',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#007bff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          })
          this.getTasksList();

        }, err => {
          this.spinner.hide()
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          })

        })
      }
    });
  }
}