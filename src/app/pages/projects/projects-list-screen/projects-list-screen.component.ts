import { Component, Inject, OnInit, ViewChild } from "@angular/core";

import { DataTransferService } from "../../services/data-transfer.service";
import { NgxSpinnerService } from "ngx-spinner";
import { RestApiService } from "../../services/rest-api.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { query } from "@angular/animations";
import moment from "moment";
import { APP_CONFIG } from "src/app/app.config";

@Component({
  selector: "app-projects-list-screen",
  templateUrl: "./projects-list-screen.component.html",
  styleUrls: ["./projects-list-screen.component.css"],
})
export class ProjectsListScreenComponent implements OnInit {
  projects_list: any = [];
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
  all_projectslist:any[]=[];
  columns_list:any=[];
  statuses: any[];
  representatives:any=[];

  _tabsList:any=[{tabName:"All","count":"0",img_src:"all-tasks.svg"},
  {tabName:"Pipeline","count":"0",img_src:"inprogress-tasks.svg"},
  {tabName:"New","count":"0", img_src:"inprogress-tasks.svg"},
  {tabName:"In Progress","count":"0", img_src:"inprogress-tasks.svg" },
  {tabName:"On Hold","count":"0", img_src:"inreview-tasks.svg"},
  {tabName:"Closed","count":"0", img_src:"completed-tasks.svg"}]

  constructor(
    private dt: DataTransferService,
    private api: RestApiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    @Inject(APP_CONFIG) private config
  ) {}

  ngOnInit() {
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
    this.name = localStorage.getItem("firstName") +" " + localStorage.getItem("lastName");
    this.email = localStorage.getItem("ProfileuserId");
    this.getallProjects(this.userRoles, this.name, this.email);
    this.getallusers();
    this.getallprocesses();
    this.freetrail = localStorage.getItem("freetrail");
  }

