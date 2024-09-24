import {Component, OnInit,QueryList,ViewChildren, OnDestroy, ChangeDetectorRef, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Base64 } from 'js-base64';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { NgxSpinnerService } from 'ngx-spinner';
import { isNumber } from 'util';
import { RestApiService } from '../../services/rest-api.service';
import { RpaStudioDesignerworkspaceComponent } from '../rpa-studio-designerworkspace/rpa-studio-designerworkspace.component';
import { ConfirmationService } from 'primeng/api';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { DataTransferService } from '../../services/data-transfer.service';
@Component({
  selector: 'app-rpa-studio-designer',
  templateUrl: './rpa-studio-designer.component.html',
  styleUrls: ['./rpa-studio-designer.component.css']
})
export class RpaStudioDesignerComponent implements OnInit , OnDestroy{
  @ViewChildren("designerInstances") designerInstances:QueryList<any>;
  @ViewChild('versionControlPopup') versionControlPopup: PopoverDirective;
  @ViewChild(RpaStudioDesignerworkspaceComponent, { static: false }) childBotWorkspace: RpaStudioDesignerworkspaceComponent;
  @Input("copilotBotId") copilotBotId:any;
  @Output("onBackEvent") backEmitter:any= new EventEmitter();
  display:boolean = true
  current_instance:any;
  toolset_instance:any;
  selected_tab_instance:any;
  userRole:any;
  checkCreate:Boolean=false; 
  freetrail: string;
  isProcessAnalyst:Boolean=true;
  version_type:any;
  comments:any;
  toolsetItems:any=[];
  botsList:any=[];
  filteredBotsList:any=[];
  categoriesList:any=[];
  environmentsList:any=[];
  loadedBotsList:any=[];
  tabActiveId:any="";
  loadBotForm:FormGroup;
  toolsetSideNav:Boolean=false;
  predefinedBotsList:any=[];
  isCreate:boolean = true;
  isActionsShow:boolean=false;
  botFormVisibility:boolean=false;
  updateBotDetails:any={};
  unsaved:boolean=false;
  isBotValidated:boolean = true;
  isOpenSideOverlay:boolean=false;
  params:any={};
  executionMode:boolean=false;
  constructor(
    private router:Router,
    private activeRoute:ActivatedRoute,
    private rest:RestApiService,
    private spinner:NgxSpinnerService,
    private formGroup:FormBuilder,
    private activatedRoute:ActivatedRoute,
    private changeDecoratorRef:ChangeDetectorRef,
    private confirmationService:ConfirmationService,
    private toastService: ToasterService,
    private toastMessages: toastMessages,
    private dt:DataTransferService
    ) { }

  ngOnInit() {
    this.loadBotForm=this.formGroup.group({
      //botType:["",Validators.required],
      botDepartment:["",Validators.required],
      bot:["",Validators.required],
    })
    this.userRole = localStorage.getItem("userRole")
    this.userRole = this.userRole.split(',');
    if(this.userRole.includes("User"))
      localStorage.setItem("isHeader","true");
    if(this.userRole.includes("Process Analyst"))
      // this.isProcessAnalyst=true;
    this.freetrail=localStorage.getItem('freetrail')
    this.getToolsetItems();
    // this.getAllBots();
    this.getAllCategories();
    // this.getPredefinedBots();
    setTimeout(() => {
    this.getAllEnvironments();
    }, 2000);
  }

  getToolsetItems()
  {
    this.spinner.show();
    this.rest.toolSet().subscribe((response:any)=>{
      //this.spinner.hide();
      if(response.errorMessage==undefined)
      {
          response.General.forEach(element => {
            let temp:any = {
              name : element.name,
              path : 'data:' + 'image/png' + ';base64,' + element.icon,
              tasks: element.taskList,
            };
              this.toolsetItems.push(temp)
          })
          if(!this.userRole.includes('User'))
          {
            response.Advanced.forEach(element => {
              let temp:any = {
                name : element.name,
                path : 'data:' + 'image/png' + ';base64,' + element.icon,
                tasks: element.taskList
              };
              this.toolsetItems.push(temp)
            });
          }
          this.activatedRoute.queryParams.subscribe(data=>{
            let params:any=data;
            if(params?.botId==undefined)
              (this.copilotBotId)? this.loadBotByBotId(this.copilotBotId,"INIT"):this.router.navigate(["home"])
            else
            {
              let botId=params.botId;
              if(!isNaN(botId))
              {
                if(params.projectId)
                {
                  localStorage.setItem("projectId", params.projectId);
                  localStorage.setItem("projectName", params.projectName);
                }
                this.loadBotByBotId(botId,"INIT");
              }
              else
              {
                let botDetails=JSON.parse(Base64.decode(botId));
                botDetails["categoryId"]=botDetails.department;
                botDetails["envIds"]=[];
                this.loadedBotsList.push(botDetails);
                setTimeout(()=>{
                  
                  this.tabActiveId=response.botName;
                  this.change_active_bot({index:0})
                },200)
              }
            }
          })
      }
      else
      {
        this.spinner.hide();
        this.toastService.showError(response.errorMessage);
      }
    },err=>{
      this.spinner.hide();
      this.toastService.showError(this.toastMessages.getToolsetErr);
    })
  }

