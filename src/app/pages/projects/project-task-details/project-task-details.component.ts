import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Inplace } from "primeng/inplace";
import { LoaderService } from "src/app/services/loader/loader.service";
import { DataTransferService } from "../../services/data-transfer.service";
import { RestApiService } from "../../services/rest-api.service";

interface Status {
  name: string,
}
@Component({
  selector: "app-project-task-details",
  templateUrl: "./project-task-details.component.html",
  styleUrls: ["./project-task-details.component.css"],
})
export class ProjectTaskDetailsComponent implements OnInit {
  @ViewChild("inplace") inplace!: Inplace;
  @ViewChild("inplace1") inplace1!: Inplace;
  @ViewChild("inplace2") inplace2!: Inplace;
  @ViewChild("inplace3") inplace3!: Inplace;
  desc: any =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore neque cumque quo fugiat mollitia quas id earum perferendis ratione repudiandae magni odio nulla eveniet rerum accusamus error, ducimus provident. Est.";
  project_id: any;
  project_name:any;
  task_details: any = {};
  selected_task_details: any = {};
  users_list: any[] = [];
  taskcomments_list: any[] = [];
  taskhistory_list: any[] = [];
  date1: Date;
  status: Status[];
  attached_list:any=[];
  checkBoxselected:any[]=[];
  columns_list:any;
  selectedCity: Status;
  taskName:any;
  edit_task_field:any;
  edit_resource_field:any;
  edit_status_field:any;
  hiddenPopUp:boolean = false;
  isprojectCreateForm: boolean =false;


  constructor(
    private route: ActivatedRoute,
    private rest_api: RestApiService,
    private router: Router,
    private dataTransfer: DataTransferService,
    private spinner: LoaderService
  ) {
    this.status = [
    {name: 'New'},
    {name: 'In Progress'},
    {name: 'In Review'},
    {name: 'Done'},
];}

  ngOnInit(): void {
    let today = new Date();
    this.getallusers();
  }

  gettask() {
    this.route.queryParams.subscribe((data) => {
      let params: any = data;
      console.log(data);
      this.project_id = params.project_id;
      this.project_name = params.project_id;
      this.rest_api
        .gettaskandComments(this.project_id)
        .subscribe((response) => {
          let taskList: any = response;
          this.task_details = taskList.find((item) => item.id == data.task_id);
          // this.selected_task_details = taskList.find((item) => item.id == data.task_id);
          console.log(this.task_details);
          // this.taskcomments_list = this.task_details.comments;
          // this.taskhistory_list = this.task_details.history;
        });
      this.spinner.hide();
    });
  }

  backToTaskList() {
    console.log(this.project_id);
    // this.router.navigate(['/pages/projects/tasks'],{
    //   queryParams:{id: this.project_id}
    // })
  }

  getallusers() {
    this.spinner.show();
    this.dataTransfer.tenantBased_UsersList.subscribe((res) => {
      if (res) {
        this.users_list = res;
        this.gettask();
      }
    });
    // let user = this.users_list.find(
    //   (item) => item.userId.userId == this.selectedtask.resources
    // );
    // this.taskresourceemail = user.userId.userId;
    // this.getUserRole();
  }

  onDeactivate() {
    console.log(this.task_details);
    // this.ip.activate();
    this.inplace.deactivate();
    this.inplace1.deactivate();
    this.inplace2.deactivate();
    this.inplace3.deactivate();
  }

  inplaceActivateTaskName(){
    console.log("test")
    this.edit_task_field = this.task_details.taskName 
    // e.deactivate();
  }

  onUpdateTaskName(){
    this.task_details.taskName = this.edit_task_field
    this.inplace.deactivate();
  }

  inplaceActivateResource(){
    this.edit_resource_field = this.task_details.resources 

  }

  onUpdateResourceDetails(){
    this.task_details.resources = this.edit_resource_field
    this.inplace1.deactivate();
  }

  inplaceActivateStatus(){
    this.edit_status_field = this.task_details.status 

  }

  onUpdateStatusDetails(){
    this.task_details.status = this.edit_status_field
    this.inplace2.deactivate();
  }

  closeOverlay(event) {
    console.log(event)
    this.hiddenPopUp = event;
    this.isprojectCreateForm = false;
  }

  taskAttachments(){
    this.hiddenPopUp = true;
    this.isprojectCreateForm = false;
    this.columns_list = [
      {ColumnName: "fullName",DisplayName:"Document Name"},
      { ColumnName: "user_role",DisplayName:"Attached Date"},
      { ColumnName: "actions",DisplayName:"Actions"},
    ];
  }

  onClikCreateProject(){
    
  }
  deleteuserById(rowData){

  }
}