  getallProjects(roles, name, email) {
    this.spinner.show();
    this.api.getAllProjects(roles, name, email).subscribe((res) => {
      let response: any = res;
      this.projectsresponse = response;
      this.all_projectslist = [
        ...response[0].map((data) => {
          return {
            // id: data.id,
            // projectName: data.programName,
            // access: data.access,
            // initiatives: data.initiatives,
            // process: data.process,
            // type: data.type,
            // owner: data.owner,
            // priority: data.priority,
            // createdBy: data.createdBy,
            // status: data.status == null ? "New" : data.status,
            // // resources: data.resources,
            // mapValueChain: data.mapValueChain,
            // department:data.programValueChain,
            // measurableMetrics: data.measurableMetrics,
            // purpose: data.purpose,

            id: data.id,
            projectName: data.programName,
            initiatives: data.initiatives,
            priority: data.priority,
            process:  this.getProcessNames(data.process),
            owner: data.owner,
            status: data.status == null ? "New" : data.status,
            createdAt: moment(data.startDate).format("lll"),
            createdBy: data.createdBy,
            lastModifiedBy: data.lastModifiedBy,
            "representative":{
              "name":data.type,
           },
           type:data.type,
            department:data.programValueChain,
            createdDate:moment(data.createdTimestamp).format("lll"),
            updatedDate:moment(data.lastModifiedTimestamp).format("lll"),
            mapValueChain: data.mapValueChain,
          };
        }),
        ...response[1].map((data) => {
          return {
            // id: data.id,
            // projectName: data.projectName,
            // access: data.access,
            // initiatives: data.initiatives,
            // process: data.process,
            // type: data.type == null ? "Project" : data.type,
            // // owner: data.owner,
            // status: data.status == null ? "New" : data.status,
            // priority: data.priority,
            // createdBy: data.createdBy,
            // // resources: data.resources,
            // mapValueChain: data.mapValueChain,
            // department:data.mapValueChain,
            // measurableMetrics: data.measurableMetrics,
            // startDate: data.startDate,
            // endDate: data.endDate,

            id: data.id,
          projectName: data.projectName,
          initiatives: data.initiatives,
          priority: data.priority,
          process: this.getProcessNames(data.process),
          owner: data.owner,
          status: data.status == null ? "New" : data.status,
          createdAt: moment(data.startDate).format("lll"),
          createdBy: data.createdBy,
          lastModifiedBy: data.lastModifiedBy,
          "representative":{
            "name":data.type == null ? "Project" : data.type,
          },
          type:data.type == null ? "Project" : data.type,
          department:data.mapValueChain,
          createdDate:moment(data.createdTimestamp).format("lll"),
          updatedDate:moment(data.lastModifiedTimestamp).format("lll"),
            mapValueChain: data.mapValueChain,

          };
        }),
      ];
      this.spinner.hide();
      this.count.New = this.all_projectslist.filter(
        (item) => item.status == "New"
      ).length;
      this.count.Inprogress = this.all_projectslist.filter(
        (item) => item.status == "In Progress"
      ).length;
      this.count.Pipeline = this.all_projectslist.filter(
        (item) => item.status == "Pipeline"
      ).length;
      this.count.OnHold = this.all_projectslist.filter(
        (item) => item.status == "On Hold"
      ).length;
      this.count.Rejected = this.all_projectslist.filter(
        (item) => item.status == "Rejected"
      ).length;
      this.count.Inreview = this.all_projectslist.filter(
        (item) => item.status == "In Review"
      ).length;
      this.count.Approved = this.all_projectslist.filter(
        (item) => item.status == "Approved"
      ).length;
      this.count.Closed = this.all_projectslist.filter(
        (item) => item.status == "Closed"
      ).length;
      this.count.Deployed = this.all_projectslist.filter(
        (item) => item.status == "Deployed"
      ).length;
      this.projects_list = this.all_projectslist
      setTimeout(() => {
        this.selected_tab = 0;
      }, 100);

      this._tabsList.forEach(element => {
        if(element.tabName == "All"){
          element.count = this.all_projectslist.length
        }else{
        element.count = this.all_projectslist.filter(
          (item) => item.status == element.tabName
        ).length;
        }
      });
    });

    this.columns_list = [
      { ColumnName: "type", DisplayName: "Type", ShowGrid:true, ShowFilter:true,filterWidget:"multiSelect",filterType:"text", sort:true,multi:false},
      { ColumnName: "projectName", DisplayName: "Project Name", ShowFilter:true, ShowGrid:true,filterWidget:"normal",filterType:"text", sort:true, multi:true,multiOptions:["projectName","status"]},
      { ColumnName: "process", DisplayName: "Process", ShowGrid:true, ShowFilter:true, filterWidget:"normal",filterType:"text", sort:true,multi:false},
      { ColumnName: "department", DisplayName: "Department", ShowGrid:true, ShowFilter:true, filterWidget:"normal",filterType:"text", sort:true,multi:false},
      { ColumnName: "createdDate", DisplayName: "Created Date", ShowGrid:true, ShowFilter:true, filterWidget:"normal",filterType:"date", sort:true,multi:false},
      { ColumnName: "lastModifiedBy", DisplayName: "Last Updated By", ShowGrid:true, ShowFilter:true, filterWidget:"normal",filterType:"text", sort:true,multi:true,multiOptions:["lastModifiedBy","updatedDate"]},
      { ColumnName: "updatedDate", DisplayName: "Updated Date", ShowGrid:false,ShowFilter:false, sort:false,multi:false},
      { ColumnName: "status", DisplayName: "Status", ShowGrid:false,ShowFilter:false, sort:false,multi:false},
      { ColumnName: "action", DisplayName: "Action", ShowGrid:true,ShowFilter:false, sort:false,multi:false}
    ];

    this.representatives = [
      {name: "Project"},
      {name: "Program"}
    ];

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

  getProcessNames(processId){
    let processName:any;
    if(isNaN && this.processes!=undefined)
    {
      processName=this.processes.find(item=>item.processId==parseInt(processId));
    }
    return processName==undefined?processId:processName.processName;
  }

  onTabChanged(event){
    console.log(event)
    this.selected_tab = event.index
    if(event.tab.textLabel =='All'){
      this.projects_list = this.all_projectslist;
    }else{
    let filteredProjects = this.all_projectslist.filter(
      (item) => item.status == event.tab.textLabel
    );
    this.projects_list = filteredProjects;
    }
  }

  viewDetails(event) {
    if(event.type=="Program"){
      this.router.navigate(["/pages/projects/programdetails"], {
        queryParams: { id: event.id },
      });
    }else{
      this.router.navigate(["/pages/projects/projectdetails"], {
        queryParams: { id: event.id },
      });
    }
  }


  deleteById(project) {
    console.log("testing");
    
    var projectdata: any = project;
    let delete_data = [{
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
              this.projects_list = [];
              Swal.fire(
                "Success",
                "Project Deleted Successfully !!",
                "success"
              );
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
  
}
