import { Component, ElementRef, Input, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';
import { RestApiService } from '../../services/rest-api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import moment from 'moment';
import { Subscription } from 'rxjs';
import {MenuItem} from 'primeng/api';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { Inplace } from 'primeng/inplace';
import {MessageService} from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@Component({
selector: 'app-project-details-screen',
templateUrl: './project-details-new.html',
styleUrls: ['./project-details-new.css'],
providers: [MessageService]
})
export class ProjectDetailsScreenComponent implements OnInit {
@ViewChild("inplace") inplace!: Inplace;
@ViewChild("inplace1") inplace1!: Inplace;
@ViewChild("inplace2") inplace2!: Inplace;
@ViewChild("inplace3") inplace3!: Inplace;
@ViewChild("inplace4") inplace4!: Inplace;
@ViewChild("inplace5") inplace5!: Inplace;
//@ViewChild("op") messageUsersList:any;
projectDetails: any={};
lastname: string;
firstname: string;
firstletter: string;
retrievedImage: any;
base64Data: any;
public retrieveResonse: any;
public profilePicture: boolean = false;
tenantId: string;
role: string;
resourcetablefirstname: any;
resourcetablelastname: any;
process_names: any;
selectedcategory: number;
selectedvalue: any;
categaoriesList: any;
selected_process_names: any;
att:any;
typedMessage:string='';
responsedata: any;
bot_list: any = [];
automatedtask: any;
createtaskmodalref: BsModalRef;
addresourcemodalref: BsModalRef;
project_id: any;
public tasks: any = [];
multiFilesArray: any[] = [];
public users_list: any = [];
public selectedTab = 0;
public check_tab = 0;
slider: number = 3;
percentageComplete: number;
options: any = {
floor: 0,
ceil: 100,
horizontal: true
};
updatetaskForm: FormGroup;
uploadtaskFileForm: FormGroup;
updatetaskmodalref: BsModalRef;
uploadtaskFilemodalref: BsModalRef;
selectedtaskdata: any;
currentdate: number;
editcomment: any;
showeditcomment: boolean = false;
commentnumber: number;
fileUploadData: any;
selectedtaskfileupload: any;
editdata: Boolean = false;
resources: any = [];
// processOwner: boolean = false;
userid: any;
rolelist: any = [];
userrole: any = [];
public rolename: any;
roles: any;
userslist: any = [];
useremail: any;
processes: any;
taskdata: any;
project: Object;
modeldisable: boolean = false;
public taskcomments: any = [];
multicomments: any[];
taskattacments: any;
taskcomments_list: any[] = [];
taskhistory: any = [];
filecategories: any;
programId: any;
taskresourceemail: any;
resourceslength: any;
latestFiveDocs: any;
uploadFilemodalref: BsModalRef;
uploadFileForm: FormGroup;
uploadFileFormDetails: FormGroup;
public Resourcedeleteflag: Boolean;
public Resourcecheckeddisabled: boolean = false;
public Resourcecheckflag: boolean = false;
resources_list: any = [];
projectid: any;
uploadedFiledata: any;
filterdArray: any[];
requestedFiledata: any;
fileList: File[] = [];
listOfFiles: any[] = [];
owner_letters: any;
public isButtonVisible = false;
public userRole: any = [];
public userName: any;
customUserRole: any;
enableeditproject: boolean = false;
enablecreatetask: boolean = false;
enableedittask: boolean = false;
enabledeletetask: boolean = false;
mindate = moment().format("YYYY-MM-DD");
projectenddate: any;
projectStartDate: any;
initiatives: any;
loginresourcecheck: boolean = false;
freetrail: string;
projectNameFlag: boolean = false;
projectPurposeFlag: boolean = false;
processOwnerFlag: boolean = false;
uploadFileDescriptionFlag: boolean = false;
processownername: any;
users_data: any = [];
sub: Subscription;
isShowAnswerInput: boolean = false;
businessChallange: any;
businessPurpose: any;
problemStatement: any;
haveQuestion: any;
processQuestions: any = [];
processUnderstanding: any = {};
isProcessEdit: boolean = false;
selected_questionId: number;
selectedAnswerUpdate: any;
businessDetails: any = [];
isOpenedState : number =0;
selectedQuestionEdit:number;
selectedQuestionUpdate:any;
toBeProcessBpmn:any;
asIsProcessBpmn:any;
downloadData:any={};
file_Category:any;
filecategoriesList:any[]=[]
bpmnList:any[]=[];
asIsProcessId:any;
toBeProcessId:any;
business_benefits:any;
bpmnModeler;
bpmnModeler1;
items: MenuItem[];
actionsitems: MenuItem[];
public hiddenPopUp: boolean = false;
columns_list:any;
existingUsersList:any[]=[];
checkBoxselected:any[]=[];
roles_list = [
{name: 'All Roles', code: 'All'},
{name: 'System Admin', code: 'System Admin'},
{name: 'Process Architect', code: 'Process Architect'},
{name: 'RPA Developer', code: 'RPA Developer'},
{name: 'Process Owner', code: 'Process Owner'},
{name: 'Process Designer', code: 'Process Designer'}
];
selectedRole:any= "All";
users_tableList:any=[];
users_tabIndex:any=0;
usersTable:any=[];
createTaskOverlay: boolean = false;
isReadmoreShow: boolean = false;
non_existUsers:any[]=[];
stompClient;
messages_list:any[]=[];
project_desc:any='';
params_data:any;
logged_userId:any='';
userDetails:any;
replay_msg:any;
isCreate= false;
selectedItem: any;
priority:any;
projectName:any;
resource:any;
processOwner:any;
status:any;
projectPercentage:any;
status_list = [
{ name: "New" },
{ name: "In Progress" },
// { name: "Pipeline" },
{ name: "On Hold" },
{ name: "Closed" },
];

priority_list = [
{ name: "High" },
{ name: "Medium" },
{ name: "Low" },
];
categories_list:any[]=[];
mapValueChain:any;
active_inplace:any;
project_desc_edit:any;
isEditDesc:boolean=false;
snapshotDatails:any=[];
selected_folder:any;
isFile_upload_dialog:boolean=false;
nodeMap:Object = {};
files:any[]=[];
selectedType:any;
isDialog:boolean=false;
entered_folder_name:string='';
_pinnedMessage:any[]=[];
filteredUsers:any;
interval:any;
showUserList:boolean= false;
recentActivityList:any=[];
columns_list_activities:any[]=[];


constructor(private dt: DataTransferService, private route: ActivatedRoute, private rest_api: RestApiService,
private modalService: BsModalService, private formBuilder: FormBuilder, private router: Router,
private spinner: LoaderService,
private messageService: MessageService,
private confirmationService: ConfirmationService
) {
  this.route.queryParams.subscribe((data:any)=>{​​​​​​
    this.params_data=data
    this.project_id = this.params_data.project_id
    this.role=this.params_data.role
    if(this.params_data.isCreated) this.isCreate = this.params_data.isCreated
    this.spinner.show();
    this.getallusers();
  });

 }
 

ngOnInit() {
this.actionsitems = [
  {
    label: 'Tasks',
    command: () => {
      this.taskListView();
    }
  },
  {
    label: 'Users',
    command: () => {
      this.openUsersOverlay();
    }
  },
  {label: 'Documents', command: () => {this.openDocumentScreen();}}
];
// this.processOwner = false;
localStorage.setItem('project_id', null);
localStorage.setItem('bot_id', null);
$('.link').removeClass('active');
$('#projects').addClass("active");
this.updatetaskForm = this.formBuilder.group({
  // taskCategory: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
  priority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
  startDate: ['', Validators.compose([Validators.maxLength(200)])],
  resources: ['', Validators.compose([Validators.maxLength(200)])],
  // taskName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
  // timeEstimate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
  endDate: ['', Validators.compose([Validators.maxLength(200)])],
  approvers: ['', Validators.compose([Validators.maxLength(200)])],
  status: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
  description: ["", Validators.compose([Validators.maxLength(150)])],
  comments: ['', Validators.compose([Validators.maxLength(200)])],
  summary: ['', Validators.compose([Validators.maxLength(200)])],
  percentageComplete: ['', Validators.compose([Validators.maxLength(200)])],
  editcomment: ['', Validators.compose([Validators.maxLength(200)])],
})

this.uploadtaskFileForm = this.formBuilder.group({
  category: ["", Validators.compose([Validators.required, Validators.maxLength(200)])],
  description: ["", Validators.compose([Validators.required, Validators.maxLength(200)])],
  filePath: ["", Validators.compose([Validators.required])],
})
this.uploadFileFormDetails = this.formBuilder.group({
  fileCategory: ["", Validators.compose([Validators.required, Validators.maxLength(200)])],
  description: ["", Validators.compose([Validators.required, Validators.maxLength(200)])],
  uploadFile: ["", Validators.compose([Validators.required])],
})

this.userRole = localStorage.getItem("userRole");
this.userName = localStorage.getItem("firstName") + " " + localStorage.getItem("lastName");
// this.userRole = this.userRole.split(',');
// this.isButtonVisible = this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('Process Owner')
// || this.userRole.includes('Process Architect') || this.userRole.includes('System Admin') 
// || this.userRole.includes('Process Analyst')|| this.userRole.includes('RPA Developer');

this.rest_api.getCustomUserRole(2).subscribe(role => {
  this.customUserRole = role;
  let element = []
  for (let index = 0; index < this.customUserRole.message.length; index++) {
    element = this.customUserRole.message[index].permission;
    element.forEach(element1 => {
      if (element1.permissionName.includes('Project_Edit')) {
        this.enableeditproject = true;
      } else if (element1.permissionName.includes('Task_Create')) {
        this.enablecreatetask = true;
      } else if (element1.permissionName.includes('Task_Edit')) {
        this.enableedittask = true;
      } else if (element1.permissionName == 'Task_Delete') {
        this.enabledeletetask = true;
      }
    });
  }
})
this.getallprocesses();
// setTimeout(() => {
//   this.getImage();
//   this.profileName();
// }, 2000);
// this.getFileCategoriesList();
// this.getProcessUnderstandingDetails();
// this.getQuestionnaire();
//  this.getallusers();
// this.getInitiatives();
this.Resourcedeleteflag = false;
this.freetrail = localStorage.getItem("freetrail")
}


onTabChanged(event) {
this.check_tab = event.index;
}

ResourcecheckAllCheckBox(ev) {
this.resources_list.forEach(x =>
  x.checked = ev.target.checked);
if(this.resources_list.filter(data => data.checked == true).length == this.resources_list.length){
  this.Resourcecheckflag = true;
}
else{
  this.Resourcecheckflag = false;
}
this.checktodelete();
}

resetdocform() {
this.uploadFileFormDetails.reset();
this.uploadFileFormDetails.get("fileCategory").setValue("");
this.uploadFileFormDetails.get("description").setValue("");
}

chnagefileUploadForm(e) {
  if(this.file_Category == "Template"){
    this.fileList=[];
    this.listOfFiles=[];
  }
for (var i = 0; i <= e.target.files.length - 1; i++) {
  var selectedFile = e.target.files[i];
  this.fileList.push(selectedFile);
  var value = {
    // File Name 
    name: selectedFile.name,
    //File Size 
    size: selectedFile.size,
  }
  this.listOfFiles.push(value)
}
this.uploadtaskFileForm.get("filePath").setValue(this.fileList);
this.uploadFileFormDetails.get("uploadFile").setValue(this.fileList);

}

downloadExcel() {
this.spinner.show();
this.rest_api.exportproject(this.project_id).subscribe(data => {
  let response: any = data;
  if (response.errorMessage == undefined) {
    var link = document.createElement('a');
    link.download = this.projectDetails.projectName;
    link.href = (`data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${response.encryptedString}`);
    link.click();
    Swal.fire("Success", response.message, "success");
    this.spinner.hide();
  }
  else {
    this.spinner.hide();
    Swal.fire("Error", response.errorMessage, "error");
  }
})
}

checktodelete() {
const selectedresourcedata = this.resources_list.filter(product => product.checked).map(p => p.id);
if (selectedresourcedata.length > 0) {
  this.Resourcedeleteflag = true;
} else {
  this.Resourcedeleteflag = false;
}
}

removeallchecks() {
for (let i = 0; i < this.resources_list.length; i++) {
  this.resources_list[i].checked = false;
}
this.Resourcecheckflag = false;
}

ResourcecheckEnableDisableBtn(id, event) {
this.resources_list.find(data => data.id == id).checked = event.target.checked;
if(this.resources_list.filter(data => data.checked == true).length == this.resources_list.length){
  this.Resourcecheckflag = true;
}
else{
  this.Resourcecheckflag = false;
}
this.checktodelete();
}

inputNumberOnly(event) {
let numArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Backspace", "Tab"]
let temp = numArray.includes(event.key); //gives true or false
if (!temp) {
  event.preventDefault();
}
}


getUserRole() {
let user = this.users_list.find(item => item.userId.userId == this.selectedtaskdata.resources);
this.userid = user.userId.userId
this.rest_api.getRole(this.userid).subscribe(data => {
  this.userrole = data
  for (let index = 0; index <= this.userrole.message.length; index++) {
    this.rolename = this.userrole.message[index];
    this.rolelist.push(this.rolename.name)
    this.roles = this.rolelist.join(',')
  }
})
}

async getProjectdetails(){​​​​​​
// this.spinner.show();
await this.rest_api.getProjectDetailsById(this.project_id).subscribe( res=>{​​​​​​
this.projectDetails=res
this.processownername = this.projectDetails.processOwner
this.project_desc = this.projectDetails.projectPurpose
this.processOwnerFlag=false;
if(this.projectDetails.endDate){
this.projectenddate=moment(this.projectDetails.endDate).format("lll");
}
this.projectStartDate = moment(this.projectDetails.startDate).format("lll");
this.getTheExistingUsersList(null);

})
this.snapShotDetails();
this.getRecentactivities();
}
profileName() {
setTimeout(() => {
  this.firstname = this.resourcetablefirstname;
  this.lastname = this.resourcetablelastname;
  var firstnameFirstLetter = this.firstname.charAt(0)
  var lastnameFirstLetter = this.lastname.charAt(0)
  this.firstletter = firstnameFirstLetter + lastnameFirstLetter
}, 2000);
}

getImage() {
const userid = localStorage.getItem('ProfileuserId');
this.rest_api.getUserDetails(userid).subscribe(res => {
  this.retrieveResonse = res;
  setTimeout(() => {
    this.resourcetablefirstname = this.retrieveResonse.firstName
    this.resourcetablelastname = this.retrieveResonse.lastName
  }, 500);
  if (this.retrieveResonse.image == null || this.retrieveResonse.image == "") {
    this.profileName();
    this.profilePicture = false;
  }
  else {
    this.profilePicture = true;
  }
  this.base64Data = this.retrieveResonse.image;
  // localStorage.setItem('image', this.base64Data);
  this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
}
);
}

onProcessChange(processId: number) {
let process = this.selected_process_names.find(process => process.processId == processId);
if (process != undefined) {
  let processOwner: any = this.users_data.find(item => (item.userId == process.ProcessOwner))

  //let processOwner:any=this.userslist.find(item=>(`${item.userId.firstName} ${item.userId.lastName}`==process.createdBy))
  if (processOwner != undefined) {
  this.processownername='';
    // document.getElementById('processowner')['value'] = processOwner.userId.userId;
    this.processownername = processOwner.userId;
    this.processOwnerFlag = false;
    // this.createprogram.get("processOwner").setValue(processOwner.userId.userId);
    // this.processOwner=false;
  } else {
    // document.getElementById('processowner')['value'] = '';
    this.processownername='';
    this.processOwnerFlag = true;
    //this.createprogram.get("processOwner").setValue("")
    Swal.fire("Error", "Unable to find process owner for selected process", "error")
  }
}
}


getallusers() {
this.spinner.show();
this.dt.logged_userData.subscribe(res=>{
  if(res){
    this.userDetails = res;
  this.logged_userId=res.userId
  }
})
this.dt.tenantBased_UsersList.subscribe(response => {
  let usersDatausers_list:any[] = [];
  if(response)
    usersDatausers_list = response;
  if(usersDatausers_list.length>0){
  this.getProjectdetails();
  // this.connectToWebSocket();
    this.getMessagesList();
  this.getAllCategories();
  this.getTheListOfFolders();
  this.users_list = usersDatausers_list.filter(x => x.user_role_status == 'ACTIVE')
  }
})
}

getallprocesses() {
this.rest_api.getprocessnames().subscribe(processnames => {
  let resp: any = []
  resp = processnames
  let approved_processes = resp.filter(item => item.status == "APPROVED");
  // this.processes = resp.filter(item => item.status == "APPROVED");
  this.processes = approved_processes.sort((a, b) => (a.processName.toLowerCase() > b.processName.toLowerCase()) ? 1 : ((b.processName.toLowerCase() > a.processName.toLowerCase()) ? -1 : 0));
  // this.selected_process_names = resp.sort((a, b) => (a.processName.toLowerCase() > b.processName.toLowerCase()) ? 1 : ((b.processName.toLowerCase() > a.processName.toLowerCase()) ? -1 : 0));
  this.selected_process_names = this.processes;
})
}


navigateToWorkspace(data) {
localStorage.setItem('project_id', this.projectDetails.id);
if (data.taskCategory == "RPA Implementation") {
  this.router.navigate(['/pages/rpautomation/designer'], { queryParams: { projectId: this.projectDetails.id, botId: data.correlationID } })
}
if (data.taskCategory == "BPMN Design" || data.taskCategory == "As-Is Process" || data.taskCategory == "To-Be Process") {
  this.router.navigate(['pages/businessProcess/uploadProcessModel'],
    { queryParams: { "bpsId": data.correlationID.split(":")[0], "ver": data.correlationID.split(":")[1], "ntype": "bpmn" } })
}
if (data.taskCategory == "RPA Design") {
  this.router.navigate(['pages/projects/repdesign'],{ queryParams: {projectId: data.projectId,taskId:data.id,programId:this.programId}})
}

if (data.taskCategory == "Process Mining") {
  this.router.navigate(['pages/processIntelligence/flowChart'], { queryParams: { "wpiId": data.correlationID } })
}
else {
  this.modeldisable == true
}
}



addresources() {
let usersArray=[]
this.checkBoxselected.forEach(e=>{
  usersArray.push(e.user_email)
})
let item_data = {
  id: this.projectDetails.id,
  access: "Project",
  // resources: JSON.parse(event),
  resources: usersArray
}
this.spinner.show();
// this.addresourcemodalref.hide();
this.rest_api.addresourcebyid(item_data).subscribe(data => {
  let response: any = data;
  if (response.errorMessage == undefined) {
    this.getTheExistingUsersList(0);
    this.checktodelete();
    this.getRecentactivities();
    this.snapShotDetails();
    this.messageService.add({severity:'success', summary: 'Success', detail: response.status+' !!'});
    this.checkBoxselected =[];
    // this.onUsersTab(0);
    this.spinner.hide();
  }
  else {
    this.messageService.add({severity:'error', summary: 'Error', detail: response.errorMessage});
    this.spinner.hide();
  }
},err=>{
  this.messageService.add({severity:'error', summary: 'Error', detail:"Failed to add resource"});
  this.spinner.hide();
})
}

// projectDetailsbyId(id){

//   this.rpa.getProjectDetailsById(id).subscribe( res =>{
//   this.project=res;
//   this.navigatetodetailspage(this.project)
//   })
// }


// navigatetodetailspage(detials){
//   let encoded=Base64.encode(JSON.stringify(detials));
//   let project={id:encoded}
//   this.router.navigate(['/pages/projects/projectdetails',project])
// }

deleteuserById(row) {
const selectedresource = [
      {
        "projectId": this.project_id,
        "resource": row.user_email
      }
]

this.confirmationService.confirm({
  message: "Are you sure?, You won't be able to revert this!",
  header: 'Confirmation',
  icon: 'pi pi-info-circle',
  accept: () => {
    this.spinner.show();
    this.rest_api.deleteResource(selectedresource).subscribe(res => {
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Resource Deleted Successfully !!'});
    this.getTheExistingUsersList(1);
    // setTimeout(() => {
    //   this.onUsersTab(1);
    // }, 500);
      this.checktodelete();
      this.snapShotDetails();
      this.spinner.hide();
    }, err => {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Something went wrong!'});
      this.spinner.hide();
    })
  },
  reject: (type) => {
  },
  key: "positionDialog"
});
}

addresource(createmodal) {
this.addresourcemodalref = this.modalService.show(createmodal, { class: "modal-lr" })
}


posteditcancelcomment() {
this.commentnumber = null
this.updatetaskForm.get("editcomment").setValue("");
}

navigateToProjectRepo() {
if (localStorage.getItem('project_id') == "null") {
  this.router.navigate(["/pages/projects/projectreposcreen"], { queryParams: { "id": this.projectDetails.id } })
}
}

navigateToOrchestration() {
localStorage.setItem('project_id', this.projectDetails.id);
this.router.navigate(["/pages/serviceOrchestration/home"],
  { queryParams: { "processid": this.projectDetails.process } })
}

editComments(comments, i) {
this.updatetaskForm.get("editcomment").setValue(comments);
this.showeditcomment = true;
this.commentnumber = i
}

updatecomment(id) {
this.commentnumber = null
for (let i = 0; i < this.taskcomments.length; i++) {
  if (this.taskcomments[i].id == id) {
    this.taskcomments[i].comments = this.updatetaskForm.get("editcomment").value
  }
}
}

onFileSelected(e) {
this.fileUploadData = <File>e.target.files[0]
}

uploadtaskfile(createmodal, data) {
this.getFileCategoriesList();
// this.getFileCategories();
this.selectedtaskfileupload = data
this.uploadtaskFilemodalref = this.modalService.show(createmodal, { class: "modal-lr" })
}

getFileCategories() {
this.rest_api.getFileCategories().subscribe(data => {
  this.filecategories = data;
})
}

updateprojectDetails() {
// this.spinner.show()
this.projectDetails["type"] = "Project";
// this.projectDetails.processOwner = this.processownername
// this.projectDetails.endDate = this.projectenddate;
// this.projectDetails.startDate = this.projectStartDate;
this.projectDetails.effortsSpent = parseInt(this.projectDetails.effortsSpent)
this.rest_api.update_project(this.projectDetails).subscribe(res => {
  // this.spinner.hide();
  let response: any = res;
  if (response.errorMessage == undefined)
  this.messageService.add({severity:'success', summary: 'Success', detail: 'Project Updated Successfully !!'});
  else
  this.messageService.add({severity:'error', summary: 'Error', detail: response.errorMessage});
  this.getProjectdetails()
  // this.editdata = false;
},err=>{
  this.messageService.add({severity:'error', summary: 'Error', detail: "Project Update failed"});
});
}

downloadTaskAttachment(attachment) {
let data = [attachment.fileName]
this.rest_api.downloadTaskAttachment(data).subscribe(data => {
  let response: any = data
  var link = document.createElement('a');
  let extension = ((((attachment.fileName.toString()).split("")).reverse()).join("")).split(".")[0].split("").reverse().join("")
  link.download = attachment.fileName;
  link.href = ((extension == 'png' || extension == 'jpg' || extension == 'svg' || extension == 'gif') ? `data:image/${extension};base64,${response[0]}` : `data:application/${extension};charset=utf-8,${response[0]}`);
  link.click();
})
}

uploadtaskFilemodalCancel() {
this.uploadtaskFileForm.reset();
this.listOfFiles = [];
this.fileList = [];
this.uploadtaskFilemodalref.hide();
}

uploadFilemodalCancel() {
this.uploadFileFormDetails.reset();
this.listOfFiles = [];
this.fileList = [];
this.uploadFilemodalref.hide();
}

endDateMethod() {
return false;
}

onchangeDate() {
if (this.projectDetails.endDate)
  this.projectDetails.endDate = "0000-00-00";
}

getInitiatives() {
this.rest_api.getProjectIntitiatives().subscribe(res => {
  let response: any = res;
  this.initiatives = response;
})
}

projectNameMaxLength(value) {
if (value.length > 50) {
  this.projectNameFlag = true;
} else {
  this.projectNameFlag = false;
}
}

projectPurposeMaxLength(value) {
if (value.length > 150) {
  this.projectPurposeFlag = true;
} else {
  this.projectPurposeFlag = false;
}
}

uploadFileDescriptionMaxLength(value) {
if (value.length > 150) {
  this.uploadFileDescriptionFlag = true;
} else {
  this.uploadFileDescriptionFlag = false;
}
}

getUserName(event) {
var userName;
this.users_list.forEach(element => {
  if (element.user_email == event) {
    userName = element.fullName
  }
});
return userName;
}

onOpenProcess(value) {
if(value == "questions"){
  var element = document.getElementById('question-div');
}else{
  this.isOpenedState = 1
  var element = document.getElementById('business_Process');
}
setTimeout(() => {
  element.scrollIntoView({ behavior: "auto", block: "center", inline: "nearest" });
}, 100);
}

rpaDesign(){
this.router.navigate(['pages/projects/repdesign'])
}

getuserLetters(data) {
if (data) {
  let user = data.split(' ')
  var fname_fLetter = user[0].charAt(0);
  var lname_fLetter = user[1].charAt(0);
  return fname_fLetter + lname_fLetter;
} else {
  return '-'
}
}


getFileCategoriesList(){
this.rest_api.getFileCategoriesList(this.project_id).subscribe((res:any)=>{
  this.filecategoriesList = res
})
}

Space(event:any){
if(event.target.selectionStart === 0 && event.code === "Space"){
  event.preventDefault();
}
}

openUsersOverlay() {
this.hiddenPopUp = true;
this.onUsersTab(0);
}

taskListView(){
this.router.navigate(['/pages/projects/tasks'],{queryParams:{project_id:this.project_id,"project_name":this.projectDetails.projectName}});
}

closeOverlay(event) {
this.hiddenPopUp = event;
}

onChangeRole(event,tab){
if(tab == 0){
if(event.value.code == 'All') {
this.users_tableList = this.non_existUsers
return
}
this.users_tableList = this.non_existUsers.filter(item => (item.user_role == event.value.code))
}else{
  if(event.value.code == 'All') {
    this.users_tableList = this.existingUsersList
    return
  }
  this.users_tableList = this.existingUsersList.filter(item => (item.user_role == event.value.code))
}

}

onUsersTab(index){
this.users_tabIndex = index;
this.checkBoxselected=[];
if(index == 0) {
  this.users_tableList = this.non_existUsers
  this.columns_list = [
    {ColumnName: "fullName"},
    { ColumnName: "user_role"},
  ];
  return
  }
  this.users_tableList = this.existingUsersList
  this.columns_list = [
    {ColumnName: "fullName",DisplayName:"Users Onboarded"},
    { ColumnName: "user_role",DisplayName:"Role"},
    { ColumnName: "taskCount",DisplayName:"Tasks Assigned"},
    { ColumnName: "action",DisplayName:"Actions"},
  ];
}


connectToWebSocket() {
// console.log("Initialize WebSocket Connection");
// let ws = new SockJS("https://ezflow.dev.epsoftinc.com/messageservice/projectChat");
// // let ws = new SockJS("http://localhost:8098/projectChat");
// this.stompClient = Stomp.over(ws);
// const _this = this;
// _this.stompClient.connect({}, function (frame) {
//     _this.stompClient.subscribe("/topic/messages", function (sdkEvent) {
//         // console.log(JSON.parse(sdkEvent.body));
//         _this.messages_list = JSON.parse(sdkEvent.body)
//         console.log(_this.messages_list)
//         setTimeout(()=>{
//           var objDiv = document.getElementById("message-body");
//           objDiv.scrollTop = objDiv.scrollHeight;
//         },100)
//     });
//     _this.stompClient.reconnect_delay = 2000;
// },(err)=>{
//   // console.log(err)
// });
};

urlify(text) {
  let replacedText = text
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  if(text)
  return text.replace(urlRegex, function(url) {
    return '<a href="' + url + '" target="_blank">' + url + '</a>';
  })
  // or alternatively
  // return text.replace(pattern, '<span class="icon-color">' + text + '</span>')
}

sendMessage(item,type) {
  let message
  if(type != 'pinned' && this.typedMessage.length ==0) return
  if(type == 'save'){
    const regex = /@(\w+)\s(\w+)/g;
    let messageInput1= new String(this.typedMessage);
    const matches = messageInput1.match(regex);
    if (matches) 
    matches.forEach(tag => {
      const user = this.existingUsersList.find(u => u.fullName === tag.replace('@','') );
      messageInput1=messageInput1.replace(tag, "${"+user.user_email+"}");
    })
  message={
      userId:this.logged_userId,
      message:messageInput1,
      // message:details,
      projectId:this.project_id,
      rmId:0,
      firstName:this.userDetails.firstName,
      lastName:this.userDetails.lastName,
      "pinnedMessage": false,
      "replyMessage": "",
    }
  }

  if(type == 'pinned'){
    message= item;
    message.pinnedMessage = true;
    this.replay_msg=''
  }

    if(type == "unpinned"){
      message = this._pinnedMessage[0];
      message.pinnedMessage = false;
      this.replay_msg='';
    }

    if(this.replay_msg){
      message.rmId = this.replay_msg.id;
      message.replyMessage = this.replay_msg.message;
    }
// console.log("calling logout api via web socket",message);
// this.typedMessage='';
// this.replay_msg = null;
// this.stompClient.send("/app/send", {}, JSON.stringify(message));
  this.rest_api.sendMessagesByProjectId(message).subscribe(res=>{
    this.typedMessage='';
    this.replay_msg="";
    this.getMessagesList();
  })
}

pinMessage(item){
  this.replay_msg='';
  if(this._pinnedMessage.length>0){
  this.confirmationService.confirm({
    message: 'Want to replace the currently pinned message with this one?',
    header: 'Confirmation',
    icon: 'pi pi-info-circle',
    accept: () => {
      this.sendMessage(item,'pinned')
    },
    reject: (type) => {
    },
    key: "positionDialog"
});
}else{
  this.sendMessage(item,'pinned')
}
}

getMessagesList(){
this.rest_api.getMessagesByProjectId(this.project_id).subscribe((res:any)=>{
  this.messages_list = res;
  this._pinnedMessage = [];
  // this.messages_list.reverse();
  if(this.messages_list.length >0){
  this.messages_list.forEach(ele=>{
    if(ele.pinnedMessage)
    this._pinnedMessage.push(ele)
  })
  this.interval = setInterval(() => {
    this.getMessagesListByInterval();
  }, 2000);
  setTimeout(()=>{
      var objDiv = document.getElementById("message-body");
      objDiv.scrollTop = objDiv.scrollHeight;
    },100)
  }
})
}

getMessagesListByInterval(){
  this.rest_api.getMessagesByProjectId(this.project_id).subscribe((res:any)=>{
    this.messages_list = res;
    this._pinnedMessage = [];
    // this.messages_list.reverse();
    if(this.messages_list.length >0){
    this.messages_list.forEach(ele=>{
      if(ele.pinnedMessage)
      this._pinnedMessage.push(ele)
    })
    }
  })
  }

onCreateTask() {
this.createTaskOverlay = true;
}

closeCreateTaskOverlay(event) {
this.createTaskOverlay = event;
}

truncateDesc(data){
if(data && data.length > 150)
  return data.substr(0,150)+'...';
return data;
}

onReadMoreHide(){
this.isReadmoreShow = ! this.isReadmoreShow
}

openDocumentScreen(){
this.router.navigate(['/pages/projects/document'],{queryParams:{project_id:this.project_id,"project_name":this.projectDetails.projectName}});
}

userFirstValues(firstName,lastName){
return firstName.charAt(0)+lastName.charAt(0);
}

 replyMessage(message){
this.replay_msg=message;
// this.el.nativeElement;
// var element = document.querySelector('.selected-order');
// element.scrollIntoView({behavior: "auto",block: "center", inline: "nearest"});
}

scrollTomain(message,type){
  console.log(message)
  type == "replyMessage"? this.selectedItem = message.rmId: this.selectedItem = message.id
// this.selectedItem = message.rmId
setTimeout(()=>{
  this.selectedItem =''
},200)
}

onClearReply(){
this.replay_msg = null;
}

navigateToCreateDocument(){
let objectKey;
let key;
if(this.selected_folder.dataType != 'folder'){
  this.messageService.add({severity:'info', summary: 'Info', detail: 'Please select Folder'});
  return
}
// if(this.selected_folder.parent == undefined){
//   key= String(this.files.length+1)
// }else{
  objectKey = this.selected_folder.children ? String(this.selected_folder.children.length+1):"1";
  key= this.selected_folder.key + "-" + objectKey
// }
let req_body = {
  key: key,
  label: "",
  data: "folder",
  ChildId: "1",
  dataType: "folder",
  fileSize: "",
  task_id: "",
  projectId: this.project_id,
  url : this.router.url,
  projectName:this.projectDetails.projectName
};
// console.log(req_body)
this.router.navigate(['pages/projects/document-editor'],
{ queryParams: { id:btoa(JSON.stringify(req_body)) } })
}

onDeactivate(field){
this[field].deactivate();
}

inplaceActivate(field,activeField) {
if(activeField != this.active_inplace)
if(this.active_inplace) this[this.active_inplace].deactivate()
// this.active_inplace='';
this.active_inplace = activeField
  // this[activeField].activate();
this[field] = this.projectDetails[field];
this.isEditDesc = false;
}

onUpdateDetails(field) {
  this.projectDetails[field] = this[field];
  this.updateprojectDetails();
  // this.onDeactivate(field);
  this[this.active_inplace].deactivate();
}

getAllCategories() {    // get all categories list for dropdown
this.spinner.show();
this.rest_api.getCategoriesList().subscribe(res => {
let categoryList:any = res;
this.categories_list=categoryList.data.sort((a, b) => (a.categoryName.toLowerCase() > b.categoryName.toLowerCase()) ? 1 : ((b.categoryName.toLowerCase() > a.categoryName.toLowerCase()) ? -1 : 0));
})
}

onUpdateDesc() {
this.projectDetails.projectPurpose = this.project_desc_edit.toString();
this.updateprojectDetails();
this.project_desc = this.project_desc_edit;
this.isEditDesc = false;
}

onClickToEditDesc(){
this.isEditDesc = true;
this.project_desc_edit = this.project_desc
if(this.active_inplace) this[this.active_inplace].deactivate()
}

onDeactivateEdit(){
this.isEditDesc = false;
}

getTheExistingUsersList(tab_index){
let resp_data:any[]=[];
this.rest_api.getusersListByProjectId(this.project_id).subscribe((res:any)=>{
  resp_data=res;
  this.existingUsersList = [];
  this.non_existUsers = [];
  this.users_list.forEach(item2 => {
    if(resp_data.find((projectResource:any) => item2.user_email==projectResource.userId)==undefined)
      this.non_existUsers.push(item2);
    else
      this.existingUsersList.push(item2);
  })
  this.users_tableList = this.non_existUsers
  resp_data.forEach(element => {
    this.existingUsersList.forEach(ele=>{
      if(element.userId == ele.user_email)
        ele["taskCount"]=element.taskCount?element.taskCount:0
    })
  });
  this.onUsersTab(tab_index?tab_index:0);
})
}
snapShotDetails(){
let res_data=[]
this.rest_api.getSnapshotd(this.project_id).subscribe((data:any)=>{
  res_data = data
  this.spinner.hide();
 if(res_data.length>0)
  this.snapshotDatails=data[0]
})
}

navigateToBPMN(){
let params_object= {
  ntype: "bpmn",
  projectId:this.project_id,
  projectName:this.projectDetails.project_name,
  navigateTo:"projectDetails"
}
if(this.projectDetails.correlationID){
  params_object["bpsId"]= this.projectDetails.correlationID.split(":")[0],
  params_object["ver"]= this.projectDetails.correlationID.split(":")[1]
}else{
let selectedBpmn=this.selected_process_names.find(each=>each.processId == this.projectDetails.process).correlationID
  params_object["bpsId"]= selectedBpmn.split(":")[0],
  params_object["ver"]= selectedBpmn.split(":")[1]
}
this.router.navigate(["pages/businessProcess/uploadProcessModel"], {
  queryParams: params_object
});
}

onCloseFolderOverlay(){
this.isFile_upload_dialog = false;
}

createFolder(){
  if(this.selected_folder.dataType != 'folder'){
    this.messageService.add({severity:'info', summary: 'Info', detail: 'Please select Folder'});
    return
  }
this.isDialog = true;
this.isFile_upload_dialog=false;
}

onCreateFolderDoc(type){
this.isFile_upload_dialog = true;
type=='folder'?this.selectedType="createFolder":this.selectedType="document"
}

getTheListOfFolders(){
let res_data:any=[];
this.files=[];
this.rest_api.getListOfFoldersByProjectId(this.project_id).subscribe(res=>{
    res_data=res
    res_data.map(data=> {
      if(data.dataType=='folder'){
        data["children"]=[]
      }
      return data
    })

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
        node['collapsedIcon']=  "pi pi-folder"
        node["expandedIcon"]  ="pi pi-folder-open"
    }else{
      node['icon']=  "pi pi-file"
    }
    this.nodeMap[obj.key] = node;
    if (obj.key.indexOf('-') === -1) {
      this.files.push(node);
    } else {
      let parentKey = obj.key.substring(0, obj.key.lastIndexOf('-'));
      let parent = this.nodeMap[parentKey];
      if (parent) {
        if(parent.children)
        parent.children.push(node);
      }
    }
  }
  this.files.sort((a, b) => parseFloat(a.key) - parseFloat(b.key));
})
}

