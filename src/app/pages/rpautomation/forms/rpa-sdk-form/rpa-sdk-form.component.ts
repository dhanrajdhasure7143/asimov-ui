import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-rpa-sdk-form',
  templateUrl: './rpa-sdk-form.component.html',
  styleUrls: ['./rpa-sdk-form.component.css']
})
export class RpaSdkFormComponent implements OnInit {
  @Input() isupdateform:boolean;
  @Input() hideLabels:boolean;
  @Input() updatetaskDetails:any;
  @Output() closeOverlay = new EventEmitter<any>();
  categoryList: any;
  public customTaskForm: FormGroup;
  public Credupdateflag: Boolean;
  public Creddeleteflag: Boolean;
  public passwordtype1: Boolean;
  public passwordtype2: Boolean;
  submitted: boolean;
  languages : any[] = [];
  categories: any[] = [
    { name: 'Path', key: 'A' },
    { name: 'Code', key: 'M' }
  ];
  showCodeField : boolean = false;
  showPathField : boolean = false;
  constructor(private api:RestApiService,
    private formBuilder: FormBuilder,
    private chanref:ChangeDetectorRef,
    private spinner: LoaderService,
    private toastService : ToasterService,
    private toastMessages: toastMessages,
    private http:HttpClient,

    ) {

      this.customTaskForm=this.formBuilder.group({
        customTaskName:["",Validators.compose([Validators.required])],
        languageType:["Java",Validators.compose([Validators.required])],
        executablePath:["",Validators.compose([Validators.required])],
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
      this.customTaskForm.get("id").setValue(this.updatetaskDetails.id)
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
    this.api.getCategoriesList().subscribe(data => {
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
    let reqBody = {
      "code": "",
      "customTaskName": this.customTaskForm.value.customTaskName,
      "executablePath": this.customTaskForm.value.executablePath,
      "languageType": this.customTaskForm.value.languageType,
      "version":1,
     
      "approvalStatus": data?"Pending":"draft",
    }
    debugger
    console.log(data);
    const headers = new HttpHeaders().set("Authorization",`Bearer ${localStorage.accessToken}`)
    .set("Refresh-Token", localStorage.refreshToken)
    .set("Timezone", "Asia/Calcutta");
      this.http.post("http://localhost:8080/rpa-service/sdk-custom/create-sdk-task",reqBody,{headers}).subscribe((data:any)=>{
      this.closeOverlay.emit(true);
      this.spinner.hide();
      this.toastService.showSuccess(this.customTaskForm.value.customTaskName,'create');
    },err=>{
    this.spinner.hide();
    this.toastService.showError(this.toastMessages.saveError);
    });
  }

  updateCustomTasks(staus:boolean){
    this.spinner.show();
    console.log(status)
    debugger
    let reqBody = {
      "id": this.updatetaskDetails.approvalStatus== "Approved"? "":this.updatetaskDetails.id,
      "code": "",
      "customTaskName": this.customTaskForm.value.customTaskName,
      "executablePath": this.customTaskForm.value.executablePath,
      "languageType": this.customTaskForm.value.languageType,
      "approvalStatus": staus?"Pending":"draft",
      "customTaskId": this.updatetaskDetails.customTaskId,
      "createdBy":this.updatetaskDetails.createdBy
      // "version":1,
    }
    console.log(this.updatetaskDetails.id);
    // this.api.updateSdkCustomTasks(this.updatetaskDetails.customTaskId,reqBody).subscribe((data : any) =>{
    const headers = new HttpHeaders().set("Authorization",`Bearer ${localStorage.accessToken}`)
    .set("Refresh-Token", localStorage.refreshToken)
    .set("Timezone", "Asia/Calcutta");
      this.http.put("http://localhost:8080/rpa-service/sdk-custom/update-sdk-task/"+this.updatetaskDetails.id,reqBody,{headers}).subscribe((data:any)=>{   
   this.spinner.hide();
      this.closeOverlay.emit(true);
      this.toastService.showSuccess(this.customTaskForm.value.customTaskName,'update');
    },err=>{
      this.spinner.hide();
      this.toastService.showError(this.toastMessages.updateError);
    })
  }

  cancelUpdate(){
    this.closeOverlay.emit(true);
  }

}
