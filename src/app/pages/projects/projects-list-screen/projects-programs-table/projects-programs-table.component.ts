import {
  Component,
  OnInit,
  TemplateRef,
  Input,
  ViewChild,
  EventEmitter,
  Output,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { MatTableDataSource } from "@angular/material/table";
import { RestApiService } from "../../../services/rest-api.service";
import Swal from "sweetalert2";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { Base64 } from "js-base64";
import { Router } from "@angular/router";
import { ProjectsListScreenComponent } from "../projects-list-screen.component";
import moment from "moment";

@Component({
  selector: "app-projects-programs-table",
  templateUrl: "./projects-programs-table.component.html",
  styleUrls: ["./projects-programs-table.component.css"],
})
export class ProjectsProgramsTableComponent implements OnInit {
  public updateForm: FormGroup;
  displayedColumns1: string[] = [
    "id",
    "type",
    "initiatives",
    "process",
    "projectName",
    "owner",
    "priority",
    "status",
    "createdBy",
    "action",
  ];
  @ViewChild("paginator2") paginator2: MatPaginator;
  @ViewChild("sort2") sort2: MatSort;
  @Input("status") public status_data: any;
  @Input("projects_list") public projects_list: any = [];
  @Input("users_list") public users_list: any = [];
  @Input("processes") public processes: any = [];
  dataSource2: MatTableDataSource<any>;
  selected_process_names: any;
  project_id: any;
  updatemodalref: BsModalRef;
  projectdetailsbyid: any;
  projectresources: any = [];
  userslist: any;
  updateprogramForm: FormGroup;
  mindate: any;
  customUserRole: any;
  viewallprojects: boolean = false;
  public userRoles: any;
  public name: any;
  email: any;
  userName: string;
  initiatives: any;
  @Output() projectslistdata = new EventEmitter<any[]>();
  noDataMessage: boolean;

  constructor(
    private api: RestApiService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private router: Router,
    private modalService: BsModalService,
    private project_main: ProjectsListScreenComponent
  ) {
    this.updateForm = this.formBuilder.group({
      type: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      initiatives: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      process: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      projectName: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      owner: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      priority: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      access: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      resources: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      mapValueChain: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      measurableMetrics: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      status: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      endDate: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      startDate: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
    });

    this.updateprogramForm = this.formBuilder.group({
      type: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      initiatives: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      process: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      projectName: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      owner: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      priority: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      access: ["",Validators.compose([Validators.required, Validators.maxLength(50)]),],
      measurableMetrics: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      purpose: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      status: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
    });
  }

  ngOnInit() {
    this.api.getCustomUserRole(2).subscribe((role) => {
      this.customUserRole = role;
      let element = [];
      for (let index = 0; index < this.customUserRole.message.length; index++) {
        element = this.customUserRole.message[index].permission;
        element.forEach((element1) => {
          if (element1.permissionName == "View_All_Projects") {
            this.viewallprojects = true;
          }
        });
        if(this.dataSource2.filteredData.length==0) {
          this.noDataMessage=true;
        } else {
          this.noDataMessage=false;
        }
      }
    });
    this.userName =
      localStorage.getItem("firstName") +
      " " +
      localStorage.getItem("lastName");
    setTimeout(() => {
      this.getallProjects();
    }, 500);
    this.userRoles = localStorage.getItem("userRole");
    this.userRoles = this.userRoles.split(",");
    this.name =
      localStorage.getItem("firstName") +
      " " +
      localStorage.getItem("lastName");
    this.email = localStorage.getItem("ProfileuserId");

    this.mindate = moment().format("YYYY-MM-DD");
    this.getInitiatives();
  }

  programDetailsbyId(program) {
    this.router.navigate(["/pages/projects/programdetails"], {
      queryParams: { id: program.id },
    });
  }

  projectDetailsbyId(project) {
    this.router.navigate(["/pages/projects/projectdetails"], {
      queryParams: { id: project.id },
    });
  }

  getallProjects() {
    this.projects_list.sort((a, b) => (a.id > b.id ? -1 : 1));
    if (this.status_data == "New")
      this.projects_list = this.projects_list.filter(
        (item) => item.status == "New"
      );
    else if (this.status_data == "In Progress")
      this.projects_list = this.projects_list.filter(
        (item) => item.status == "In Progress"
      );
    else if (this.status_data == "In Review")
      this.projects_list = this.projects_list.filter(
        (item) => item.status == "In Review"
      );
    else if (this.status_data == "Pipeline")
      this.projects_list = this.projects_list.filter(
        (item) => item.status == "Pipeline"
      );
    else if (this.status_data == "Approved")
      this.projects_list = this.projects_list.filter(
        (item) => item.status == "Approved"
      );
    else if (this.status_data == "Rejected")
      this.projects_list = this.projects_list.filter(
        (item) => item.status == "Rejected"
      );
    else if (this.status_data == "Deployed")
      this.projects_list = this.projects_list.filter(
        (item) => item.status == "Deployed"
      );
    else if (this.status_data == "On Hold")
      this.projects_list = this.projects_list.filter(
        (item) => item.status == "On Hold"
      );
    else if (this.status_data == "Closed")
      this.projects_list = this.projects_list.filter(
        (item) => item.status == "Closed"
      );

    var projects_or_programs = this.projects_list.map((item: any) => {
      if (item.type == "Program")
        return {
          id: item.id,
          projectName: item.projectName,
          initiatives: item.initiatives,
          priority: item.priority,
          process: item.process,
          owner: item.owner,
          status: item.status,
          createdBy: item.createdBy,
          lastModifiedBy: item.lastModifiedBy,
          type: item.type,
        };
      else if (item.type == "Project")
        return {
          id: item.id,
          projectName: item.projectName,
          initiatives: item.initiatives,
          priority: item.priority,
          process: item.process,
          owner: item.owner,
          status: item.status,
          createdBy: item.createdBy,
          lastModifiedBy: item.lastModifiedBy,
          type: item.type,
        };
    });

    this.dataSource2 = new MatTableDataSource(projects_or_programs);

    this.dataSource2.paginator = this.paginator2;
    this.dataSource2.sort = this.sort2;
  }

  applyfilter(event) {
    let value1 = event.target.value.toLowerCase();
    this.dataSource2.filter = value1;
    this.dataSource2.sort = this.sort2;
    this.dataSource2.paginator = this.paginator2;
    this.dataSource2.filter;
    if(this.dataSource2.filteredData.length == 0){
      this.noDataMessage = true;
    }
    else{
      this.noDataMessage=false;
    }
  }
  deleteproject(project) {
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
            this.getallProjects();
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
              this.getallProjectsdata(this.userRoles, this.name, this.email);
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

  getallProjectsdata(roles, name, email) {
    this.spinner.show();
    this.api.getAllProjects(roles, name, email).subscribe((res) => {
      let response: any = res;
      this.projectslistdata.emit(response);
      this.projects_list = [];
      this.projects_list = [
        ...response[0].map((data) => {
          return {
            id: data.id,
            projectName: data.programName,
            access: data.access,
            initiatives: data.initiatives,
            process: data.process,
            type: "Program",
            owner: data.owner,
            priority: data.priority,
            createdBy: data.createdBy,
            status: data.status == null ? "New" : data.status,
            resources: data.resources,
            mapValueChain: data.mapValueChain,
            measurableMetrics: data.measurableMetrics,
            purpose: data.purpose,
          };
        }),
        ...response[1].map((data) => {
          return {
            id: data.id,
            projectName: data.projectName,
            access: data.access,
            initiatives: data.initiatives,
            process: data.process,
            type: "Project",
            owner: data.owner,
            priority: data.priority,
            createdBy: data.createdBy,
            status: data.status == null ? "New" : data.status,
            resources: data.resources,
            mapValueChain: data.mapValueChain,
            measurableMetrics: data.measurableMetrics,
            startDate: data.startDate,
            endDate: data.endDate,
          };
        }),
      ];

      this.project_main.projects_list = this.projects_list;
      this.project_main.count.New = this.projects_list.filter(
        (item) => item.status == "New"
      ).length;
      this.project_main.count.Inprogress = this.projects_list.filter(
        (item) => item.status == "In Progress"
      ).length;
      this.project_main.count.Rejected = this.projects_list.filter(
        (item) => item.status == "Rejected"
      ).length;
      this.project_main.count.Approved = this.projects_list.filter(
        (item) => item.status == "Approved"
      ).length;
      this.project_main.count.Inreview = this.projects_list.filter(
        (item) => item.status == "In Review"
      ).length;
      this.project_main.count.Deployed = this.projects_list.filter(
        (item) => item.status == "Deployed"
      ).length;
      this.project_main.count.Closed = this.projects_list.filter(
        (item) => item.status == "Closed"
      ).length;

      this.spinner.hide();
      this.getallProjects();
    });

    //document.getElementById("filters").style.display='block';
  }

  updatedata(updatemodal, project) {
    if (project.type == "Project") {
      let data: any = this.projects_list.find((item) => item.id == project.id);
      this.project_id = data.id;
      if (data.id != undefined) {
        this.updateForm.get("type").setValue(data["type"]);
        this.updateForm.get("initiatives").setValue(data["initiatives"]);
        this.updateForm.get("process").setValue(data["process"]);
        this.updateForm.get("projectName").setValue(data["projectName"]);
        this.updateForm.get("owner").setValue(parseInt(data["owner"]));
        this.updateForm.get("access").setValue(data["access"]);
        this.updateForm.get("priority").setValue(data["priority"]);
        this.updateForm.get("resources").setValue(data["resources"]);
        this.updateForm.get("mapValueChain").setValue(data["mapValueChain"]);
        this.updateForm.get("status").setValue(data["status"]);
        this.updateForm
          .get("measurableMetrics")
          .setValue(data["measurableMetrics"]);
        this.updateForm
          .get("endDate")
          .setValue(moment(data["endDate"]).format("YYYY-MM-DD"));
        this.updateForm
          .get("startDate")
          .setValue(moment(data["startDate"]).format("YYYY-MM-DD"));
        this.updatemodalref = this.modalService.show(updatemodal, {
          class: "modal-lg",
        });
      }
    } else if (project.type == "Program") {
      let data: any = this.projects_list.find((item) => item.id == project.id);
      this.project_id = data.id;
      if (data.id != undefined) {
        this.updateprogramForm.get("type").setValue(data["type"]);
        this.updateprogramForm.get("initiatives").setValue(data["initiatives"]);
        this.updateprogramForm.get("process").setValue(data["process"]);
        this.updateprogramForm.get("projectName").setValue(data["projectName"]);
        this.updateprogramForm.get("owner").setValue(data["owner"]);
        this.updateprogramForm.get("access").setValue(data["access"]);
        this.updateprogramForm.get("priority").setValue(data["priority"]);
        this.updateprogramForm
          .get("measurableMetrics")
          .setValue(data["measurableMetrics"]);
        this.updateprogramForm.get("purpose").setValue(data["purpose"]);
        this.updateprogramForm.get("status").setValue(data["status"]);
        this.updatemodalref = this.modalService.show(updatemodal, {
          class: "modal-lg",
        });
      }
    }
  }

  projectupdate() {
    if (this.updateForm.valid) {
      this.spinner.show();
      this.updatemodalref.hide();
      let credupdatFormValue = this.updateForm.value;
      credupdatFormValue["id"] = this.project_id;
      this.api.update_project(credupdatFormValue).subscribe(
        (res) => {
          let status: any = res;
          if (status.errorMessage == undefined) {
            Swal.fire("Success", "Project Updated Successfully !!", "success");
            this.getallProjectsdata(this.userRoles, this.name, this.email);
            this.spinner.hide();
          } else {
            Swal.fire("Error", status.errorMessage, "error");
          }
        },
        (err) => {
          Swal.fire("Error", "Something Went Wrong", "error");
        }
      );
    } else {
      alert("please fill all details");
    }
  }

  programupdate() {
    if (this.updateprogramForm.valid) {
      this.spinner.show();
      this.updatemodalref.hide();
      let credupdatFormValue = this.updateprogramForm.value;
      credupdatFormValue["id"] = this.project_id;
      this.api.update_project(credupdatFormValue).subscribe(
        (res) => {
          let status: any = res;
          if (status.errorMessage == undefined) {
            //this.projects_list=[];
            Swal.fire("Success", "Project Updated Successfully !!", "success");
            this.getallProjectsdata(this.userRoles, this.name, this.email);
            this.spinner.hide();
          } else {
            Swal.fire("Error", status.errorMessage, "error");
          }
        },
        (err) => {
          Swal.fire("Error", "Something Went Wrong", "error");
        }
      );
    } else {
      alert("please fill all details");
    }
  }

  getprocessnames() {
    this.api.getprocessnames().subscribe((processnames) => {
      let resp: any = [];
      resp = processnames;
      this.selected_process_names = resp.filter(
        (item) => item.status == "APPROVED"
      );
    });
  }

  resetupdateproject() {
    this.updateForm.reset();
    this.updateForm.get("owner").setValue("");
    this.updateForm.get("resources").setValue("");
    this.updateForm.get("mapValueChain").setValue("");
    this.updateForm.get("type").setValue("");
    this.updateForm.get("initiatives").setValue("");
    this.updateForm.get("process").setValue("");
    this.updateForm.get("access").setValue("");
    this.updateForm.get("status").setValue("");
    this.updateForm.get("priority").setValue("");
  }

  resetupdateprogram() {
    this.updateprogramForm.reset();
    this.updateprogramForm.get("owner").setValue("");
    this.updateprogramForm.get("access").setValue("");
    this.updateprogramForm.get("priority").setValue("");
    this.updateprogramForm.get("measurableMetrics").setValue("");
    this.updateprogramForm.get("type").setValue("");
    this.updateprogramForm.get("initiatives").setValue("");
    this.updateprogramForm.get("process").setValue("");
    this.updateprogramForm.get("status").setValue("");
  }
  getreducedValue(value) {
    if (value != undefined) {
      if (value.length > 15) return value.substring(0, 16) + "...";
      else return value;
    }
  }
  getInitiatives() {
    this.api.getProjectIntitiatives().subscribe((res) => {
      let response: any = res;
      this.initiatives = response;
    });
  }
}
