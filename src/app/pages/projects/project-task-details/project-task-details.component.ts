import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Inplace } from "primeng/inplace";
import { LoaderService } from "src/app/services/loader/loader.service";
import { DataTransferService } from "../../services/data-transfer.service";
import { RestApiService } from "../../services/rest-api.service";
import * as moment from "moment";
import { ConfirmationService, MessageService } from "primeng/api";
import * as JSZip from "jszip";
import * as FileSaver from "file-saver";

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
  taskName: any;
  edit_task_field: any;
  resources: any;
  status: any;
  hiddenPopUp: boolean = false;
  params_data: any;
  endDate: any;
  mindate: any;
  add_comment: string='';
  added_comments_list: any = [];
  percentageComplete: any;
  priority: any;
  priority_list: any;
  isFile_upload_dialog: boolean = false;
  selected_folder: any;
  folder_files: any;
  files: any[] = [];
  active_inplace: any;
  nodeMap: Object = {};
  uploaded_file: any;
  selectedItem: any;
  documentList:any;
  allFiles:any[]=[];

  constructor(
    private route: ActivatedRoute,
    private rest_api: RestApiService,
    private router: Router,
    private dataTransfer: DataTransferService,
    private spinner: LoaderService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: " Task created  successfully!",
          });
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
          // this.getTheListOfFolders();
        });
      this.spinner.hide();
    });
  }

  backToTaskList() {
    // this.router.navigate(["/pages/projects/tasks"], {
      this.router.navigate(["/pages/projects/projectdetails"], {
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
  }

  onDeactivate(field) {
    this[field].deactivate();
  }

  inplaceActivate(field, activeField) {
    if (activeField != this.active_inplace)
      if (this.active_inplace) this[this.active_inplace].deactivate();
    this.active_inplace = activeField;
    if (field == "endDate") {
      this.endDate = moment(this.task_details.endDate).format("YYYY-MM-DD");
      return;
    }
    this[field] = this.task_details[field];
  }

  onUpdateDetails(field) {
    this.task_details[field] = this[field];
    this.updatetask();
    this[this.active_inplace].deactivate();
  }

  inplaceActivateDesc(activeField) {
    if (activeField != this.active_inplace)
      if (this.active_inplace) this[this.active_inplace].deactivate();
    this.active_inplace = activeField;
    this.task_desc = this.task_details.description;
  }

  onUpdateDesc() {
    this.task_details.description = this.task_desc.toString();
    this.updatetask();
    this[this.active_inplace].deactivate();
  }

  closeOverlay(event) {
    this.hiddenPopUp = event;
  }

  taskAttachments() {
    this.hiddenPopUp = true;
    this.getTheListOfFolders();
  }

  deleteDocuments() {
    let req_body = [];
    this.confirmationService.confirm({
      message: "Do you want to delete this document? This can't be undo.",
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
        this.rest_api.deleteSelectedFileFolder(this.checkBoxselected).subscribe(
          (res) => {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Document deleted successfully!",
            });
            this.getTheListOfFolders();
            this.getTaskAttachments();
            this.spinner.hide();
          },
          (err) => {
            this.spinner.hide();
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Failed to delete!",
            });
          }
        );
      },
      reject: (type) => {}
    });
  }

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
      this.add_comment="";
    }
  }

  async getTaskAttachments() {
    await this.rest_api
      .getDocumentsById(this.params_data.project_id, this.params_data.task_id)
      .subscribe((data) => {
        this.attached_list = data;
        this.checkBoxselected = [];
        // if (this.taskattacments.length == 0) {
        //   this.hidetaskdeletedownload = false;
        // } else {
        //   this.hidetaskdeletedownload = true;
        // }
      });
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
        // this.taskcomments_list = this.added_comments_list;
        this.add_comment = "";
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Task updated successfully!",
        });
        this.gettask();
        // let status: any = res;
        // if (status.errorMessage == undefined) {
        //   Swal.fire("Success", "Task Updated Successfully !", "success");
        // } else {
        //   Swal.fire("Error", status.errorMessage, "error");
        // }
      },
      (err) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Task update failed.",
        });
      }
    );
    // } else {
    //   alert("Please fill in all the details.");
    // }
  }
  changefileUploadForm(event) {
    this.isFile_upload_dialog = true;
    this.uploaded_file = event.target.files;
  }

  Space(event: any) {
    if (event.target.selectionStart === 0 && event.code === "Space") {
      event.preventDefault();
    }
  }

  nodeUnselect() {}

  onCloseFolderOverlay() {
    this.isFile_upload_dialog = false;
  }

  getTheListOfFolders(){
    let res_data:any=[];
    this.files=[];
    this.rest_api.getListOfFoldersByProjectId(this.project_id).subscribe(res=>{
        res_data=res
        let onlyFolders=[];
        res_data.map(data=> {
          if(data.dataType=='folder'){
            data["children"]=[]
            onlyFolders.push(data);
          }
          return data
        });
        this.documentList = [...res_data]
      this.files =[...this.convertToTree(onlyFolders)];
      this.folder_files = this.files;
      // this.files.sort((a, b) => parseFloat(a.key) - parseFloat(b.key));
      this.allFiles =[...this.convertToTree(this.documentList)];
      this.allFiles.sort((a, b) => parseFloat(a.key) - parseFloat(b.key));
    })
    }

  uploadFile() {
    if (this.selected_folder.dataType != "folder") {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Please select a folder.",
      });
      return;
    }
    this.isFile_upload_dialog = false;

    let selected_folder:any = this.findNodeByKey(this.selected_folder.key,this.allFiles);
    let fileKeys=[];
    var fileData = new FormData();
    for (let i = 0; i < this.uploaded_file.length; i++) {
      fileData.append("filePath", this.uploaded_file[i]);
      // this.selected_folder.parent ? fileKeys.push(String(this.selected_folder.key+'-'+(fileKey+i))):fileKeys.push(String(this.selected_folder.key+'-'+(fileKey+(i+1))))
      fileKeys.push(String(this.selected_folder.key+'-'+(Number(this.getTheFileKey(selected_folder))+i)))
    }
    this.spinner.show();
    // fileData.append("filePath", this.uploaded_file);
    fileData.append("projectId", this.project_id);
    fileData.append("taskId", this.params_data.task_id);
    fileData.append("ChildId", "1");
    fileData.append("fileUniqueIds", JSON.stringify(fileKeys));
    this.rest_api.uploadfilesByProject(fileData).subscribe(
      (res) => {
        this.spinner.hide();
        this.getTheListOfFolders()
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "File uploaded successfully!",
        });
        this.getTaskAttachments();
      },
      (err) => {
        this.spinner.hide();
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to upload!",
        });
      }
    );
  }

  selectRow() {
    this.selectedItem = "";
    if (this.checkBoxselected.length > 0) {
      this.selectedItem = this.checkBoxselected[0].id;
    }
  }

  onDownloadDocument() {
    let req_body = [];
    let _me = this;
    this.checkBoxselected.forEach((ele) => {
      req_body.push(ele.id);
    });
    this.rest_api.dwnloadDocuments(req_body).subscribe((response: any) => {
      let resp_data = [];
      if(response.code == 4200){
        resp_data = response.data;
        if (resp_data.length > 0) {
          if (resp_data.length == 1) {
            let fileName = resp_data[0].label;
            var link = document.createElement("a");
            // let extension = fileName.toString().split("").reverse().join("").split(".")[0].split("").reverse().join("");
            let extension = resp_data[0].dataType;
            link.download = fileName;
            link.href =extension == "png" || extension == "jpg" || extension == "svg" || extension == "gif"
                ? `data:image/${extension};base64,${resp_data[0].data}`
                : `data:application/${extension};base64,${resp_data[0].data}`;
            link.click();
          } else {
            var zip = new JSZip();
            resp_data.forEach((value, i) => {
              let fileName = resp_data[i].label;
              // let extension = fileName.toString().split("").reverse().join("").split(".")[0].split("").reverse().join("");
              let extension = resp_data[i].dataType;
              if (extension == "jpg" || "PNG" || "svg" || "jpeg" || "png")
                zip.file(fileName, value.data, { base64: true });
              else zip.file(fileName, value.data);
            });
            zip.generateAsync({ type: "blob" }).then(function (content) {
              FileSaver.saveAs(content, _me.task_details.taskName + ".zip");
            });
          }
        }
      }
      
    });
  }

  backToProjectDetails() {
    this.router.navigate(["/pages/projects/projectdetails"], {
      queryParams: { project_id: this.project_id, project_name:this.project_name },
    });
  }

  truncateDesc(data){
    if(data && data.length > 51)
      return data.substr(0,50)+'...';
    return data;
  }

  truncateResourcename(resourcename) {
    if (resourcename && resourcename.length > 26)
      return resourcename.substr(0, 25) + "...";
    return resourcename;
    
  };
  truncateAssignedby(assignedby) {
    if (assignedby && assignedby.length > 23)
      return assignedby.substr(0, 22) + "...";
    return assignedby;
  };

  convertToTree(res_data:any){
    res_data.map(data=> {
      if(data.dataType=='folder'){
        data["children"]=[];
      }
      return data
    });
    let files:any =[];
    for (let obj of res_data) {
      let node = {
        key: obj.key,
        label: obj.label,
        data: obj.data,
        type:"default",
        uploadedBy:obj.uploadedBy,
        projectId:obj.projectId,
        id: obj.id,
        dataType:obj.dataType,
        children:obj.children,
        uploadedDate:obj.uploadedDate
      };
      if(obj.dataType == 'folder'){
        node['icon'] = "folder.svg"
      }else if(obj.dataType == 'png' || obj.dataType == 'jpg' || obj.dataType == 'svg' || obj.dataType == 'gif'||obj.dataType == 'PNG' || obj.dataType == 'JPG'){
        node['icon'] = "img-file.svg"
      }else if(obj.dataType == 'pdf'){
        node['icon'] = "pdf-file.svg"
      }else if(obj.dataType == 'txt'){
        node['icon'] = "txt-file.svg"
      }else if(obj.dataType == 'mp4'|| obj.dataType == 'gif'){
        node['icon'] = "video-file.svg"
      }else if(obj.dataType == 'docx'){
        node['icon'] = "doc-file.svg"
      }else if(obj.dataType == 'html'){
        node['icon'] = "html-file.svg"
      }else if(obj.dataType == 'csv'||obj.dataType == 'xlsx' ){
        node['icon'] = "xlsx-file.svg"
      }else if(obj.dataType == 'ppt'){
        node['icon'] = "ppt-file.svg"
      }else{
        node['icon'] = "txt-file.svg"
      }
        this.nodeMap[obj.key] = node;
      if (obj.key.indexOf('-') === -1) {
        files.push(node);
      } else {
        let parentKey = obj.key.substring(0, obj.key.lastIndexOf('-'));
        let parent = this.nodeMap[parentKey];
        if (parent) {
          if(parent.children)
          parent.children.push(node);
        }
      }
    }
    return files;
  }

  getTheFileKey(selected_folder:any){
    let filteredkey = selected_folder.children.length >0 ? selected_folder.children[selected_folder.children.length-1].key.split("-"):"1"
    return selected_folder.children.length >0?Number(filteredkey[filteredkey.length-1])+1:filteredkey;
  };

  findNodeByKey(key: string, nodes: any[]) {
    let node: any = null;
    for (const n of nodes) {
      if (n.key === key) {
        node = n;
        break;
      } else if (n.children) {
        node = this.findNodeByKey(key, n.children);
        if (node) {
          break;
        }
      }
    }
    return node;
  };
  mouseUp(){}
}
