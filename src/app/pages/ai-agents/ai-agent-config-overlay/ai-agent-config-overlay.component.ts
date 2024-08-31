import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PredefinedBotsService } from '../../services/predefined-bots.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { Inplace } from "primeng/inplace";

@Component({
  selector: 'app-ai-agent-config-overlay',
  templateUrl: './ai-agent-config-overlay.component.html',
  styleUrls: ['./ai-agent-config-overlay.component.css']
})
export class AiAgentConfigOverlayComponent implements OnInit {
  @ViewChild("inplace") inplace!: Inplace;
  processName:string;
  currentPage = 1;
  fieldsPerPage = 30;
  formFields = [];
  predefinedBotsForm: FormGroup;
  pages: number[] = [];
  nodes: number[] = [];
  isShowForm:boolean=false;
  items: MenuItem[]=[];
  activeIndex: number = undefined;
  params:any={};
  scheduleOverlayFlag: Boolean = false;
  schedulerComponentInput: any;
  private subscription: Subscription;
  private predefinedBot_id:any;
  public predefinedBot_name:any;
  public scheduler_data :any;
  duplicateAttributes:any=[];
  isJobDescrption_error:boolean = false;
  validate_errorMessage=[];
  isValidateLoader:boolean = false;
  job_Descrption_error:boolean = false;
  isJobDescrptionValid:boolean= false;
  description_type:string='textarea';
  selectedFiles:any[]=[];
  jobDescription:any={};
  predefinedBot_uuid:any;
  selectedOption:any={};
  predefinedBot_schedulerRequired:boolean;
  filePathValues:any[]=[];
  checkedOptions: string[] = [];
  agent_uuid:any;
  isEdit:boolean = false;
  attachmentMap:any[]=[]
  schedulerValue:any;
  fieldInputKey:any;
  capturedFileIds:any=[];
  progressBarItems = [
    { label: 'Intiated' },
    { label: 'Agent In Progress' },
    { label: 'Generating Output' },
    { label: 'Completed' }
  ];
  disabledFormFields: any[] = [];


