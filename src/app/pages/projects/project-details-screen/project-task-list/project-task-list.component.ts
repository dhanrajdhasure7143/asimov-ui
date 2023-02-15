import { Component, OnInit } from "@angular/core";
import { RestApiService } from "src/app/pages/services/rest-api.service";
import moment from "moment";
import { ActivatedRoute, Router } from "@angular/router";
import { DataTransferService } from "src/app/pages/services/data-transfer.service";
import { TabView } from "primeng/tabview";
import { LoaderService } from "src/app/services/loader/loader.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-project-task-list",
  templateUrl: "./project-task-list.component.html",
  styleUrls: ["./project-task-list.component.css"],
})
export class ProjectTaskListComponent implements OnInit {
  tasks_list: any[] = [];
  all_tasks_list: any[] = [];
  project_id: any;
  columns_list: any[] = [];
  representatives: any[] = [];
  users_list: any = [];
  project_details: any;
  task_id: any;
  _tabsList: any = [
    { tabName: "All", count: "0", img_src: "all-tasks.svg" },
    { tabName: "New", count: "0", img_src: "inprogress-tasks.svg" },
    { tabName: "In Progress", count: "0", img_src: "inprogress-tasks.svg" },
    { tabName: "In Review", count: "0", img_src: "inreview-tasks.svg" },
    { tabName: "Closed", count: "0", img_src: "completed-tasks.svg" },
  ];
  table_searchFields: any;
  hiddenPopUp: boolean = false;
  project_name: any;
  params_data:any;

  constructor(
    private rest_api: RestApiService,
    private route: ActivatedRoute,
    private router: Router,
    private dataTransfer: DataTransferService,
    private spinner: LoaderService
  ) {
    this.route.queryParams.subscribe((data) => {
      this.params_data = data
      this.project_id = data.project_id;
      this.project_name = data.project_name;
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getUsersList();
  }

  getUsersList() {
    this.dataTransfer.tenantBased_UsersList.subscribe((res) => {
      if (res) {
        this.users_list = res;
        this.getTasksList();
      }
    });
  }

  getUserName(event) {
    var userName;
    this.users_list.forEach((element) => {
      if (element.user_email == event) {
        userName = element.firstName + " " + element.lastName;
      }
    });
    return userName;
  }

  getTasksList() {
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
        DisplayName: "",
        ShowGrid: true,
        ShowFilter: false,
        sort: false,
        multi: false,
      },
    ];
    this.rest_api.gettaskandComments(this.project_id).subscribe((data: any) => {
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

    this.representatives = [
      { name: "High" },
      { name: "Medium" },
      { name: "Low" },
    ];
    this.table_searchFields = [
      "taskName",
      "taskCategory",
      "priority",
      "priority",
      "assignedTo",
      "endDate_converted",
    ];
  }

  backToProjectDetails() {
    this.router.navigate(["/pages/projects/projectdetails"], {
      queryParams: { project_id: this.project_id },
    });
  }

  viewDetails(event) {
    console.log(event);
    this.router.navigate(["/pages/projects/taskDetails"], {
      queryParams: {
        project_id: this.project_id,
        project_name: this.project_name,
        task_id: event.id,
      },
    });
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

  deletetask(data) {
    // delete the task by selected id
    let deletetask = [
      {
        id: data.id,
      },
    ];

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.rest_api.deleteTask(deletetask).subscribe(
          (res) => {
            let status: any = res;
            this.spinner.hide();
            Swal.fire({
              title: "Success",
              text: "" + status.message,
              position: "center",
              icon: "success",
              showCancelButton: false,
              confirmButtonColor: "#007bff",
              cancelButtonColor: "#d33",
              confirmButtonText: "Ok",
            });
            this.getTasksList();
          },
          (err) => {
            this.spinner.hide();
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          }
        );
      }
    });
  }

  onCreateTask() {
    this.hiddenPopUp = true;
  }

  closeOverlay(event) {
    this.hiddenPopUp = event;
  }

  openTaskWorkSpace(data) {
    localStorage.setItem("project_id", this.project_id.id);
    if (data.taskCategory == "RPA Implementation") {
      this.router.navigate(["/pages/rpautomation/designer"], {
        queryParams: {
          botId: data.correlationID,
          projectId: this.project_id,
          projectName:this.project_name
        },
      });
    }
    if (
      data.taskCategory == "BPMN Design" ||
      data.taskCategory == "As-Is Process" ||
      data.taskCategory == "To-Be Process"
    ) {
      this.router.navigate(["pages/businessProcess/uploadProcessModel"], {
        queryParams: {
          bpsId: data.correlationID.split(":")[0],
          ver: data.correlationID.split(":")[1],
          ntype: "bpmn",
          projectId:this.project_id,
          projectName:this.project_name
        },
      });
    }
    if (data.taskCategory == "RPA Design") {
      this.router.navigate(['pages/projects/repdesign'],{ queryParams: {projectId: data.projectId,taskId:data.id}})
    }

    if (data.taskCategory == "Process Mining") {
      this.router.navigate(["pages/processIntelligence/flowChart"], {
        queryParams: { wpiId: data.correlationID },
      });
    }
  }
}
