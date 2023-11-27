import { Component, Inject, NgZone, OnInit, ViewChild } from "@angular/core";

import { DataTransferService } from "../../services/data-transfer.service";
import { RestApiService } from "../../services/rest-api.service";
import { Router } from "@angular/router";
import { query } from "@angular/animations";
import moment from "moment";
import { APP_CONFIG } from "src/app/app.config";
import { TabView } from "primeng/tabview";
import { LoaderService } from "src/app/services/loader/loader.service";
import { ConfirmationService, } from "primeng/api";
import { columnList } from "src/app/shared/model/table_columns";
import { ToasterService } from "src/app/shared/service/toaster.service";
import { toastMessages } from "src/app/shared/model/toast_messages";

@Component({
  selector: "app-projects-list-screen",
  templateUrl: "./projects-list-screen.component.html",
  styleUrls: ["./projects-list-screen.component.css"],
  providers:[columnList]
})
export class ProjectsListScreenComponent implements OnInit {
  projects_list: any[] = [];
  users_list: any = [];
  processes: any = [];
  public userRole: any = [];
  customUserRole: any;
  enablecreateproject: boolean = false;
  viewallprojects: boolean = false;
  public userRoles: any;
  public name: any;
  email: any;
  create_Tabs: any;
  projectsresponse: any = [];
  freetrail: string;
  all_projectslist: any[] = [];
  columns_list: any = [];
  statuses: any[];
  representatives: any = [];
  table_searchFields: any = [];
  hiddenPopUp: boolean = false;
  _tabsList: any = [
    { tabName: "All", count: "0", img_src: "Projects-tab.svg" },
    // { tabName: "Pipeline", count: "0", img_src: "inprogress-tasks.svg" },
    { tabName: "New", count: "0", img_src: "NewStatus.svg" },
    { tabName: "In Progress", count: "0", img_src: "inprogress-tasks.svg" },
    { tabName: "On Hold", count: "0", img_src: "onhold-status.svg" },
    { tabName: "Closed", count: "0", img_src: "completed-tasks.svg" },
  ];
  isprojectCreateForm: boolean = false;
  isprogramCreateForm: boolean = false;
  categoryList: any;
  categories_list: any[] = [];
  actionsitems = [
    {label: 'Create Project', command: () => {this.onClikCreateProject();}},
    // {label: 'Create Program', command: () => {this.onClikCreateProgram();}}
    {label: 'Create Program'}
  ];

  constructor(
    private dt: DataTransferService,
    private api: RestApiService,
    private spinner: LoaderService,
    private router: Router,
    @Inject(APP_CONFIG) private config,
    private confirmationService: ConfirmationService,
    private columnList: columnList,
    private toastService:ToasterService,
    private toastMessages: toastMessages

  ) {}

  ngOnInit() {
    this.spinner.show();
    localStorage.setItem("project_id", null);
    localStorage.setItem("bot_id", null);
    this.api.getCustomUserRole(2).subscribe((role) => {
      this.customUserRole = role;
      let element = [];
      for (let index = 0; index < this.customUserRole.message.length; index++) {
        element = this.customUserRole.message[index].permission;
        element.forEach((element1) => {
          if (element1.permissionName.includes("Project_Create")) {
            this.enablecreateproject = true;
          }
        });
      }
    });

    this.userRoles = localStorage.getItem("userRole");
    this.userRoles = this.userRoles.split(",");
    this.name =
      localStorage.getItem("firstName") +
      " " +
      localStorage.getItem("lastName");
    this.getallprocesses();
    this.email = localStorage.getItem("ProfileuserId");
    this.getAllCategories();
    this.getUsersList();
    this.freetrail = localStorage.getItem("freetrail");
    this.columns_list = this.columnList.projectList_columns
  }

  getallProjects(roles, name, email) {
    this.api.getAllProjects(roles, name, email).subscribe((res) => {
      let response: any = res;
      if(Array.isArray(res)){
      this.projectsresponse = response;
      // TODO- Enable to show programs
      // let res_list = response[0].concat(response[1]); 
      let res_list = response[1];
      this.spinner.hide();
      res_list.map((data) => {
        // data["projectName"] = data.programName? data.programName: data.projectName;
        // data["process_name"] = this.getProcessNames(data.process);
        data["status"] = data.status == null ? "New" : data.status;
        // data["createdAt"] = moment(data.createdTimestamp).format("lll");
        // data["representative"] = {
        //   name: data.type == null ? "Project" : data.type,
        // };
        data["type"] = data.type == null ? "Project" : data.type;
        data["department"] = data.mapValueChain? data.mapValueChain: data.programValueChain;
        data["createdDate"] = new Date(data.createdTimestamp);
        data["updatedDate"] = moment(data.lastModifiedTimestamp).format("MMM DD YYYY HH:mm");
        let email = data.lastModifiedByEmail? data.lastModifiedByEmail: data.owner
        data["lastModifiedBy"] = this.getUserName(email);
        data["lastModifiedByEmail"] = data.lastModifiedByEmail? data.lastModifiedByEmail: data.owner;
        return data;
      });

      this.projects_list = [];
      this.all_projectslist = res_list;
      this.all_projectslist.sort(function (a, b) {
        a = new Date(a.createdDate);
        b = new Date(b.createdDate);
        return a > b ? -1 : a < b ? 1 : 0;
      });
      this.projects_list = this.all_projectslist;
      this._tabsList.forEach((element) => {
        if (element.tabName == "All") {
          element.count = this.all_projectslist.length;
        } else {
          element.count = this.all_projectslist.filter(
            (item) => item.status == element.tabName
          ).length;
        }
      });
    }else{
      this.spinner.hide();
    }
    },err=>{
      this.spinner.hide();
    });

    this.table_searchFields = [
      "type",
      "projectName",
      "priority",
      "process_name",
      "department",
      "createdDate",
      "lastModifiedBy",
      "updatedDate",
      "status",
      "processName"
    ];
    this.representatives = [{ name: "Project" }, { name: "Program" }];
    this.statuses = [
      { name: "Project", value: "Project" },
      { name: "Program", value: "Program" },
    ];
  }

