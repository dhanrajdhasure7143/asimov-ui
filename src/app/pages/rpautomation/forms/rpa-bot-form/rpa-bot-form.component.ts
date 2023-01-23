import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnInit, Output, TemplateRef, ViewChild, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Base64 } from 'js-base64';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import Swal from 'sweetalert2';

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
    private spinner:NgxSpinnerService
    ) {}


  ngOnInit(): void {
    this.botForm = this.formBuilder.group({
      botName: ["",Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern("^[a-zA-Z0-9_-]*$")])],
      department: ["", Validators.required],
      description: ["", Validators.compose([Validators.maxLength(500)])],
      isPredefined: [false]
    });
    if(!this.isCreateForm && this.botDetails!=undefined){

      this.botForm = this.formBuilder.group({
        botName: [this.botDetails.botName, Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern("^[a-zA-Z0-9_-]*$")])],
        department: [this.botDetails.department, Validators.required],
        description: [this.botDetails.description, Validators.compose([Validators.maxLength(500)])],
        isPredefined: [this.botDetails.isPredefined]
      });
      
    }else{
     
      if(this.unsaved==true)
      {
        this.botForm = this.formBuilder.group({
          botName: [this.botDetails.botName, Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern("^[a-zA-Z0-9_-]*$")])],
          department: [this.botDetails.department, Validators.required],
          description: [this.botDetails.description, Validators.compose([Validators.maxLength(500)])],
          isPredefined: [this.botDetails.isPredefined]
        });
      }
      else if(this.categoriesList.length==1)
      {
        this.botForm = this.formBuilder.group({
          botName: ["", Validators.compose([Validators.maxLength(30), Validators.pattern("^[a-zA-Z0-9_-]*$")])],
          department: ['', Validators.required],
          description: ['', Validators.compose([Validators.maxLength(500)])],
          isPredefined: [false]
        });
        setTimeout(()=>{
          this.botForm.get('department').setValue(this.categoriesList.length==1?this.categoriesList[0].categoryId:'');
        },100)
      }
    }
 
  }

  ngOnChanges(changes:SimpleChanges){
  
  
  }

  onFormSubmit() {
    if (this.isCreateForm)
      this.createBot()
    else
      this.updateBot()
  }

  createBot() {
    let botFormValue = this.botForm.value;
    if(botFormValue.botName=='' || botFormValue.botName==null)
      this.skipSaveBot()
    else
    {
      this.spinner.show()
      this.rest.createBot(botFormValue).subscribe((response: any) => {
        this.spinner.hide()
        if (response.errorMessage == undefined) {
          Swal.fire("Success", "Bot created successfully!", "success");
          this.closeBotForm();
          this.event.emit({ botId: response.botId, case: "create" });
        } else {
          Swal.fire("Error", response.errorMessage, "error");
          this.event.emit(null);
        }
      }, err => {
        this.spinner.hide();
        Swal.fire("Error", "Unable to create bot", "error");
        this.event.emit(null);
      })
    }

  }

  updateBot() {
    let botFormValue = { ...this.botForm.value, ...{ botId: this.botDetails.botId } };
    this.spinner.show();
    this.rest.modifybotdetails(botFormValue).subscribe((response: any) => {
      if (response.errorMessage == undefined) {
        Swal.fire("Success", "Bot details updated successfully!", "success");
        this.closeBotForm();
        this.event.emit({ botId: response.botId, case: "update" });
      } else {
        Swal.fire("Error", "Unable to update bot details", "error");
        this.event.emit(null);
      }
    }, err => {
      Swal.fire("Error", "Unable to update bot", "error");
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
    document.getElementById('bot-form').style.display = 'none';
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