saveFolder(){
  let key
  if(this.selected_folder){
if(this.selected_folder.dataType != 'folder'){
  this.messageService.add({severity:'info', summary: 'Info', detail: 'Please select Folder'});
  return
}
  let objectKey = this.selected_folder.children ? String(this.selected_folder.children.length+1):"1";
  key= this.selected_folder.key + "-" + objectKey;
}else{
  key = "1"
}


let req_body = [{
  key: key,
  label: this.entered_folder_name,
  data: "folder",
  ChildId: "1",
  dataType: "folder",
  fileSize: "",
  task_id: "",
  projectId: this.project_id
}];
this.spinner.show();
// this.isDialog=false;
this.rest_api.createFolderByProject(req_body).subscribe(res=>{
  this.getTheListOfFolders();
  this.spinner.hide();
  this.isDialog=false;
  this.entered_folder_name=''
  this.messageService.add({severity:'success', summary: 'Success', detail: 'Folder Created Successfully !!'});
},err=>{
  this.spinner.hide();
  this.messageService.add({severity:'error', summary: 'Error', detail: "Failed to create !"});
})
}

truncateValue(replyMessage) {
  if (replyMessage && replyMessage.length > 21)
    return replyMessage.substr(0, 20) + "...";
  return replyMessage;
}

