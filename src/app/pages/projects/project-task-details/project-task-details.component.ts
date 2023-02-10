import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Inplace } from "primeng/inplace";
import { LoaderService } from "src/app/services/loader/loader.service";
import { DataTransferService } from "../../services/data-transfer.service";
import { RestApiService } from "../../services/rest-api.service";
import Swal from "sweetalert2";
import * as moment from "moment";

interface Status {
  name: string;
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
  @ViewChild("inplace4") inplace4!: Inplace;
  @ViewChild("inplace5") inplace5!: Inplace;
  @ViewChild("inplace6") inplace6!: Inplace;
  task_desc: any;
  project_id: any;
  project_name: any;
  task_details: any = {};
  selected_task_details: any = {};
  users_list: any[] = [];
  taskcomments_list: any[] = [];
  taskhistory_list: any[] = [];
  date1: Date;
  status_list: Status[];
  attached_list: any = [];
  checkBoxselected: any[] = [];
  columns_list: any;
  selectedCity: Status;
  taskName: any;
  edit_task_field: any;
  resources: any;
  status: any;
  hiddenPopUp: boolean = false;
  isprojectCreateForm: boolean = false;
  params_data: any;
  endDate: any;
  mindate: any;
  add_comment: any;
  added_comments_list: any = [];
  percentageComplete: any;
  priority:any;
  isFile_upload_dialog:boolean = false;
  selected_folder:any;
  folder_files:any;
  files:any;

  constructor(
    private route: ActivatedRoute,
    private rest_api: RestApiService,
    private router: Router,
    private dataTransfer: DataTransferService,
    private spinner: LoaderService
  ) {
    this.status_list = [
      { name: "New" },
      { name: "In Progress" },
      { name: "In Review" },
      { name: "Done" },
    ];
  }

  ngOnInit(): void {
    let today = new Date();
    this.getallusers();
  }

  gettask() {
    this.route.queryParams.subscribe((data) => {
      this.params_data = data;
      this.project_id = this.params_data.project_id;
      this.project_name = this.params_data.project_name;
      this.rest_api
        .getProjectTaskDetailsById(this.project_id, this.params_data.task_id)
        .subscribe((response) => {
          console.log("testing", response);
          let taskList: any = response;
          this.task_details = taskList[0];
          // this.task_details = taskList.find((item) => item.id == data.task_id);
          // this.selected_task_details = taskList.find((item) => item.id == data.task_id);
          console.log("taskDetails", this.task_details);
          this.taskcomments_list = this.task_details.comments;
          this.taskhistory_list = this.task_details.history;
          this.added_comments_list = [];
          // this.added_comments_list = this.task_details.history;
          this.task_desc = this.task_details.description;

          // this.due_date = moment(this.task_details.endDate).format("YYYY-MM-DD");
          this.mindate = moment(this.task_details.startDate).format(
            "YYYY-MM-DD"
          );
        });
      this.spinner.hide();
    });
  }

  backToTaskList() {
    console.log(this.project_id);
    // this.router.navigate(['/pages/projects/tasks'],{
    //   queryParams:{id: this.project_id}
    // })
    this.router.navigate(["/pages/projects/tasks"], {
      queryParams: {
        project_id: this.project_id,
        project_name: this.project_name,
      },
    });
  }

