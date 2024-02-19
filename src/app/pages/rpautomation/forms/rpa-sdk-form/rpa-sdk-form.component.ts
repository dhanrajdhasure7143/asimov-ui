import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';

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
    private toastMessages: toastMessages

    ) {

      this.customTaskForm=this.formBuilder.group({
        inputReference:["",Validators.compose([Validators.required])],
        customTaskName:["",Validators.compose([Validators.required])],
        languageType:["",Validators.compose([Validators.required])],
        selectedCategory:["",Validators.compose([Validators.required])],
        executablePath:[""],
        code:[""],
        outputReference:["",Validators.compose([Validators.required])]
    })

      this.Credupdateflag=false;
      this.Creddeleteflag=false;
     }

  ngOnInit(): void {
  // this.spinner.show();
   this.languages = [{language:"Java"},{language:"Python"},{language:"Javascript"}];
   this.categories
  }

  ngOnChanges(){
    if (this.isupdateform) {
      this.customTaskForm.get("inputReference").setValue(this.updatetaskDetails.inputReference)
      this.customTaskForm.get("customTaskName").setValue(this.updatetaskDetails.customTaskName)
      this.customTaskForm.get("languageType").setValue(this.updatetaskDetails.languageType)
      if(this.updatetaskDetails.executablePath != null){
        this.customTaskForm.get("selectedCategory").setValue("Path");
        this.radioChange("Path")
      }
      if(this.updatetaskDetails.code != null){
        this.customTaskForm.get("selectedCategory").setValue("Code");
        this.radioChange("Code")
      }
      this.customTaskForm.get("executablePath").setValue(this.updatetaskDetails.executablePath)
      this.customTaskForm.get("code").setValue(this.updatetaskDetails.code)
      this.customTaskForm.get("outputReference").setValue(this.updatetaskDetails.outputReference)
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

  saveCustomTasks(){
    this.spinner.show();
    let reqBody = {
      "code": this.customTaskForm.value.code,
      "customTaskName": this.customTaskForm.value.customTaskName,
      "executablePath": this.customTaskForm.value.executablePath,
      "inputReference": this.customTaskForm.value.inputReference,
      "languageType": this.customTaskForm.value.languageType,
      "outputReference": this.customTaskForm.value.outputReference,
    }
    this.api.createSdkCustomTasks(reqBody).subscribe((data : any) =>{
      this.closeOverlay.emit(true);
      this.spinner.hide();
      this.toastService.showSuccess(this.customTaskForm.value.customTaskName,'create');
    },err=>{
    this.spinner.hide();
    this.toastService.showError(this.toastMessages.saveError);
    });
  }

  updateCustomTasks(){
    this.spinner.show();
    let reqBody = {
      "code": this.customTaskForm.value.code,
      "customTaskName": this.customTaskForm.value.customTaskName,
      "executablePath": this.customTaskForm.value.executablePath,
      "inputReference": this.customTaskForm.value.inputReference,
      "languageType": this.customTaskForm.value.languageType,
      "outputReference": this.customTaskForm.value.outputReference,
      "taskId": this.updatetaskDetails.customTaskId,
    }
    this.api.updateSdkCustomTasks(this.updatetaskDetails.customTaskId,reqBody).subscribe((data : any) =>{
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
