import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { RestApiService } from "../../services/rest-api.service";
import { MessageService, ConfirmationService } from "primeng/api";
import { ToasterService } from "src/app/shared/service/toaster.service";
import { toastMessages } from "src/app/shared/model/toast_messages";

@Component({
  selector: "app-project-rpa-design",
  templateUrl: "./project-rpa-design.component.html",
  styleUrls: ["./project-rpa-design.component.css"],
})
export class ProjectRpaDesignComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("paginator") paginator: MatPaginator;

  displayedColumns: string[] = [
    "stepNo",
    "steps",
    "description",
    "configuration",
    "Action",
  ];
  dataSource: MatTableDataSource<any[]>;
  USER_DATA: any[] = [];
  public myDataArray: any;
  selectedId: any;
  projectId: any;
  programId: any;
  taskId: any;
  rpaDesignsLength: any;
  isAddEnable: boolean;

  constructor(
    private rest_api: RestApiService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    // private messageService: MessageService,
    private toastService: ToasterService,
    private confirmationService: ConfirmationService,
    private toastMessages: toastMessages
  ) {
    this.route.queryParams.subscribe((params) => {
      // id=2892&programId=2896
      this.projectId = params.projectId;
      this.taskId = params.taskId;
      this.programId = params.programId;
    });
  }

  ngOnInit(): void {
    this.getRPAdesignData();
  }

  getRPAdesignData() {
    this.spinner.show();
    let res_data: any;
    this.rest_api.getRPAdesignData(this.taskId).subscribe((res) => {
      res_data = res;
      this.isAddEnable = false;
      this.rpaDesignsLength = res_data.data.length;
      this.USER_DATA = res_data.data;
      this.dataSource = new MatTableDataSource(this.USER_DATA);
      this.spinner.hide();
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        // this.dataSource.sort=this.sort;
      }, 2000);
    });
  }

  addUser() {
    let newUser1 = {
      steps: "",
      description: "",
      configuration: "",
      id: 122,
      new: true,
    };
    this.USER_DATA.splice(0, 0, newUser1);
    this.dataSource = new MatTableDataSource(this.USER_DATA);
    this.selectedId = null;
    if (this.USER_DATA.length == this.rpaDesignsLength) {
      this.isAddEnable = false;
    } else {
      this.isAddEnable = true;
    }
  }

  cancelUpdaterow() {
    this.selectedId = null;
  }

  cancelCreateNewrow(i) {
    this.USER_DATA.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.USER_DATA);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 200);

    if (this.USER_DATA.length == this.rpaDesignsLength) {
      this.isAddEnable = false;
    } else {
      this.isAddEnable = true;
    }

    // this.myDataArray = [...this.USER_DATA];
  }

  onEdit(item) {
    this.USER_DATA.forEach((ele, index) => {
      if (ele.new) {
        this.USER_DATA.splice(index, 1);
        this.dataSource = new MatTableDataSource(this.USER_DATA);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 200);
        if (this.USER_DATA.length == this.rpaDesignsLength) {
          this.isAddEnable = false;
        } else {
          this.isAddEnable = true;
        }
      }
    });
    this.selectedId = item.id;
  }

  backToProjects() {
    this.router.navigate(["/pages/projects/projectdetails"], {
      queryParams: { project_id: this.projectId, programId: this.programId },
    });
  }

  saveConfiguration(element, i) {
    this.spinner.show();
    let req_body = {
      projectId: this.projectId,
      taskId: this.taskId,
      stepNo: i,
      steps: element.steps,
      description: element.description,
      configuration: element.configuration,
      createdBy:
        localStorage.getItem("firstName") +
        " " +
        localStorage.getItem("lastName"),
      createdUserId: localStorage.getItem("ProfileuserId"),
    };

    this.rest_api.saveRpaDesign([req_body]).subscribe(
      (res) => {
        this.spinner.hide();
        this.toastService.showSuccess('RpaDesign','create');
        this.getRPAdesignData();
      },
      (err) => {
        this.spinner.hide();
        this.toastService.showError(this.toastMessages.createError);
      }
    );
  }

  updateConfiguration(element) {
    this.spinner.show();
    let req_body = {
      id: element.id,
      steps: element.steps,
      description: element.description,
      configuration: element.configuration,
    };

    this.rest_api.updateRPADesignData(req_body).subscribe(
      (res) => {
        this.spinner.hide();
        this.toastService.showSuccess('RpaDesign','update');
        this.getRPAdesignData();
        this.selectedId = null;
      },
      (err) => {
        this.spinner.hide();
        this.toastService.showError(this.toastMessages.updateError);
      }
    );
  }

  deleteConfiguration(item) {
    let req_body = {
      id: item.id,
    };
    this.confirmationService.confirm({
      message: "You won't be able to revert this!",
      header: "Are you sure?",
      rejectLabel: "No",
      acceptLabel: "Yes",
      rejectButtonStyleClass: 'btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      accept: () => {
        this.spinner.show();
        this.rest_api.deleteRpaDesign(req_body).subscribe(
          (res) => {
            let status: any = res;
            this.spinner.hide();
            this.toastService.showSuccess('RpaDesign','delete');
            this.getRPAdesignData();
          },
          (err) => {
            this.spinner.hide();
            this.toastService.showError(this.toastMessages.deleteError);
          }
        );
      },
      reject: (type) => {}
    });
  }
}