  getallprocesses() {
    this.api.getprocessnames().subscribe((processnames) => {
      let resp: any = [];
      resp = processnames;
      this.processes = resp.filter((item) => item.status == "APPROVED");
    });
  }

  createNew() {
    if (this.freetrail == "true") {
      if (this.projectsresponse[1].length == 0) {
        this.create_Tabs = "projects";
      } else if (
        this.projectsresponse[1].length == this.config.projectfreetraillimit
      ) {

        this.confirmationService.confirm({
          message: "You have limited access to this product. Please contact the EZFlow support team for more details.",
          header: "Info",
          acceptLabel:'Ok',
          rejectVisible: false,
          acceptButtonStyleClass: 'btn bluebg-button',
          defaultFocus: 'none',
          acceptIcon: 'null',
          accept: () => {},
        });

        return;
      } else if (this.projectsresponse[1].length >= 1) {
        this.create_Tabs = "projects";
      }
    } else {
      this.create_Tabs = "projects&programs";
    }
    this.router.navigate(["/pages/projects/create-projects"], {
      queryParams: { id: this.create_Tabs },
    });
  }

  getprojectsList(event) {
    this.projectsresponse = event;
  }

  getProcessNames(processId) {
    let processName: any;
    if (isNaN && this.processes != undefined) {
      processName = this.processes.find(
        (item) => item.processId == parseInt(processId)
      );
    }
    return processName == undefined ? processId : processName.processName;
  }

  onTabChanged(event, tabView: TabView) {
    const tab = tabView.tabs[event.index].header;
    if (tab == "All") {
      this.projects_list = this.all_projectslist;
    } else {
      let filteredProjects = this.all_projectslist.filter(
        (item) => item.status == tab
      );
      this.projects_list = filteredProjects;
    }
  }

  viewDetails(event) {
    if (event.type == "Program") {
      this.router.navigate(["/pages/projects/programdetails"], {
        queryParams: { id: event.id },
      });
    } else {
      this.router.navigate(["/pages/projects/projectdetails"], {
        queryParams: { project_id: event.id, project_name: event.projectName, process_name : event.processName },
      });
    }
  }

  deleteById(project) {
    let delete_data = [
      {
        id: project.id,
        type: project.type,
      },
    ];
    this.confirmationService.confirm({
      message: "Do you want to delete this project? This can't be undo.",
      header: "Are you sure?",
      acceptLabel: "Yes",
      rejectLabel: "No",
      rejectButtonStyleClass: 'btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      accept: () => {
        this.spinner.show();
        this.api.delete_Project(delete_data).subscribe((res) => {
          this.spinner.hide();
          let response: any = res;
          if (response.errorMessage == undefined && response.warningMessage == undefined) {
            this.toastService.showSuccess(project.projectName,'delete');
            this.getallProjects(this.userRoles, this.name, this.email);
          }
          if(response.warningMessage){
            this.toastService.showInfo(response.warningMessage+"!");
          }
        },err=>{
          this.toastService.showError(this.toastMessages.deleteError);
          this.spinner.hide();
        });
      },
      reject: (type) => {}
    });
  }

  tabViewChange(event, tabView: TabView) {
    const headerValue = tabView.tabs[event.index].header;
  }

  closeOverlay(event) {
    this.hiddenPopUp = event;
    this.isprojectCreateForm = false;
  }

  onCreateNew() {
    this.hiddenPopUp = true;
    this.isprojectCreateForm = false;
  }

  onClikCreateProject() {
    this.hiddenPopUp = true;
    this.isprojectCreateForm = true;
  }

  getUsersList() {
    this.dt.tenantBased_UsersList.subscribe((res) => {
      if (res) {
        this.users_list = res;
        this.getallProjects(this.userRoles, this.name, this.email);
      }
    });
  }

  getProjectName(event) {
    if (event) return event;
    else return "Project";
  }

  getAllCategories() {
    // get all categories list for dropdown
    this.api.getCategoriesList().subscribe((res) => {
      this.categoryList = res;

      let sortedList = this.categoryList.data.sort((a, b) =>
        a.categoryName.toLowerCase() > b.categoryName.toLowerCase()
          ? 1
          : b.categoryName.toLowerCase() > a.categoryName.toLowerCase()
          ? -1
          : 0
      );
      sortedList.forEach((element) => {
        this.categories_list.push(element.categoryName);
      });
      this.columns_list.map(item => {
        if (item.ColumnName === "department") {
          item["dropdownList"] = this.categories_list
        }
      })
    });
  }

  onClikCreateProgram() {
    // this.isprogramCreateForm =true;
    this.router.navigate(["/pages/projects/create-projects"], {
      queryParams: { id: this.create_Tabs },
    });
  }

  getUserName(emailId){
  let user = this.users_list.find(item => item.user_email == emailId);
  if(user)
    return user["fullName"]
    else
    return '-';
  }
}