onFilteredUsers(usernames: string[]) {
  // this.messageUsersList.toggle({});
  this.filteredUsers = this.existingUsersList.filter(user => {
    if(usernames.length>0)
    {
      console.log(usernames[0])
      let username= user.firstName.toLowerCase()+" "+user.lastName.toLowerCase();
      console.log(username)
      if(username.toLocaleLowerCase().startsWith(usernames[0].toLocaleLowerCase()))
      {
        console.log(username)
        return username;
      } 
    }
  });
  console.log(this.filteredUsers)
  if(this.filteredUsers.length>0){
    this.showUserList = true;
  }else{
    this.showUserList = false;
  }
  // if(this.filteredUsers.length>0){
  //   const messageInput = document.getElementById('message-input') as HTMLInputElement;
  //   messageInput.value = messageInput.value.replace(/@\w+/, `${this.filteredUsers[0].fullName}`);
  // }
}


addUserInChat(user:any)
{
    const messageInput = document.getElementById('message-input') as HTMLInputElement;
    // messageInput.value = messageInput.value.replace(/@\w+/, `<strong class="icon-color">${user.fullName}</strong>`);
    messageInput.value = messageInput.value.replace(/@\w+/, `${user.fullName}`);
    this.showUserList=false;
}

onCancel(){
  this.checkBoxselected=[];
}

