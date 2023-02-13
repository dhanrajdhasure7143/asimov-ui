import { Component, Inject, NgZone, OnInit, ViewChild } from "@angular/core";

import { DataTransferService } from "../../services/data-transfer.service";
import { RestApiService } from "../../services/rest-api.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { query } from "@angular/animations";
import moment from "moment";
import { APP_CONFIG } from "src/app/app.config";
import { TabView } from "primeng/tabview";
import { LoaderService } from "src/app/services/loader/loader.service";

@Component({
  selector: "app-projects-list-screen",
  templateUrl: "./projects-list-screen.component.html",
  styleUrls: ["./projects-list-screen.component.css"],
})
export class ProjectsListScreenComponent implements OnInit {
  projects_list: any[] = [];
  users_list: any = [];
  processes: any = [];
  selected_tab: any;
  search: any = "";
  count: any = {
    New: 0,
    Inprogress: 0,
    OnHold: 0,
    Pipeline: 0,
    Rejected: 0,
    Inreview: 0,
    Approved: 0,
    Closed: 0,
    Deployed: 0,
  };

  public isButtonVisible = false;
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
  table_searchFields:any=[]
  hiddenPopUp:boolean = false;
  _tabsList: any = [
    { tabName: "All", count: "0", img_src: "all-tasks.svg" },
    { tabName: "Pipeline", count: "0", img_src: "inprogress-tasks.svg" },
    { tabName: "New", count: "0", img_src: "inprogress-tasks.svg" },
    { tabName: "In Progress", count: "0", img_src: "inprogress-tasks.svg" },
    { tabName: "On Hold", count: "0", img_src: "inreview-tasks.svg" },
    { tabName: "Closed", count: "0", img_src: "completed-tasks.svg" },
  ];
  isprojectCreateForm: boolean =false;


  constructor(
    private dt: DataTransferService,
    private api: RestApiService,
    private spinner: LoaderService,
    private router: Router,
    @Inject(APP_CONFIG) private config,
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
    this.getallProjects(this.userRoles, this.name, this.email);
    // this.getallusers();
    this.getUsersList()
    this.freetrail = localStorage.getItem("freetrail");
  }

  getallProjects(roles, name, email) {
    this.api.getAllProjects(roles, name, email).subscribe((res) => {
      let response: any = res;
      this.projectsresponse = response;
      let res_list = response[0].concat(response[1])
      // console.log(res_list)
      res_list.map(data=>{
        data["projectName"] = data.programName? data.programName: data.projectName
        data["process_name"] = this.getProcessNames(data.process)
        data["status"] = data.status == null ? "New" : data.status
        data["createdAt"] = moment(data.createdTimestamp).format("lll")
        data["representative"]= {name: data.type == null ? "Project" : data.type}
        data["type"] = data.type == null ? "Project" : data.type
        data["department"]= data.mapValueChain?data.mapValueChain: data.programValueChain
        data["createdDate"] = moment(data.createdTimestamp).format("lll")
        data["updatedDate"] = moment(data.lastModifiedTimestamp).format("lll")
        data["lastModifiedBy"] = data.lastModifiedBy?data.lastModifiedBy : data.createdBy
        return data
      })
      this.projects_list = [];
        this.all_projectslist = res_list
        // console.log(this.all_projectslist)
      // this.all_projectslist = [
      //   ...response[0].map((data) => {
      //     return {
      //       id: data.id,
      //       projectName: data.programName,
      //       initiatives: data.initiatives,
      //       priority: data.priority,
      //       process: this.getProcessNames(data.process),
      //       owner: data.owner,
      //       status: data.status == null ? "New" : data.status,
      //       createdAt: moment(data.createdTimestamp).format("lll"),
      //       createdBy: data.createdBy,
      //       lastModifiedBy: data.lastModifiedBy,
      //       representative: {
      //         name: data.type,
      //       },
      //       type: data.type,
      //       department: data.programValueChain,
      //       createdDate: moment(data.createdTimestamp).format("lll"),
      //       updatedDate: moment(data.lastModifiedTimestamp).format("lll"),
      //       mapValueChain: data.mapValueChain,
      //     };
      //   }),
      //   ...response[1].map((data) => {
      //     return {
      //       id: data.id,
      //       projectName: data.projectName,
      //       initiatives: data.initiatives,
      //       priority: data.priority,
      //       process: this.getProcessNames(data.process),
      //       owner: data.owner,
      //       status: data.status == null ? "New" : data.status,
      //       createdAt:data.createdTimestamp,
      //       createdBy: data.createdBy,
      //       lastModifiedBy: data.lastModifiedBy?data.lastModifiedBy : data.createdBy,
      //       representative: {
      //         name: data.type == null ? "Project" : data.type,
      //       },
      //       type: data.type == null ? "Project" : data.type,
      //       department: data.mapValueChain,
      //       createdDate: moment(data.createdTimestamp).format("lll"),
      //       updatedDate: moment(data.lastModifiedTimestamp).format("lll"),
      //       mapValueChain: data.mapValueChain,
      //     };
      //   }),
      // ];
      this.spinner.hide();
      // this.count.New = this.all_projectslist.filter(
      //   (item) => item.status == "New"
      // ).length;
      // this.count.Inprogress = this.all_projectslist.filter(
      //   (item) => item.status == "In Progress"
      // ).length;
      // this.count.Pipeline = this.all_projectslist.filter(
      //   (item) => item.status == "Pipeline"
      // ).length;
      // this.count.OnHold = this.all_projectslist.filter(
      //   (item) => item.status == "On Hold"
      // ).length;
      // this.count.Rejected = this.all_projectslist.filter(
      //   (item) => item.status == "Rejected"
      // ).length;
      // this.count.Inreview = this.all_projectslist.filter(
      //   (item) => item.status == "In Review"
      // ).length;
      // this.count.Approved = this.all_projectslist.filter(
      //   (item) => item.status == "Approved"
      // ).length;
      // this.count.Closed = this.all_projectslist.filter(
      //   (item) => item.status == "Closed"
      // ).length;
      // this.count.Deployed = this.all_projectslist.filter(
      //   (item) => item.status == "Deployed"
      // ).length;

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
    });


    this.columns_list = [
      {
        ColumnName: "type",
        DisplayName: "Type",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "multiSelect",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "projectName",
        DisplayName: "Project Name",
        ShowFilter: true,
        ShowGrid: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: true,
        multiOptions: ["projectName", "priority"],
      },
      {
        ColumnName: "process_name",
        DisplayName: "Process",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "department",
        DisplayName: "Department",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "createdDate",
        DisplayName: "Created Date",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "date",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "lastModifiedBy",
        DisplayName: "Last Updated By",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: true,
        multiOptions: ["lastModifiedBy", "updatedDate"],
      },
      // {
      //   ColumnName: "updatedDate",
      //   DisplayName: "Updated Date",
      //   ShowGrid: false,
      //   ShowFilter: false,
      //   sort: false,
      //   multi: false,
      // },
      // {
      //   ColumnName: "priority",
      //   DisplayName: "Priority",
      //   ShowGrid: false,
      //   ShowFilter: false,
      //   sort: false,
      //   multi: false,
      // },
      {
        ColumnName: "action",
        DisplayName: "Action",
        ShowGrid: true,
        ShowFilter: false,
        sort: false,
        multi: false,
      },
    ];

    this.table_searchFields=['type','projectName','priority','process_name','department','createdDate','lastModifiedBy','updatedDate']
    this.representatives = [{ name: "Project" }, { name: "Program" }];
    this.statuses = [
      { name: "Project", value: "Project" },
      { name: "Program", value: "Program" },
    ];
    //document.getElementById("filters").style.display='block';
  }

