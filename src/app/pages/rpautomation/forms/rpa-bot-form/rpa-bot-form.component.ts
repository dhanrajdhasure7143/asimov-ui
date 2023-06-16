import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Base64 } from 'js-base64';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import {ConfirmationService, MessageService} from "primeng/api";

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
    private messageService:MessageService,
    public confirmationService:ConfirmationService
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
  // var message=this.messageService.add({severity:'success',summary:'Success',detail:'Bot created successfully!'});

  if(botFormValue.botName=='' || botFormValue.botName==null)
      this.skipSaveBot()
    else
    {
      this.spinner.show()

      this.rest.createBot(botFormValue).subscribe((response: any) => {
        this.spinner.hide()
    //  this.messageService.add({severity:'success',summary:'Success',detail:'Bot created successfully!'});

        if (response.errorMessage == undefined) {
                  // message.confirm({
          //   header:'Confirmation',
          //   message:'Bot created successfully!',
          //   acceptButtonStyleClass: 'btn bluebg-button',
          //   defaultFocus: 'none',
          //   acceptIcon: 'null',
          //   acceptLabel:'Ok',
          //   rejectVisible:false,
          // }) 
          //  message.add({severity:'success',summary:'Success',detail:'Bot created successfully!'});
        
          this.closeBotForm();
          this.event.emit({ botId: response.botId, case: "create" });
       
       
        // setTimeout(() => {
        //   message
        // }, 2000);

        } else {
          this.messageService.add({severity:'error',summary:'Error',detail:response.errorMessage});
          this.event.emit(null);
        }
      }, err => {
        this.spinner.hide();
        this.messageService.add({severity:'error',summary:'Error',detail:'Unable to create a bot.'});
        this.event.emit(null);
      })
    }

  }

  updateBot() {
    let botFormValue = { ...this.botForm.value, ...{ botId: this.botDetails.botId } };
    this.spinner.show();
    this.rest.modifybotdetails(botFormValue).subscribe((response: any) => {
      if (response.errorMessage == undefined) {
        this.messageService.add({severity:'success',summary:'Success',detail:response.message+''+'!!'})
        this.closeBotForm();
        this.spinner.hide();
        this.event.emit({ botId: response.botId, case: "update" });
      } else {
        this.messageService.add({ severity: "success",summary: "Success", detail: "Updated Successfully !!" });
        this.event.emit(null);
      }
    }, err => {
      this.messageService.add({severity:'error',summary:'Error',detail:'Unable to update bot.'})
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