  getallusers() {
    this.spinner.show();
    this.dataTransfer.tenantBased_UsersList.subscribe((res) => {
      if (res) {
        this.users_list = res;
        this.spinner.show();
        this.gettask();
        this.getTaskAttachments();
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
    this.inplace4.deactivate();
    this.inplace5.deactivate();
    this.inplace6.deactivate();
  }

  inplaceActivate(field) {
    if (field == "endDate") {
      this.endDate = moment(this.task_details.endDate).format("YYYY-MM-DD");
      return;
    }
    this[field] = this.task_details[field];
    console.log(this.resources);
    // e.deactivate();
  }

  onUpdateDetails(field) {
    if (field == "percentageComplete") {
      if (this.percentageComplete > 100) {
        this.percentageComplete = 100;
      } else {
        this.task_details[field] = String(this[field]);
        this.updatetask();
        this.onDeactivate();
        console.log();
      }
    } else {
      this.task_details[field] = this[field];
      this.updatetask();
      this.onDeactivate();
    }
  }

  inplaceActivateDesc() {
    this.task_desc = this.task_details.description;
  }

  onUpdateDesc() {
    this.task_details.description = this.task_desc.toString();
    this.updatetask();
    this.inplace3.deactivate();
  }

  closeOverlay(event) {
    console.log(event);
    this.hiddenPopUp = event;
    this.isprojectCreateForm = false;
  }

  taskAttachments() {
    this.hiddenPopUp = true;
    this.isprojectCreateForm = false;
    this.columns_list = [
      { ColumnName: "fullName", DisplayName: "Document Name" },
      { ColumnName: "user_role", DisplayName: "Attached Date" },
      // { ColumnName: "actions",DisplayName:"Actions"},
    ];
  }

  onClikCreateProject() {}

  deleteuserById(rowData) {}

  postcomments() {
    if (this.add_comment != "") {
      this.added_comments_list = [];
      // this.added_comments_list = this.task_details.history;
      let idnumber = this.taskcomments_list.length + 1;
      this.added_comments_list.push({
        id: idnumber,
        comments: this.add_comment,
        // createdTimestamp: new Date().getTime(),
        createdBy:
          localStorage.getItem("firstName") +
          " " +
          localStorage.getItem("lastName"),
        createdUserEmail: localStorage.getItem("ProfileuserId"),
      });
      this.updatetask();
    }
  }

  async getTaskAttachments() {
    await this.rest_api
      .getTaskAttachments(this.params_data.project_id, this.params_data.task_id)
      .subscribe((data) => {
        // this.taskattacments = data;
        // if (this.taskattacments.length == 0) {
        //   this.hidetaskdeletedownload = false;
        // } else {
        //   this.hidetaskdeletedownload = true;
        // }
      });
  }
  descChanges(str) {
    //   var parser = new DOMParser();
    // var doc = parser.parseFromString(str, 'text/html');
    // console.log(doc)
    // console.log(doc.body)
    // return doc.body;

    let spanEl: HTMLElement = document.createElement("div");
    spanEl.innerText = str;
    return spanEl.outerHTML;

    var dom = document.createElement("div");
    dom.innerHTML = str;
    return dom;

    //   var dom = document.createElement('div');
    // dom.innerHTML = str;
    // return dom;
    //     var wrapper= document.createElement('div');
    // wrapper.innerHTML= str;
    // var div= wrapper.firstChild;
    // return div

    // var doc = new DOMParser().parseFromString(str, "text/xml")
    // return doc

    // var dom = document.createElement('div');
    // dom.innerHTML = str;
    // return dom;
  }
  updatetask() {
    // if (this.updatetaskForm.valid) {
    // this.task_details

    // let taskupdatFormValue = this.updatetaskForm.value;
    let taskupdatFormValue = this.task_details;
    // taskupdatFormValue["id"] = this.selectedtask.id;
    // taskupdatFormValue["percentageComplete"] = "10";
    taskupdatFormValue["comments"] = this.added_comments_list;
    taskupdatFormValue["history"] = this.taskhistory_list;
    // taskupdatFormValue["endDate"] = this.endDate;
    // taskupdatFormValue["taskName"] = this.taskname;
    // if (
    //   this.optionValue == "As-Is Process" ||
    //   this.optionValue == "To-Be Process"
    // ) {
    //   taskupdatFormValue["process"] = this.bpm_process_list.find(
    //     (each) =>
    //       each.correlationID == this.updatetaskForm.value.correlationID
    //   ).processId;
    // }
    // taskupdatFormValue["taskCategory"]=this.taskcategory
    this.rest_api.updateTask(taskupdatFormValue).subscribe(
      (res) => {
        this.taskcomments_list = this.added_comments_list;
        this.add_comment = "";
        this.gettask();
        // let status: any = res;
        // if (status.errorMessage == undefined) {
        //   Swal.fire("Success", "Task Updated Successfully !!", "success");
        // } else {
        //   Swal.fire("Error", status.errorMessage, "error");
        // }
      },
      (err) => {
        Swal.fire("Error", "Something Went Wrong", "error");
      }
    );
    // } else {
    //   alert("please fill all details");
    // }
  }
  chnagefileUploadForm(event){
    console.log(event)
    this.isFile_upload_dialog = true;

    // for (var i = 0; i <= e.target.files.length - 1; i++) {
    // }
    this.files = [
      {
        key: "0",
        label: "Add Folder",
        data: "Movies Folder",
        collapsedIcon: 'pi pi-folder',
        expandedIcon: 'pi pi-folder'
      },
      {
        key: "1",
        label: "Analysis",
        data: "Documents Folder",
        collapsedIcon: 'pi pi-folder',
        expandedIcon: 'pi pi-folder-open',
        children: [
          {
            key: "1-0",
            label: "Add Folder / Document",
            data: "Work Folder",
            expandedIcon: "pi pi-folder-open",
            collapsedIcon: "pi pi-folder",
          },
          { key: "1-1", label: "Document 1", icon: "pi pi-file", data: "Document" },
          { key: "1-2", label: "Document 2", icon: "pi pi-file", data: "Document" },
          { key: "1-3", label: "Document 3", icon: "pi pi-file", data: "Document" },
        ],
      },
      {
        key: "2",
        label: "System Connectivity",
        data: "Pictures Folder",
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder",
        children: [
          {
            key: "2-0",
            label: "Add Folder / Document",
            data: "Work Folder",
            expandedIcon: "pi pi-folder-open",
            collapsedIcon: "pi pi-folder",
          },
          { key: "2-1", label: "Document 1", icon: "pi pi-file", data: "Document" },
          { key: "2-2",label: "Document 2", icon: "pi pi-file", data: "Document" },
          { key: "2-3", label: "Document 3", icon: "pi pi-file", data: "Document" },
        ],
      },
      {
        key: "3",
        label: "Process Documents",
        data: "Pictures Folder",
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder",
        children: [
          {
            key: "3-0",
            label: "Add Folder / Document",
            data: "Work Folder",
            expandedIcon: "pi pi-folder-open",
            collapsedIcon: "pi pi-folder",
          },
          { key: "3-1", label: "Document 1", icon: "pi pi-file", data: "Document" },
          { key: "3-2", label: "Document 2", icon: "pi pi-file", data: "Document" },
          { key: "3-3", label: "Document 3", icon: "pi pi-file", data: "Document" },
        ],
      },
      {
        key: "4",
        label: "Testing",
        data: "Movies Folder",
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder",
        children: [
          {
            key: "4-0",
            label: "Add Folder / Document",
            data: "Work Folder",
            expandedIcon: "pi pi-folder-open",
            collapsedIcon: "pi pi-folder",
          },
          { key: "4-1", label: "Document 1", icon: "pi pi-file", data: "Document" },
          { key: "4-2", label: "Document 2", icon: "pi pi-file", data: "Document" },
          { key: "4-3", label: "Document 3", icon: "pi pi-file", data: "Document" },
        ],
      },
      {
        key: "5",
        label: "References",
        data: "Movies Folder",
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder",
        children: [
          {
            key: "5-0",
            label: "Add Folder / Document",
            data: "Work Folder",
            expandedIcon: "pi pi-folder-open",
            collapsedIcon: "pi pi-folder",
          },
          { key: "5-1", label: "Document 1", icon: "pi pi-file", data: "Document" },
          { key: "5-2", label: "Document 2", icon: "pi pi-file", data: "Document" },
          { key: "5-3", label: "Document 3", icon: "pi pi-file", data: "Document" },
        ],
      }
    ];
    this.folder_files = this.files
  }

  Space(event:any){
    if(event.target.selectionStart === 0 && event.code === "Space"){
      event.preventDefault();
    }
  }

  nodeUnselect(){

  }

  onCloseFolderOverlay(){
    this.isFile_upload_dialog = false;
  }

}