  getallusers() {
    let tenantid = localStorage.getItem("tenantName");
    this.api.getuserslist(tenantid).subscribe((item) => {
      let users: any = item;
      this.users_list = users;
    });
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
        Swal.fire({
          title: "Error",
          text: "You have limited access to this product. Please contact EZFlow support team for more details.",
          position: "center",
          icon: "error",
          showCancelButton: false,
          confirmButtonColor: "#007bff",
          cancelButtonColor: "#d33",
          heightAuto: false,
          confirmButtonText: "Ok",
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
        queryParams: { project_id: event.id },
      });
    }
  }

  deleteById(project) {
    var projectdata: any = project;
    let delete_data = [
      {
        id: project.id,
        type: project.type,
      },
    ];
    Swal.fire({
      title: "Enter " + projectdata.type + " Name",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      let value: any = result.value;
      if (value != undefined)
        if (projectdata.projectName.trim() == value.trim()) {
          this.spinner.show();
          this.api.delete_Project(delete_data).subscribe((res) => {
            this.spinner.hide();
            // this.getallProjects();
            let response: any = res;
            if (
              response.errorMessage == undefined &&
              response.warningMessage == undefined
            ) {
              Swal.fire(
                "Success",
                "Project Deleted Successfully !!",
                "success"
              );
              this.getallProjects(this.userRoles, this.name, this.email);
            } else if (
              response.errorMessage == undefined &&
              response.message == undefined
            ) {
              Swal.fire("Error", response.warningMessage, "error");
            } else {
              Swal.fire("Error", response.errorMessage, "error");
            }
          });
        } else {
          Swal.fire(
            "Error",
            "Entered " + projectdata.type + " Name is Invalid",
            "error"
          );
        }
    });
  }

  getreducedValue(value) {
    if (value != undefined) {
      if (value.length > 15) return value.substring(0, 16) + "...";
      else return value;
    }
  }

  tabViewChange(event, tabView: TabView) {
    const headerValue = tabView.tabs[event.index].header;
    console.log(headerValue)
   }

  closeOverlay(event) {
    console.log(event)
    this.hiddenPopUp = event;
    this.isprojectCreateForm = false;
  }

  onCreateNew(){
    this.hiddenPopUp = true;
    this.isprojectCreateForm = false;
  }

  onClikCreateProject(){
    this.isprojectCreateForm =true;
  }

  getUsersList() {
    this.dt.tenantBased_UsersList.subscribe((res) => {
      if (res) {
        this.users_list = res;
      }
    });
  }

  getProjectName(event){
    if(event) return event
    else return "Project"
  }

}