  getAllBots()
  {
    this.rest.getAllActiveBots().subscribe((response:any)=>{
      if(response.errorMessage==undefined)
      {
        this.botsList=response
      } 
      else
      {  
        this.toastService.showError(response.errorMessage);

      }
    },err=>{
      this.toastService.showError(this.toastMessages.loadDataErr);
    })
  }


  getAllEnvironments(){
      this.rest.listEnvironments().subscribe((response:any)=>{
        if(response.errorMessage==undefined){
          this.environmentsList=response;
        }
        else{
          this.toastService.showError(response.errorMessage);
        }
      });
  }


  getAllCategories() {
    this.rest.getCategoriesList().subscribe((response: any) => {
      if (response.errorMessage == undefined) {
        this.categoriesList = response.data;
      }
      else {
        this.toastService.showError(response.errorMessage);
      }
    })
  }


  loadBotByBotId(botId:any,state:any)
  {
    this.spinner.show()
    this.rest.getbotdata(botId).subscribe((response:any)=>{
      //this.spinner.hide();
      if(response.errorMessge==undefined)
      {
        if(this.loadedBotsList.find(data=>data.botName==response.botName)==undefined)
        {
          this.loadedBotsList.push(response);
          this.tabActiveId=response.botName;
          this.closeLoadBotFormOverlay();
          //this.spinner.hide();
          if(state=="INIT")
            setTimeout(() => {
            this.change_active_bot({index:0});  
            }, 1000);
        }
        else
        {
          
          this.spinner.hide();
          if(localStorage.getItem('bot_id')=="null")
          this.toastService.showWarn(this.toastMessages.selectedBotWarn);
        }
      }
      else
      {
        this.toastService.showError(response.errorMessage);
      }
    },(err)=>{
      this.spinner.hide();
      this.toastService.showError(this.toastMessages.loadBotErr);
      //this.router.navigate(["/home"])
    })

  }

  resetLoadBotForm()
  {
    this.loadBotForm.reset();
    this.loadBotForm.get("bot").setValue("");
    this.loadBotForm.get("botDepartment").setValue("");
  }
  

  
  removetab(tab)
  {
    if(this.current_instance.isBotUpdated)
    if(!(confirm("Are you sure to exit without saving bot?")))
      return
    
    this.loadedBotsList.splice(this.loadedBotsList.indexOf(tab), 1)
    if(this.loadedBotsList.length==0)
    {
     
      this.activeRoute.queryParams.subscribe(data=>{
        let params:any=data;
        if(params.name!=undefined)
        {
          this.router.navigate(["/pages/serviceOrchestration/home"],{queryParams:{tab:3}})
        }else if(params.processId!=undefined)
        {
          this.router.navigate(["/pages/serviceOrchestration/home"],{queryParams:{processid:params.processId}})
        }else if(params.projectId!=undefined)
        {
          this.router.navigate(["/pages/rpautomation/home"])
        }
        else
        {
          this.router.navigate(["/pages/rpautomation/home"])
        }
      })
    }
  }


  change_active_bot(event){
    this.current_instance=undefined;
    this.toolsetSideNav=false;
    this.spinner.show();
    this.designerInstances.forEach((instance,index)=>{
        if(index==event.index)
        {
          this.current_instance=instance;
          this.executionMode=instance.executionMode;
          this.spinner.hide();
          let url=window.location.hash;
          if(instance.finalbot.botId!=undefined)
            window.history.pushState("", "", url.split("botId")[0]+"botId="+instance.finalbot.botId);
          else
          {
            let botId=Base64.encode(JSON.stringify(this.loadedBotsList.find(item=>item.botName==instance.finalbot.botName)));
            window.history.pushState("", "", url.split("botId=")[0]+"botId="+botId);
          }
        }
      })
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
  }

  clear(){
    this.version_type='';
    this.comments=''
  }

  version_change(versionId){
    this.current_instance.switchversion(versionId);
    let botName=this.current_instance.botState.botName
    this.selected_tab_instance=this.current_instance;
   // this.rpa_studio.spinner.show();
    
    setTimeout(()=>{
      this.designerInstances.forEach((instance,index)=>{
        if(instance.botState.botName==botName)
        {
          //this.toolset_instance=instance
          //this.current_instance=instance.rpa_actions_menu;
          this.selected_tab_instance=instance;
        //  this.rpa_studio.spinner.hide();
        }
      })
    },2500)
  }

  removenodes()
  {
    localStorage.removeItem("bot_id")
    if(localStorage.getItem("projectId")){
      let projectId=localStorage.getItem("projectId");
      let projectName=localStorage.getItem("projectName");
      localStorage.removeItem("projectId");
      localStorage.removeItem("projectName");
      this.router.navigate(["/pages/projects/projectdetails"], {queryParams:{"project_id":projectId, "project_name":projectName}})
    }else{
      $(".bot-close").click();
    }
  }

