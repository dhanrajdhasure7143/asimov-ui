import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Base64 } from 'js-base64';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ConfirmationService } from "primeng/api";
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';

@Component({
  selector: 'app-rpa-bot-form',
  templateUrl: './rpa-bot-form.component.html',
  styleUrls: ['./rpa-bot-form.component.css']
})
export class RpaBotFormComponent implements OnInit {
  @Output("output") public event= new EventEmitter<any>();
  @Input("isCreateForm") public isCreateForm:any;
  @Input("categoriesList") public categoriesList:any[];
  @Input("botDetails") public botDetails:any;
  @Input("unsavedBot") public unsaved:boolean;
  @Output("unsavedOutput") public unsavedOutput=new EventEmitter<any>();
  @Output() closeFormOverlay = new EventEmitter<any>();
  botForm:FormGroup;
  botNameCheck:any;
  checkBotCategory:boolean=false;
  constructor( 
    private formBuilder:FormBuilder,
    private rest:RestApiService,
    private spinner:LoaderService,
    private cd: ChangeDetectorRef,
    private toastService: ToasterService,
    public confirmationService:ConfirmationService,
    private toastMessages: toastMessages
    ){
      this.botForm = this.formBuilder.group({
        botName: ["",Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern("^[a-zA-Z0-9_-]*$")])],
        department: ["", Validators.required],
        description: ["", Validators.compose([Validators.maxLength(500)])],
        isPredefined: [false]
      });
    }


  ngOnInit(): void {
  }

  ngOnChanges(changes:SimpleChanges){
    this.cd.detectChanges();
    if(!this.isCreateForm && this.botDetails!=undefined){
      this.botForm.get("botName").setValue(this.botDetails["botName"]);
      this.botForm.get("department").setValue(this.botDetails["department"]);
      this.botForm.get("description").setValue(this.botDetails["description"]);
      this.botForm.get("isPredefined").setValue(this.botDetails["isPredefined"]);
      }else{
          if(this.unsaved==true){
            this.botForm = this.formBuilder.group({
              botName: [this.botDetails.botName, Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern("^[a-zA-Z0-9_-]*$")])],
              department: [this.botDetails.department, Validators.required],
              description: [this.botDetails.description, Validators.compose([Validators.maxLength(500)])],
              isPredefined: [this.botDetails.isPredefined]
            });
          } else if(this.categoriesList.length==1){
            this.botForm = this.formBuilder.group({
              botName: ["", Validators.compose([Validators.maxLength(30), Validators.pattern("^[a-zA-Z0-9_-]*$")])],
              department: [this.categoriesList[0].categoryId, Validators.required],
              description: ['', Validators.compose([Validators.maxLength(500)])],
              isPredefined: [false]
            });
            // setTimeout(()=>{
            //   this.botForm.get('department').setValue(this.categoriesList.length==1?this.categoriesList[0].categoryId:'');
            // },100)
          }
        }
  
  }

  onFormSubmit() {
    if (this.isCreateForm)
      this.createBot()
    else
      this.updateBot()
  }

  createBot() {
    let botFormValue = this.botForm.value;
    const botName = this.botForm.value.botName
    if(botFormValue.botName=='' || botFormValue.botName==null)
      this.skipSaveBot()
    else
    {
      this.spinner.show()
      this.rest.createBot(botFormValue).subscribe((response: any) => {
        this.spinner.hide()
        if (response.errorMessage == undefined) {
          this.closeBotForm();
          this.event.emit({ botId: response.botId, case: "create" });
          this.toastService.showSuccess(botName,'create');
        } else {
          this.toastService.showError(response.errorMessage);
          this.event.emit(null);
        }
      }, err => {
        this.spinner.hide();
        this.toastService.showError(this.toastMessages.createError);
        this.event.emit(null);
      })
    }

  }

  updateBot() {
    let botFormValue = { ...this.botForm.value, ...{ botId: this.botDetails.botId } };
    let botName = this.botForm.value.botName;
    this.spinner.show();
    this.rest.modifybotdetails(botFormValue).subscribe((response: any) => {
      if (response.errorMessage == undefined) {
        // this.messageService.add({severity:'success',summary:'Success',detail: `${botName} details updated successfully`}) //response.message+'!'
        this.toastService.showSuccess(botName,'update');
        this.closeBotForm();
        this.spinner.hide();
        this.event.emit({ botId: response.botId, case: "update" });
      } else {
        // this.messageService.add({ severity: "success",summary: "Success", detail: "Updated successfully!" });
         this.toastService.showSuccess('','update');
        this.event.emit(null);
      }
    }, err => {
      // this.toastService.showError('Unable to update bot!');
      this.toastService.showError(this.toastMessages.updateError);
      this.event.emit(null)
      this.spinner.hide();
    })
  }

  validateBotName() {
    let botname = this.botForm.get("botName").value;
    if(!this.isCreateForm){
    if(this.botDetails.botName !=botname){
    this.rest.checkbotname(botname).subscribe(data => {
      if (data == true) {
        this.botNameCheck = false;
      } else {
        this.botNameCheck = true;
      }
    })
  }else{
    this.botNameCheck = false;
  }}else{
    this.rest.checkbotname(botname).subscribe(data => {
      if (data == true) {
        this.botNameCheck = false;
      } else {
        this.botNameCheck = true;
      }
    })
  }
  }

  closeBotForm() {
    this.botForm.reset();
    this.botForm.get("department").setValue("");
    // document.getElementById('bot-form').style.display = 'none';
    this.closeFormOverlay.emit(true);
    this.botNameCheck = false;
  }
  

  skipSaveBot()
  {
    let botDetails:any=this.botForm.value;
    if(botDetails.department!='' && botDetails.department!=null )
    {
      if(botDetails.botName=='' || botDetails.botName==null)
      {
        botDetails.botName="Unsaved-Bot-"+((new Date()).getTime());
        this.event.emit({botId:Base64.encode(JSON.stringify(botDetails)),case:"create"});
     
      }
    }
    else{
      this.checkBotCategory=true;
    }
  }


  submitUnsavedBot()
  {
    let botDetails=this.botForm.value;
    this.unsavedOutput.emit(botDetails);
  }
}