ngOnDestroy() {
  clearInterval(this.interval);
}

truncatemessage(data){
  if(data && data.length > 66)
    return data.substr(0,65)+'...';
  return data;
}

onKeyUp(event: KeyboardEvent) {
  // const inputText = (event.target as HTMLInputElement).value;
  // const atIndex = inputText.lastIndexOf('@');
  // if (atIndex !== -1) {
  //   this.filteredUsers = this.existingUsersList;
  //   this.showUserList = true;
  // } else {
  //   this.showUserList = false;
  // }
}

onMentionSelect(item: any) {
  // return `<strong class="chip">${item["fullName"]}</strong>`;
  return  "@"+item["fullName"]+" ";
}

public htmlCode: string;
public htmlDoc: HTMLElement;

itemSelected(event: any) {
  setTimeout(() => {
    this.htmlDoc = document.getElementById('my-content');
    this.htmlDoc.innerHTML = this.htmlDoc.innerHTML.replace(
       event["fullName"],
      //  '<a href="">'+ event["fullName"] + '</a>'
      // '<span class="icon-color">' + event["fullName"] + '</span>&nbsp;'
      '<b>'+ event["fullName"]+'</b>&nbsp;'
    );
    // put the cursor to the end of field again...
    this.selectEnd();
  }, 10);
}