  auditLogs(){
    let botId=this.current_instance.finalbot.botId;
    let botName=this.current_instance.finalbot.botName;
    console.log(botName,this.current_instance.finalbot)
    // return
    let catergoryId=this.current_instance.finalbot.categoryId
    this.router.navigate(["/pages/rpautomation/auditlogs"],{queryParams:{botId:botId,botName:botName,catergoryId:catergoryId}})
    //this.current_instance.getAuditLogs()
  }

  navigateToBack()
  {
    
    this.activeRoute.queryParams.subscribe(data=>{
      let params:any=data;
      if(params.projectId!=undefined)
      {
        this.router.navigate(["/pages/projects/projectdetails"],{queryParams:{id:params.projectId}})
      }else
      {
        this.router.navigate(["/pages/rpautomation/home"])
      }
    })
  }

  ngOnDestroy() {
    localStorage.removeItem("bot_id")
  }

  SaveBot(){
    this.isBotValidated = false;
    if(this.current_instance.finalbot.botId==undefined){
      this.versionControlPopup.hide();
      this.botFormVisibility=true;
      this.unsaved=true;
     // document.getElementById('bot-form').style.display='block'
      this.updateBotDetails={...{},...this.current_instance.finalbot};
    }
    else{
      this.versionControlPopup.hide();
      this.childBotWorkspace.reset('');
      this.current_instance.acceptUpdateBotWithDeprecatedTasks(this.version_type,this.comments);
    }
  }

  loadBotFormOverlay()
  {
    document.getElementById("load-bot").style.display='block';
  }

  closeLoadBotFormOverlay()
  {
    this.resetLoadBotForm();
    document.getElementById("load-bot").style.display="none";
  }

  onSubmitLoadBotFrom() {
    let botId=this.loadBotForm.get("bot").value;
    this.loadBotByBotId(botId,"LOAD")
  }

  filterBotListByCategory() {
    let botDepartment:any=this.loadBotForm.get("botDepartment").value;
    this.filteredBotsList=[...this.botsList.filter((item:any)=>item.department==botDepartment)];
  }


  getSelectedEnvironments(){
    return this.current_instance.filteredEnvironments.filter((item:any)=>item.check==true);
  }

  //  Enable below code for predefined Bot feature in RPA Designer 
  getPredefinedBots() {
    // this.spinner.show()
    this.rest.getpredefinedbots().subscribe((response:any)=>{
      // this.spinner.hide()
      if(response.errorMessage==undefined)
        this.predefinedBotsList=response
      // else
      // this.toastService.showError(response.errorMessage);
    },(err:any)=>{
      this.spinner.hide();
      // this.toastService.showError(this.toastMessages.preDefineBotErr);
    })
  }

  openBotForm() {
    // document.getElementById("bot-form").style.display='block';
    //document.getElementById("bot-form")
    this.botFormVisibility=true;
    this.unsaved=false;

  }

  
  createEnvironment(){
    this.isCreate=true;
    this.isOpenSideOverlay=true;
    // setTimeout(()=>{
    //   document.getElementById("createenvironment").style.display='block';
    // },1000)
  }
  
  closeEnviromentOverlay() {
    document.getElementById('createenvironment').style.display = 'none';
  }

  closeBotForm(){
    this.botFormVisibility=false;
    document.getElementById("bot-form").style.display='none';
  }

  onBotCreate(event) {
    if (event != null) {
      if (event.case == "create") {
        if(!isNaN(event.botId)){
          this.loadBotByBotId(event.botId, "LOAD");
          this.getAllBots();
        }
        else
        {
          let botDetails=JSON.parse(Base64.decode(event.botId));
          botDetails["categoryId"]=botDetails.department;
          botDetails["envIds"]=[];
          this.loadedBotsList.push(botDetails);
          this.tabActiveId=botDetails.botName;
          // let url=window.location.hash;
          // window.history.pushState("", "", url.split("botId=")[0]+"botId="+event.botId);
          document.getElementById("bot-form").style.display='none';
        }
        this.botFormVisibility=false;
      }
    }
  }

  openTabOptions(){
    this.getAllBots();
  }

  updateCreatedBotName(botNameDetails:any)
  {
    this.loadedBotsList[botNameDetails.index].botName=botNameDetails.botName;
    this.tabActiveId=botNameDetails.botName;
    this.getAllBots()
  }


  submitUnsavedBotDetails(botDetails)
  {
    this.current_instance.saveBotDetailsAndUpdate(this.version_type,this.comments,botDetails)
    document.getElementById('bot-form').style.display='none';
    this.updateBotDetails={}
    this.unsaved=false;
    this.botFormVisibility=false;
  }

  closeSideOverlay(event){
    this.isOpenSideOverlay=event
  }
  closeOverlay1(event){  // in bot create new bot
    this.botFormVisibility=event
  }


  onChangeExecutionMode(){
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Do you want to change the version?',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      rejectButtonStyleClass: ' btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      key: 'rpadesigner',
        accept:() => {
        this.current_instance.executionMode=this.executionMode;
      },
      reject:()=>{
        this.executionMode=!this.executionMode;
      }
  })
  }


  sendCopilotBackEvent()
  {
    this.backEmitter.emit(null);
  }

}