  @ViewChild('cardContainer', { static: false }) cardContainer: ElementRef;
  currentActivePage = 1;
  itemsPerPageCount = 4;
  totalNumberOfPages: number;
  pageDotNumbers: number[];

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private rest_service : PredefinedBotsService,
    private toaster: ToasterService,
    private toastMessages: toastMessages,
    private spinner : LoaderService,
    private confirmationService: ConfirmationService,
    private toastMessage:toastMessages

    ) {
      this.route.queryParams.subscribe(params=>{
        this.params=params
        this.predefinedBot_id= this.params.id
      })
    }

  ngOnInit(): void {
    this.predefinedBotsForm = this.fb.group({});
    // this.getData();

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchAllFields() {
    this.rest_service.getPredefinedBotAttributesList(this.params.id, this.params.agentId).subscribe((res:any)=>{
      console.log("res: ", res)
      this.agent_uuid = res.predefinedBotUUID
      this.fieldInputKey = {};
      console.log("Form Attributes: ", res.data)
      this.spinner.hide();
      let obj = { attributeRequired: true, maxNumber: 100, minMumber: 0, placeholder: "Enter Agent Name", preAttributeLable: "Automation Agent Name", preAttributeName: "botName", preAttributeType: "text", visibility: true }
      this.formFields.push(obj);
      res.data.forEach(item => {
        if (item.preAttributeType === 'file') {
          this.fieldInputKey[item.preAttributeName] = item.preAttributeName;
        }
      });
      this.formFields.push(...res.data
        .filter(item => !item.duplicate)
        .map(item => {
            if (item.preAttributeName === 'RecruitmentOne_email_jobDescrption') {
                return { ...item, isValidateRequired: true };
            } else {
                return item;
            }
        })
    );
      this.duplicateAttributes.push(...res.data.filter(item=>  item.duplicate))
      this.predefinedBot_name = res.predefinedBotName;
      this.processName = this.predefinedBot_name +" Agent"
      this.predefinedBot_uuid = res.predefinedBotUUID
      this.predefinedBot_schedulerRequired = res.isSchedulerRequired
      this.generateDynamicForm();      
    },err=>{
      this.spinner.hide();
      this.toaster.showError(this.toastMessages.apierror)
    })
    
  }

  onSave() {
    
  }

  generateDynamicForm(){
    const fieldsGroup = {};
    this.formFields.forEach(field => {
      console.log("field",field)
      if(field.attributeRequired){
        if(field.preAttributeType == "checkbox"){
          fieldsGroup[field.preAttributeName] = [false, Validators.required];
        }else{
          fieldsGroup[field.preAttributeName] = ["", Validators.required];
        }
      }else{
        if(field.preAttributeType == "checkbox"){
          fieldsGroup[field.preAttributeName] = [false];
        }else{
          fieldsGroup[field.preAttributeName] = [''];
        }
      }
    });
    this.predefinedBotsForm.setControl('fields', this.fb.group(fieldsGroup));
    console.log("predefinedBotsForm",this.predefinedBotsForm)
    this.subscription = this.predefinedBotsForm.get('isScheduleBot').valueChanges.subscribe(checked => {
          this.predefinedBotsForm.get('schedule').enable({onlySelf: checked, emitEvent: false});
      });
  }

  fetchAllFieldsToUpdateData() {
    // this.spinner.show();
    this.rest_service.getAgentAttributeswithData(this.params.id,this.params.agentId).subscribe((res:any)=>{
      const keyMap = res.data.reduce((acc, field) => ({ ...acc, [field.preAttributeName]: field.preAttributeName }), {});
      res.attachments.forEach((attachment) => {
        const fieldName = keyMap[attachment.key];
        this.attachmentMap[fieldName] = [...(this.attachmentMap[fieldName] || []), ...attachment.attList.map((att) => ({ key: fieldName, originalFileName: att.originalFileName, attachmentId: att.id }))];
      });
      this.spinner.hide();
      this.agent_uuid = res.predefinedBotUUID
      console.log("Form Attributes: ", res.data)
      this.spinner.hide();
      let obj = { attributeRequired: true, maxNumber: 100, minMumber: 0, placeholder: "Enter Agent Name", preAttributeLable: "Automation Agent Name", preAttributeName: "botName", 
                  preAttributeType: "text", visibility: true, preAttributeValue: res.aiAgentName}
      this.formFields.push(obj);
      this.formFields.push(...res.data
        .filter(item => !item.duplicate)
        .map(item => {
            if (item.preAttributeName === 'RecruitmentOne_email_jobDescrption') {
                return { ...item, isValidateRequired: true };
            } else {
                return item;
            }
        })
    );
      this.duplicateAttributes.push(...res.data.filter(item=>  item.duplicate))
      this.predefinedBot_name = res.predefinedBotName;
      this.processName =this.predefinedBot_name +" Agent"
      this.predefinedBot_uuid = res.predefinedBotUUID
      this.predefinedBot_schedulerRequired = res.isSchedulerRequired
      this.predefinedBotsForm.get('isScheduleBot').setValue(this.predefinedBot_schedulerRequired)
      if(this.predefinedBot_schedulerRequired) this.schedulerValue = res.schedule
      if (this.predefinedBot_schedulerRequired) {
        this.predefinedBotsForm.get("scheduleTime").setValue(this.convertSchedule(this.schedulerValue,true))
      }
      })
  }



  // loopTrackBy(index, term) {
  //   return index;
  // }
  get currentPageFields() {
    const startIndex = (this.currentPage - 1) * this.fieldsPerPage;
    const endIndex = startIndex + this.fieldsPerPage;
    return this.formFields.slice(startIndex, endIndex);
  }

 
  
 


  navigateForm(){
    this.isShowForm=!this.isShowForm;
  }

  updateProgress() {
    if (this.activeIndex < this.items.length - 1) {
      this.activeIndex++;
    } else {
      this.activeIndex = 0; // Reset or stop as needed
    }
  }


  captureAgentIdAndFileIds(agentId: number, fileIds: number[]) {
    const payload = {
      ids: fileIds
    };
    this.rest_service.captureAgentIdandfileIds(agentId, payload).subscribe(res => {
      console.log("Captured agent ID and file IDs:", res);
    }, err => {
      this.spinner.hide();
      this.toaster.showError(this.toastMessages.apierror);
      console.error("Error capturing agent ID and file IDs:", err);
    });
  }


  readEmitValue(data){
    this.scheduler_data = data;
    this.scheduleOverlayFlag = false;
    data.processName = this.predefinedBotsForm.value.fields.botName
    this.predefinedBotsForm.get("scheduleTime").setValue(this.convertSchedule(data,false))
  }

  convertSchedule(scheduleData1,isEdit: boolean ) {
    let scheduleData = scheduleData1;
    if(isEdit) {
      scheduleData = JSON.parse(scheduleData1);
    }

    // this.describeScheduleType(scheduleData[0]);
    const startDateArray = scheduleData[0]?.startDate?.split(',').map(Number);
    const endDateArray = scheduleData[0]?.endDate?.split(',').map(Number);
    const interval = scheduleData[0]?.scheduleInterval;

      // Formatting start date
      const startDate = new Date(startDateArray[0], startDateArray[1] - 1, startDateArray[2], startDateArray[3], startDateArray[4]);
      const formattedStartDate = startDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });

      // Formatting end date
      const endDate = new Date(endDateArray[0], endDateArray[1] - 1, endDateArray[2], endDateArray[3], endDateArray[4]);
      const formattedEndDate = endDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });

      // Converting interval to human-readable format
      const intervalParts = interval.split(' ');
      const frequency = intervalParts[1];

      // Creating a string for the desired format
      return `${formattedStartDate} - ${formattedEndDate}`;
  } 

  onRadioChange(value: string,option_item) {
    console.log(value,option_item)
    this.selectedOption = option_item
    let array = this.getArrayValues(option_item.field)
    array.forEach(each=>{
      this.predefinedBotsForm.get("fields."+each).setValue("")
      this.formFields.find(item=>item.preAttributeName == each && item.preAttributeType != value).visibility =false
      this.formFields.find(item=>item.preAttributeName == each && item.preAttributeType == value).visibility =true
    })
  }


  onCheckboxChange(event, option:any,type:any) {
    let checkbox:any
    let checkValue:any
    if(type == "onchange"){
        checkbox = event.target as HTMLInputElement;
        checkValue = checkbox.checked;
    }else{
      checkValue = event;
    }
    const validJsonStr = option.field.replace(/'/g, '"');
    // const array = JSON.parse(validJsonStr);
    let array;
    try {
      array = JSON.parse(validJsonStr);
    } catch (e) {
      console.error("Parsing error:", e);
    }

    if (checkValue) {
      this.checkedOptions.push(option.value);
    } else {
      const index = this.checkedOptions.indexOf(option.value);
      if (index !== -1) {
        this.checkedOptions.splice(index, 1);
      }
    }
    console.log(this.checkedOptions);


    if (Array.isArray(array)) {
      if (checkValue) {
        // formArray.push(this.fb.control(label));
        array.forEach((element: any) => {
          const field = this.formFields.find(item => item.preAttributeName === element);
          if (field) {
            field.visibility = true;
            field.attributeRequired =true;
            this.updateValidators(element)
          }
        });
      } else {
        array.forEach(element => {
          const field = this.formFields.find(item => item.preAttributeName === element);
          if (field) {
            field.visibility = false;
            field.attributeRequired =false;
            this.clearValidators(element);
          }
        });
      }
    }
  }

 

  getArrayValues(option){
    const validJsonStr = option.replace(/'/g, '"');
    // const array = JSON.parse(validJsonStr);
    let array = [];
    try {
      array = JSON.parse(validJsonStr);
    } catch (e) {
      console.error("Parsing error:", e);
    }
    return array;
  }

  updateValidators(item){
    this.predefinedBotsForm.get("fields."+item).setValidators(Validators.compose([Validators.required]));
    this.predefinedBotsForm.get("fields."+item).updateValueAndValidity(); 
  }

  clearValidators(item){
    this.predefinedBotsForm.get("fields."+item).clearValidators(); 
    this.predefinedBotsForm.get("fields."+item).updateValueAndValidity();
  }

  onRadioChangeUpdateFlow(value: string,option_item) {
    console.log(value,option_item)
    this.selectedOption = option_item
    let array = this.getArrayValues(option_item.field)
    array.forEach(each=>{
      this.formFields.find(item=>item.preAttributeName == each && item.preAttributeType != value).visibility =false
      this.formFields.find(item=>item.preAttributeName == each && item.preAttributeType == value).visibility =true
    })
  }

// getData(){
//   this.rest_service.getDisabledFields().subscribe((res:any)=>{
//     console.log("GET-DISABLE-FIELDS", res);
//     this.disabledFields = res.data;
//     this.setupFormControls()
//   })
// }
getData(productId,subAgentId,runId) {
  console.log('GET-DISABLE-FIELDS',productId,subAgentId,runId);
  this.rest_service.getDisabledFields(productId,subAgentId,runId).subscribe((res: any) => {
    console.log('GET-DISABLE-FIELDS', res);
    this.disabledFormFields = res.data.data;
    this.createFormControls();
  });
}

createFormControls() {
  const formControls = {};
  this.disabledFormFields.forEach((field: any) => {
    let value = field.preAttributeValue;

    // Handle checkbox
    if (field.preAttributeType === 'checkbox') {
      value = field.preAttributeValue === 'true';
    }

    // Handle radio and dropdown
    if (field.preAttributeType === 'radio' || field.preAttributeType === 'dropdown') {
      value = field.preAttributeValue || '';
    }

    const control = this.fb.control(
      { value: value, disabled: true },
      field.attributeRequired ? Validators.required : null
    );
    formControls[field.preAttributeName] = control;
  });

  this.predefinedBotsForm = this.fb.group(formControls);
  console.log('Form value after initialization:', this.predefinedBotsForm.value);
}
// Function to track by unique identifier to optimize ngFor
loopTrackBy(index: number, field: any): number {
  return field.id;
}


}