selectEnd() {
  let range, selection;
  range = document.createRange();
  range.selectNodeContents(this.htmlDoc);
  range.collapse(false);
  selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

onKeyUpDiv(){
  console.log(document.getElementById("my-content").innerHTML)
}

  getRecentactivities() {
    this.columns_list_activities = [
      {ColumnName: "replacedText",DisplayName: "Activity",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
      {ColumnName: "lastModifiedUsername",DisplayName: "Resource Name",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true},
      {ColumnName: "lastModifiedTimestamp_new",DisplayName: "Last Modified", ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true}
    ];
  this.rest_api.recentActivities(this.project_id).subscribe((data:any)=>{
    this.recentActivityList=data;
    this.recentActivityList.map(item =>{
      // item["lastModifiedTimestamp_new"] = moment(item["lastModifiedTimestamp"]).format("lll");
      // const formattedDate  = new Date(item["lastModifiedTimestamp"]);
      item["lastModifiedTimestamp_new"] = new Date(item["lastModifiedTimestamp"]);
      item["replacedText"] = this.replaceEmailsWithNames(item["activity"], this.users_list);
      return item
    })
    console.log(this.recentActivityList)
  }) 
  }

  replaceEmailsWithNames(message, users): string {
    let replacedText = message;
    // Find all email addresses in the message text
    const regex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
    const emails = message.match(regex);
    if (emails) {
      // Replace each email address with the associated user's name
      for (const email of emails) {
        const user = users.find(u => u.user_email === email);
        if (user) {
          replacedText = replacedText.replace(email, `${user.fullName} `);
        }
      }
    }
    return replacedText;
  }

}

