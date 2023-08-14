import { Component, OnInit } from "@angular/core";
import { RestApiService } from "src/app/pages/services/rest-api.service";
import moment from "moment";
import { ActivatedRoute, Router } from "@angular/router";
import { DataTransferService } from "src/app/pages/services/data-transfer.service";
import { TabView } from "primeng/tabview";
import { LoaderService } from "src/app/services/loader/loader.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { columnList } from "src/app/shared/model/table_columns";

@Component({
  selector: "app-project-task-list",
  templateUrl: "./project-task-list.component.html",
  styleUrls: ["./project-task-list.component.css"],
  providers:[columnList]
})
export class ProjectTaskListComponent implements OnInit {
  tasks_list: any[] = [];
  all_tasks_list: any[] = [];
  project_id: any;
  representatives: any[] = [];
  users_list: any = [];
  project_details: any;
  task_id: any;
  _tabsList: any = [
    { tabName: "All", count: "0", img_src: "ActiveTasks.svg" },
    { tabName: "New", count: "0", img_src: "NewStatus.svg" },
    { tabName: "In Progress", count: "0", img_src: "inprogress-tasks.svg" },
    { tabName: "In Review", count: "0", img_src: "inreview-tasks.svg" },
    { tabName: "Closed", count: "0", img_src: "completed-tasks.svg" },
  ];
  table_searchFields: any;
  hiddenPopUp: boolean = false;
  project_name: any;
  params_data:any;
  existingUsersList:any[]=[];
  columns_list:any[]=[];
  task_categoriesList:any[]=[];

  constructor(
    private rest_api: RestApiService,
    private route: ActivatedRoute,
    private router: Router,
    private dataTransfer: DataTransferService,
    private spinner: LoaderService,
    private confirmationService : ConfirmationService,
    private messageService : MessageService,
    private columnList: columnList
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
    this.columns_list = this.columnList.taskList_columns
  }

  getUsersList() {
    this.dataTransfer.tenantBased_UsersList.subscribe((res) => {
      if (res) {
        this.users_list = res;
        this.spinner.show();
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
    this.getTheExistingUsersList();
    this.getTaskCategoriesByProject();
    this.rest_api.gettaskandComments(this.project_id).subscribe((data: any) => {
      this.all_tasks_list = data;
      this.all_tasks_list.map((item) => {
        item["timeStamp_converted"] = moment(item.lastModifiedTimestamp);
        item["endDate_converted"] = new Date(item.endDate);
        item["assignedTo"] = this.getUserName(item.resources);
        // item["representative"] = { name: item.priority };
        return item;
      });
      this.all_tasks_list.sort(function (a, b) {
        return b.timeStamp_converted - a.timeStamp_converted;
      });
      this.spinner.hide();
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
      "endDate_converted",'status'
    ];
  }

  backToProjectDetails() {
    this.router.navigate(["/pages/projects/projectdetails"], {
      queryParams: { project_id: this.project_id },
    });
  }

  viewDetails(event) {
    this.router.navigate(["/pages/projects/taskDetails"], {
      queryParams: {
        project_id: this.project_id,
        project_name: this.project_name,
        task_id: event.id,
      },
    });
  }

  // onTabChanged(event, tabView: TabView) {
  //   const tab = tabView.tabs[event.index].header;
  //   if (tab == "All") {
  //     this.tasks_list = this.all_tasks_list;
  //   } else {
  //     let filteredProjects = this.all_tasks_list.filter(
  //       (item) => item.status == tab
  //     );
  //     this.tasks_list = filteredProjects;
  //   }
  // }

  deletetask(data) {
    // delete the task by selected id
    let deletetask = [
      {
        id: data.id,
      },
    ];

    this.confirmationService.confirm({
      message: "Do you want to delete this task? This can't be undo.",
      header: "Are you sure?",
      rejectLabel: "No",
      acceptLabel: "Yes",
      rejectButtonStyleClass: 'btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      key:'taskDelete',
      accept: () => {
        this.spinner.show();
        this.rest_api.deleteTask(deletetask).subscribe(
          (res) => {
            let status: any = res;
            this.spinner.hide();
            this.messageService.add({severity:'success', summary: 'Success', detail: status.message});
            this.getTasksList();
          },
          (err) => {
            this.spinner.hide();
            this.messageService.add({severity:'error', summary: 'Error', detail: "Failed to delete!"});
          }
        );
      },
      reject: (type) => {}
    });
  }

  onCreateTask() {
    this.hiddenPopUp = true;
  }

  closeOverlay(event) {
    this.hiddenPopUp = event;
  }

  openTaskWorkSpace(data) {
    localStorage.setItem("project_id", this.project_id);
    localStorage.setItem("projectName", this.project_name);
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

  getTheExistingUsersList(){
    this.rest_api.getusersListByProjectId(this.project_id).subscribe((res:any)=>{
      this.users_list.forEach(item2 => {
        if(res.find((projectResource:any) => item2.user_email==projectResource.userId)!=undefined)
        this.existingUsersList.push(item2);
      })
    })
  }

  ngOnDestroy(){
    this.spinner.hide();
  }

  getTaskCategoriesByProject(){
    this.rest_api.getTaskCategoriesByProject(this.project_id).subscribe((res:any)=>{
      this.task_categoriesList = res;
      let task_categories=[]
      this.task_categoriesList.forEach(item=>{
        task_categories.push(item.category)
      })
        this.columns_list.map(item => {
        if (item.ColumnName === "taskCategory") {
          item["dropdownList"] = task_categories
        }
      })

    })
   }

}
