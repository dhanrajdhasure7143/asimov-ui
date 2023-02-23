import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Inplace } from "primeng/inplace";
import { LoaderService } from "src/app/services/loader/loader.service";
import { DataTransferService } from "../../services/data-transfer.service";
import { RestApiService } from "../../services/rest-api.service";
import Swal from "sweetalert2";
import * as moment from "moment";
import { MessageService } from "primeng/api";

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
  priority_list: any;
  isFile_upload_dialog:boolean = false;
  selected_folder:any;
  folder_files:any;
  files:any;
  active_inplace:any;
  nodeMap:Object = {};
  uploaded_file:any;

  constructor(
    private route: ActivatedRoute,
    private rest_api: RestApiService,
    private router: Router,
    private dataTransfer: DataTransferService,
    private spinner: LoaderService,
    private messageService: MessageService
  ) {
    this.status_list = [
      { name: "New" },
      { name: "In Progress" },
      { name: "In Review" },
      { name: "Closed" },
    ];
    this.priority_list = [
      { name: "High" },
      { name: "Medium" },
      { name: "Low" },
    ];
  }

  ngOnInit(): void {
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
          let taskList: any = response;
          this.task_details = taskList[0];
          // this.task_details = taskList.find((item) => item.id == data.task_id);
          // this.selected_task_details = taskList.find((item) => item.id == data.task_id);
          this.taskcomments_list = this.task_details.comments;
          this.taskhistory_list = this.task_details.history;
          this.added_comments_list = [];
          // this.added_comments_list = this.task_details.history;
          this.task_desc = this.task_details.description;

          // this.due_date = moment(this.task_details.endDate).format("YYYY-MM-DD");
          this.mindate = moment(this.task_details.startDate).format(
            "YYYY-MM-DD"
          );
        this.getTheListOfFolders();
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

  onDeactivate(field){
    this[field].deactivate();
  }

  inplaceActivate(field, activeField) {
    if(activeField != this.active_inplace)
    if(this.active_inplace) this[this.active_inplace].deactivate()
    // this.active_inplace='';
    this.active_inplace = activeField
    if (field == "endDate") {
      this.endDate = moment(this.task_details.endDate).format("YYYY-MM-DD");
      return;
    }
    this[field] = this.task_details[field];
    // e.deactivate();
  }

  onUpdateDetails(field) {
    // if (field == "percentageComplete") {
    //   if (this.percentageComplete > 100) {
    //     this.percentageComplete = 100;
    //   } else {
    //     this.task_details[field] = String(this[field]);
    //     this.updatetask();
    //     this[this.active_inplace].deactivate();
    //   }
    // } else {
      this.task_details[field] = this[field];
      this.updatetask();
      this[this.active_inplace].deactivate();
    // }
  }

  inplaceActivateDesc(activeField) {
    if(activeField != this.active_inplace)
    if(this.active_inplace) this[this.active_inplace].deactivate()
    this.active_inplace = activeField
    this.task_desc = this.task_details.description;
  }

  onUpdateDesc() {
    this.task_details.description = this.task_desc.toString();
    this.updatetask();
    this[this.active_inplace].deactivate();
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
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Task Updated Successfully !!'});
        this.gettask();
        // let status: any = res;
        // if (status.errorMessage == undefined) {
        //   Swal.fire("Success", "Task Updated Successfully !!", "success");
        // } else {
        //   Swal.fire("Error", status.errorMessage, "error");
        // }
      },
      (err) => {
        this.messageService.add({severity:'error', summary: 'Error', detail: "Task Update failed"});
      }
    );
    // } else {
    //   alert("please fill all details");
    // }
  }
  chnagefileUploadForm(event){
    console.log(event)
    this.isFile_upload_dialog = true;
    this.uploaded_file= event.target.files[0]

    // for (var i = 0; i <= e.target.files.length - 1; i++) {
    // }

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

  getTheListOfFolders(){
    let res_data:any=[];
    this.rest_api.getListOfFoldersByProjectId(this.project_id).subscribe(res=>{
      console.log(res)
        res_data=res
      this.files=[
      ];
      for (let obj of res_data) {
        let node = {
          label: obj.label,
          data: obj.data,
          key: obj.key,
          type:"default",
          uploadedBy:obj.uploadedBy,
          projectId:obj.projectId,
          id: obj.id
        };
          if(obj.dataType == 'folder'){
            node['collapsedIcon']=  "pi pi-folder"
            node["expandedIcon"]  ="pi pi-folder-open"
        }else{
          node['icon']=  "pi pi-file"
        }
        this.nodeMap[obj.key] = node;
        if (obj.key.indexOf('-') === -1) {
          node['children']=[
          ]
          this.files.push(node);
        } else {
          let parentKey = obj.key.substring(0, obj.key.lastIndexOf('-'));
          let parent = this.nodeMap[parentKey];
          if (parent) {
            if (!parent.children) {

            }
            parent.children.push(node);
          }
        }
      }
      this.folder_files = this.files
    })
  }

  uploadFile(){
    console.log(this.selected_folder,"Selectedfolders");

    var fileData = new FormData();
    fileData.append("filePath", this.uploaded_file);
    fileData.append("key",'3-1')
    fileData.append("label",this.uploaded_file.name.split('.')[0])
    fileData.append("data","file")
    fileData.append("ChildId",'1')
    fileData.append("dataType",this.uploaded_file.name.split('.')[1])
    fileData.append("fileSize",this.uploaded_file.size)
    fileData.append("task_id",this.task_details.id)
    fileData.append("projectId", this.project_id)
  
    this.rest_api.createFolderByProject(fileData).subscribe(res=>{

    })
  }

}
