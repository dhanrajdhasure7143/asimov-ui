import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { DataTransferService } from 'src/app/pages/services/data-transfer.service';

@Component({
  selector: 'app-rpa-sdk-form',
  templateUrl: './rpa-sdk-form.component.html',
  styleUrls: ['./rpa-sdk-form.component.css']
})
export class RpaSdkFormComponent implements OnInit {
  @Input() isupdateform:boolean;
  @Input() hideLabels:boolean;
  @Input() updatetaskDetails:any ={};
  @Input() hideDraftButton: boolean = false;
  @Output() closeOverlay = new EventEmitter<any>();
  @Output() taskSaved = new EventEmitter<void>();
  categoryList: any;
  public customTaskForm: FormGroup;
  public Credupdateflag: Boolean;
  public Creddeleteflag: Boolean;
  public passwordtype1: Boolean;
  public passwordtype2: Boolean;
  submitted: boolean;
  isLoading: boolean;
  languages : any[] = [];
  categories: any[] = [
    { name: 'Path', key: 'A' },
    { name: 'Code', key: 'M' }
  ];
  showCodeField : boolean = false;
  showPathField : boolean = false;
  users_list:any;
  customTaskNameCheck: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private chanref:ChangeDetectorRef,
    private spinner: LoaderService,
    private toastService : ToasterService,
    private toastMessages: toastMessages,
    private http:HttpClient,
    private dt: DataTransferService,
    private rest_api: RestApiService
    ) {

      this.customTaskForm=this.formBuilder.group({
        customTaskName:["",Validators.compose([Validators.required])],
        languageType:["Java",Validators.compose([Validators.required])],
        executablePath:["",Validators.compose([Validators.required])],
        approver:["",Validators.compose([Validators.required])],
        comments:["",Validators.compose([Validators.required])],
        //temporarly commenting the selectedCategory as it is not in use for now.
        // selectedCategory:["",Validators.compose([Validators.required])],
        // executablePath:[""],
        code:[""],

        // temporarly commenting the input and output reference fields as it is not in use for now.
        // inputReference:["",Validators.compose([Validators.required])],
        // outputReference:["",Validators.compose([Validators.required])]
    })

      this.Credupdateflag=false;
      this.Creddeleteflag=false;
     }

  ngOnInit(): void {
  // this.spinner.show();
  this.getUsersList();
   this.languages = [
    {language:"Java"},
  //  {language:"Python"},
  //  {language:"Javascript"}
  ];
   this.categories
  }

  ngOnChanges(){
    if (this.isupdateform) {
      this.customTaskForm.get("customTaskName").setValue(this.updatetaskDetails.customTaskName)
      this.customTaskForm.get("languageType").setValue(this.updatetaskDetails.languageType)
      this.customTaskForm.get("executablePath").setValue(this.updatetaskDetails.executablePath);
      // this.customTaskForm.get("id").setValue(this.updatetaskDetails.id)
      this.customTaskForm.get("approver").setValue(this.updatetaskDetails.approvedBy)
      this.customTaskForm.get("comments").setValue(this.updatetaskDetails.comments)
      // temporarly commenting the if and else condition as it is not in use for now.
      // if(this.updatetaskDetails.executablePath){
      //   this.customTaskForm.get("selectedCategory").setValue("Path");
      //   this.radioChange("Path")
      // }
      // if(this.updatetaskDetails.code){
      //   this.customTaskForm.get("selectedCategory").setValue("Code");
      //   this.radioChange("Code")
      // }
      // this.customTaskForm.get("executablePath").setValue(this.updatetaskDetails.executablePath)
      this.customTaskForm.get("code").setValue(this.updatetaskDetails.code)

      // temporarly commenting the input and output reference fields as it is not in use for now.
      // this.customTaskForm.get("inputReference").setValue(this.updatetaskDetails.inputReference)
      // this.customTaskForm.get("outputReference").setValue(this.updatetaskDetails.outputReference)
    }
  }
 
  getCategories() {
    this.rest_api.getCategoriesList().subscribe(data => {
      let response: any = data;
      this.categoryList = response.data;
    })
  }

  radioChange(event : any){
    if(event == "Path"){
      this.showPathField = true;
      this.showCodeField = false
      this.customTaskForm.get('executablePath').setValidators([Validators.required]);
      this.customTaskForm.get('executablePath').updateValueAndValidity();
      this.customTaskForm.get('code').clearValidators();
      this.customTaskForm.get('code').updateValueAndValidity();
    } else {
      this.showPathField = false;
      this.showCodeField = true
      this.customTaskForm.get('code').setValidators([Validators.required]);
      this.customTaskForm.get('code').updateValueAndValidity();
      this.customTaskForm.get('executablePath').clearValidators();
      this.customTaskForm.get('executablePath').updateValueAndValidity();
    }
  }

  resetCustomTasks(){
    this.customTaskForm.reset();
  }

  saveCustomTasks(data:boolean){
    this.spinner.show();
    const approverEmail = this.customTaskForm.value.approver;
    const selectedApprover = this.users_list.find(user => user.user_email === approverEmail);
    const approverFullName = selectedApprover ? selectedApprover.fullName : '';
    let reqBody = {
      "code": "",
      "customTaskName": this.customTaskForm.value.customTaskName,
      "executablePath": this.customTaskForm.value.executablePath,
      "languageType": this.customTaskForm.value.languageType,
      "approvedBy": approverEmail,
      "comments": this.customTaskForm.value.comments,
      "approverName": approverFullName,
      "createdUser": localStorage.getItem("firstName") + ' ' + localStorage.getItem("lastName"),
      "version":0,
      "status": data?"Pending":"Draft",
    }
    this.rest_api.saveCustomTask(reqBody).subscribe((data:any)=>{
      this.closeOverlay.emit(true);
      this.taskSaved.emit();
      this.spinner.hide();
      this.toastService.showSuccess(this.customTaskForm.value.customTaskName,'create');
    },err=>{
    this.spinner.hide();
    this.toastService.showError(this.toastMessages.saveError);
    });
  }
  
  updateCustomTasks(staus:boolean){
    this.spinner.show();
    const approverEmail = this.customTaskForm.value.approver;
    const selectedApprover = this.users_list.find(user => user.user_email === approverEmail);
    const approverFullName = selectedApprover ? selectedApprover.fullName : '';
    let reqBody = {
      "id": this.updatetaskDetails.status== "Approved"? "":this.updatetaskDetails.id,
      "code": "",
      "customTaskName": this.customTaskForm.value.customTaskName,
      "executablePath": this.customTaskForm.value.executablePath,
      "languageType": this.customTaskForm.value.languageType,
      "approvedBy": this.customTaskForm.value.approver,
      "approverName": approverFullName,
      "comments": this.customTaskForm.value.comments,
      "status": staus?"Pending":"Draft",
      "customTaskId": this.updatetaskDetails.customTaskId,
      "createdBy":this.updatetaskDetails.createdBy,
      "version":this.updatetaskDetails.version,
      "createdAt":this.updatetaskDetails.createdAt
    }
    this.rest_api.updateCustomTasks(reqBody).subscribe((data : any) =>{
      this.taskSaved.emit();
      this.spinner.hide();
      this.closeOverlay.emit(true);
      this.toastService.showSuccess(this.customTaskForm.value.customTaskName,'update');
    },err=>{
      this.spinner.hide();
      this.toastService.showError(this.toastMessages.updateError);
    })
  }
  updateApproval(staus:boolean) {
    this.spinner.show();
    const approverEmail = this.customTaskForm.value.approver;
    const selectedApprover = this.users_list.find(user => user.user_email === approverEmail);
    const approverFullName = selectedApprover ? selectedApprover.fullName : '';
    let reqBody = {
      // "id": this.updatetaskDetails.status == "Approved" ? "" : this.updatetaskDetails.id,
      "id": this.updatetaskDetails.status == "Approved" || this.updatetaskDetails.status == "Pending" || this.updatetaskDetails.status == "Draft" ? this.updatetaskDetails.id:"",
      "code": "",
      "customTaskName": this.customTaskForm.value.customTaskName,
      "executablePath": this.customTaskForm.value.executablePath,
      "languageType": this.customTaskForm.value.languageType,
      "approvedBy": this.customTaskForm.value.approver,
      "approverName": approverFullName,
      "comments": this.customTaskForm.value.comments,
      "status": staus ? "Pending" : "Draft",
      "customTaskId": this.updatetaskDetails.customTaskId,
      "createdBy": this.updatetaskDetails.createdBy,
      "version":this.updatetaskDetails.version,
    }
    this.rest_api.updateCustomTasks(reqBody).subscribe((data: any) => {
      this.taskSaved.emit();
      this.spinner.hide();
      this.closeOverlay.emit(true);
      this.toastService.showSuccess(this.customTaskForm.value.customTaskName, 'update');
    }, err => {
      this.spinner.hide();
      this.toastService.showError(this.toastMessages.updateError);
    })
  }
  cancelUpdate(){
    this.closeOverlay.emit(true);
  }

  getUsersList() {
    this.isLoading =true
    this.dt.tenantBased_UsersList.subscribe((res) => {
      if (res) {
        this.users_list = res;
      }
      this.isLoading = false
    });
  }

  // checkSdkTaskName() {
  //   let sdkTaskName = this.customTaskForm.get("customTaskName").value;
  //   this.rest_api.sdkCustomTaskNameCheck(sdkTaskName).subscribe((data) => {
  //     this.customTaskNameCheck = !this.isupdateform ? (this.customTaskForm["customTaskName"] !== sdkTaskName ? !data : false) : !data;
  //   },
  //     (error) => {
  //       this.customTaskNameCheck = true;
  //     }
  //   );
  // }

  checkSdkTaskName() {
    let sdkTaskName = this.customTaskForm.get("customTaskName").value;
    this.rest_api.sdkCustomTaskNameCheck(sdkTaskName).subscribe((data: any) => {
      if (data.isNameExists) {
        this.customTaskNameCheck = true;
      } else {
        this.customTaskNameCheck = false;
      }
    },(error) => {
        this.customTaskNameCheck = true;
      }
    );
  }

//  checkSdkTaskName() {
//   let sdkTaskName = this.customTaskForm.get("customTaskName").value;
//   let taskId = ''; // Get the ID of the current task being edited, if available

//   // Logic to get the task ID, replace it with your actual implementation
//   if (this.isupdateform) {
//     taskId = this.updatetaskDetails.taskId; // Replace 'taskId' with the actual property name for the task ID
//   }

//   this.rest_api.sdkCustomTaskNameCheck(sdkTaskName).subscribe(
//     (data: any) => {
//       if (data.isNameExists && (!this.isupdateform || (this.isupdateform && taskId !== data.taskId))) {
//         // SDK custom task name already exists and doesn't belong to the current task being edited
//         this.customTaskNameCheck = true;
//       } else {
//         // SDK custom task name doesn't exist or belongs to the current task being edited
//         this.customTaskNameCheck = false;
//       }
//     },
//     (error) => {
//       // Handle error from the API call
//       this.customTaskNameCheck = true;
//     }
//   );
// }


}
