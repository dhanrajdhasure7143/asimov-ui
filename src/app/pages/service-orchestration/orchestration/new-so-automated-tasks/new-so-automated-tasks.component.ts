import {ViewChild,Input, Component, OnInit,OnDestroy,Pipe, ChangeDetectorRef ,PipeTransform } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {RestApiService} from '../../../services/rest-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import 'rxjs/add/operator/filter';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {sohints} from '../model/new-so-hints';
import { DataTransferService } from '../../../services/data-transfer.service';
declare var $:any;
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { moveItemInArray} from '@angular/cdk/drag-drop';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { Table } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
@Component({
  selector: 'app-new-so-automated-tasks',
  templateUrl: './new-so-automated-tasks.component.html',
  styleUrls: ['./new-so-automated-tasks.component.css']
})
export class NewSoAutomatedTasksComponent implements OnInit,OnDestroy {
 schdata:any;
  public UiPathconfigoverlay: boolean = false;
  public slabotId : any;
  public processId1:any;
  public cascadingImpactbtn: boolean = false;
  public castoggle:boolean = false;
  public emailcheck: boolean = false;
  public smscheck: boolean = false;
  public popup:any;
  public schedulepopup:Boolean=false;
  public queryparam:any='';
  public isTableHasData = true;
  public Active_bots_list:any=[];
  public respdata1=false;
  public expectedTime : any = 0;
  public expectedDate : any = 0;
  public automatedtask: any;
  public updatesladata: any;
  uipath:Boolean=true;
  blueprism:Boolean=false;
  kofax:Boolean=false;
  addconfigstatus:Boolean=false;
  addBPconfigstatus:Boolean = false;
  blueprismconfigoverlay:Boolean = false;
  blueprismbots:any=[];
  configurations_data:any=[];
  configurations:any=[];
  public isDataSource: boolean;
  public userRole:any = [];
  public isButtonVisible = false;
  public bot_list:any=[];
  public humans_list:any=[];
  public process_names:any=[];
  public selected_process_names:any=[];
  public selectedvalue:any="";
  public selectedTab:number;
  public responsedata;
  public selectedEnvironment:any='';
  public environments:any=[];
  public environmentsData:any=[];
  public accountName:any="";
  public tenantId:any="";
  public userKey:any="";
  public clientId:any="";
  public activeStatus:Boolean=false;
  public selectedcategory:any="";
  public categaoriesList:any=[];
  public uipath_bots:any=[];
  public blueprism_configs:any=[];
  public checkedsource:String="UiPath";
  addTaskForm:FormGroup;
  queryParam:Boolean=false;
  checkAssignTasks:Boolean=false;
  uiPathBotFlag:Boolean=false;
  public tasksArray:any=[];
  public processId:any;
  public insertslaForm_so_bot:FormGroup;
  public BluePrismConfigForm:FormGroup;
  public BluePrismFlag:Boolean=false;
  public timer:any;
  public logs_modal:BsModalRef;
  isbotloading:any="loading";
  isHumanLoading:any="Loading"
  taskslist: any;
  selectedexecutiontype:any="Serial"
  public users_list: any[];
  public userID: any;
  public userDetails:any={};
  public botSource_list:any[]=[];
  reOrderedData:any=[];
  q=0;
  tasks:any;
  ExecutionTypearr:any[] =[]
  resp: any =[];
  columnList=[
    {DisplayName:"Process Name",field:"processName",ShowFilter: true},
    {DisplayName:"Task",field:"taskName",ShowFilter: true},
    {DisplayName:"Process Owner",field:"createdBy",ShowFilter: true},
    {DisplayName:"Task Owner",field:"taskOwner",ShowFilter: false},
    {DisplayName:"Task Type",field:"taskType",ShowFilter: true},
    {DisplayName:"Category",field:"category",ShowFilter: true},
    {DisplayName:"Bot Source",field:"BotSource",ShowFilter: false},
    {DisplayName:"Assign Resource",field:"AssignResource",ShowFilter: false},
    {DisplayName:"Status",field:"status",ShowFilter: true},
    {DisplayName:"Actions",field:"Actions",ShowFilter: false},
  ];
  statusColors = {
    New: '#3CA4F3',
    Running:"#C4B28E",
    Failure: '#FE665D',Failed:"#FE665D",
    Success: '#4BD963',Approved:"#4BD963",Executed:"#4BD963",
    Killed:"#B91C1C",Rejected:"#B91C1C",
    Stopped: '#FE665D',Stop:"#FE665D",     
    InProgress:"#FFA033",
    Pending:"#FED653",
    Paused:"#FED653",Pause:"#FED653"
  };
  searchValue:string;
  isProcessAnalyst:boolean = false;
  @ViewChild("dt",{static:true}) table:Table;
  
  constructor(
    private route: ActivatedRoute,
    private rest:RestApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private spinner:LoaderService,
    private http:HttpClient,
    private hints: sohints,
    private dt : DataTransferService,
    private modalService:BsModalService,
    private cd:ChangeDetectorRef,
    private dataTransfer: DataTransferService,
    private confirmationService:ConfirmationService,
    private toastService: ToasterService,
    private toastMessages: toastMessages
   )

  {
    this.BluePrismConfigForm = this.formBuilder.group({
      configName: ["", Validators.compose([Validators.maxLength(50)])],
      bluPrismPassword: ["", Validators.compose([Validators.maxLength(50)])],
      bluePrismUsername: ["", Validators.compose([Validators.maxLength(50)])],
      hostAddress: ["", Validators.compose([Validators.maxLength(50)])],
      username: ["", Validators.compose([Validators.maxLength(50)])],
      password: ["", Validators.compose([Validators.maxLength(50)])],
      port: ["", Validators.compose([Validators.maxLength(50)])],
      status : [],
    });

    this.insertslaForm_so_bot=this.formBuilder.group({
      botName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      botSource: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      breachAlerts: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      cascadingImpact: false,
      email:[''],
      sms:[''],
      /*expectedDate: [],
      expectedTime : [],*/
      expectedEDate : [],
      notificationType: [],
      processName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      processOwner: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      taskName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      retriesInterval: ["", Validators.compose([Validators.maxLength(2)])],
      slaConfigId: ["", Validators.compose([Validators.required, Validators.maxLength(2)])],
      systemImpacted: ["", Validators.compose([ Validators.maxLength(50)])],
      taskOwner: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      thresholdLimit: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      totalRetries: ["", Validators.compose([Validators.maxLength(2)])],
    });
    this.addTaskForm=this.formBuilder.group({
      tasks: [[], Validators.compose([Validators.required, Validators.maxLength(50)])]
    })

  }

  ngOnInit() {
    this.dt.changeHints(this.hints.soochestartionhints);
    this.getUserDetails();
    this.spinner.show();
    this.userRole = localStorage.getItem("userRole")

    if(this.userRole.includes('SuperAdmin')){
      this.isButtonVisible = true;
    }else if(this.userRole.includes('Admin')){
      this.isButtonVisible = true;
    }else if(this.userRole.includes('RPA Admin')){
      this.isButtonVisible = true;
    }else{
      this.isButtonVisible = false;
    }

    if(this.userRole.includes('Process Analyst'))
      this.isProcessAnalyst=true;

    this.route.queryParams.subscribe(params => {
      if(params.processid!=undefined)
        this.processId = params['processid'];
      else
       this.processId=0
       let url = new URL(window.location.href);
      if (url.hash.split("?")[1]==undefined) {
        this.processId=0;
      }
      setTimeout(()=>{
        this.getCategoryList(this.processId);
      },400)
      this.getallbots();
      this.getUserslist();
      this.getuipathbots();
      this.getblueprismbots();
    });
    //this.getCategoryList(this.processId);
    this.ExecutionTypearr = [
      { name: "Serial",},
      { name: "Parallel"},
    ];
    this.dataTransfer.resetTableSearch$.subscribe((res)=>{
      if(res == true){
        this.clearTableFilters(this.table);
      }
    })
 }

 sla_bot:any;
 sla_data:any;
 sla_selected_task:any;
 SLACon(taskdata){
  
   this.sla_selected_task=taskdata;
   this.insertslaForm_so_bot.get("processName").setValue(this.sla_selected_task.processName);
   this.insertslaForm_so_bot.get("processOwner").setValue(this.sla_selected_task.createdBy);
   this.insertslaForm_so_bot.get("taskName").setValue(this.sla_selected_task.taskName);
   this.insertslaForm_so_bot.get("botSource").setValue(this.sla_selected_task.sourceType);
   this.insertslaForm_so_bot.get("taskOwner").setValue(this.sla_selected_task.taskOwner);
   this.insertslaForm_so_bot.get("breachAlerts").setValue("");
   if(this.sla_list.find(item=>item.botId==taskdata.botId)!=undefined)
   {
      this.sla_data= this.sla_list.find(item=>item.botId==taskdata.botId)
      this.insertslaForm_so_bot.get("breachAlerts").setValue(this.sla_data.breachAlerts);
      this.insertslaForm_so_bot.get("retriesInterval").setValue(this.sla_data.retriesInterval);
      this.insertslaForm_so_bot.get("thresholdLimit").setValue(this.sla_data.thresholdLimit);
      this.insertslaForm_so_bot.get("totalRetries").setValue(this.sla_data.totalRetries);
      this.insertslaForm_so_bot.get("slaConfigId").setValue(this.sla_data.slaConfigId);
      if(this.sla_data.notificationType=="email")
        this.insertslaForm_so_bot.get("email").setValue(true);
      if(this.sla_data.notificationType=="sms")
        this.insertslaForm_so_bot.get("sms").setValue(true);
      if(this.sla_data.notificationType=="email,sms")
      {
        this.insertslaForm_so_bot.get("sms").setValue(true);
        this.insertslaForm_so_bot.get("email").setValue(true);
      }
   }
   else if(this.sla_selected_task.sourceType=="EPSoft"){
    this.sla_bot=this.bot_list.find(item=>item.botId==this.sla_selected_task.botId);
    this.insertslaForm_so_bot.get("botName").setValue(this.sla_bot.botName);
   }
   else if(taskdata.sourceType=="BluePrism")
    {
      this.sla_bot=this.blueprismbots.find(item=>item.botName==this.sla_selected_task.botId);
      this.insertslaForm_so_bot.get("botName").setValue(this.sla_bot.botName);
    }
    else if(this.sla_selected_task.sourceType=="UiPath")
    {
      this.sla_bot=this.uipath_bots.find(item=>item.Key==this.sla_selected_task.botId);
      this.insertslaForm_so_bot.get("botName").setValue(this.sla_bot.Name);
    }
  //  this.slabotId = botId;
  //  let bot_data:any;
  //  if(this.bot_list.find(item=>item.botId==botId)!=undefined)
  //    this.sla_bot=this.bot_list.find(item=>item.botId==botId); 
  //   if(bot_data.sourceType=="EPSoft")
  //   {
  //     this.insertslaForm_so_bot.get("botName").setValue(bot_data.botName)
  //   }
  //   else if(bot_data.sourceType=="UiPath")
  //   {
  //     this.insertslaForm_so_bot.get("botName").setValue(bot_data.botName)
  //   }
  //   else if(bot_data.sourceType=="BluePrism")
  //   {
  //   }
    // }
    // this.insertslaForm_so_bot.get("processName").setValue(this.updatesladata["processName"]);
    // this.insertslaForm_so_bot.get("taskOwner").setValue(this.updatesladata["taskOwner"]);
    // this.insertslaForm.get("botSource").setValue(this.updatesladata["sourceType"]);
  //  for(data of this.automatedtask)
  //   {
  //     if(data.botId==slaconId)
  //     {
  //       if(data.sourceType == 'EPSoft')
  //       {
  //         this.bot_list.filter(x =>
  //           {
  //           if(x.botId == slaconId){
  //           this.insertslaForm.get("botName").setValue(x.botName);
  //           }
  //         });
  //       }
  //       else if(data.sourceType == 'UIPath')
  //        {
  //            this.uipath_bots.filter(x =>
  //             {
  //             if(x.Key == slaconId){
  //             this.insertslaForm.get("botName").setValue(x.ProcessKey);
  //             }
  //           });
  //       }
  //       this.updatesladata=data;
    //     this.insertslaForm.get("processName").setValue(this.updatesladata["processName"]);
    //     this.insertslaForm.get("taskOwner").setValue(this.updatesladata["taskOwner"]);
    //     this.insertslaForm.get("botSource").setValue(this.updatesladata["sourceType"]);
    //     break;
    //   }
    // }
    document.getElementById("SLAConfig").style.display="block";
 }

 slaconId:any;
 sla_list:any=[]
 get_sla_list()
 {
   this.rest.getslalist().subscribe(sla_list=>{
     this.sla_list=sla_list;
   })
 }


 savedata(){}

 slaalerts(){
  /* let notificationtype="";
   if(this.insertslaForm_so_bot.get("email").value==true)
     notificationtype="email"
   if(this.insertslaForm_so_bot.get("sms").value==true)
     notificationtype="sms"
   if(this.insertslaForm_so_bot.get("sms").value==true&&this.insertslaForm_so_bot.get("email").value==true)
     notificationtype="email,sms"
    let slaalertsc = {
      botSource : this.insertslaForm_so_bot.value.botSource,
      breachAlerts : this.insertslaForm_so_bot.value.breachAlerts,
      cascadingImpact : false,
      expectedETime : "0000-00-00T00:00:00.000Z",
      notificationType : notificationtype,
      processName : this.sla_selected_task.processName,
      retriesInterval :  parseInt(this.insertslaForm_so_bot.value.retriesInterval),
      slaConfigId :  parseInt(this.insertslaForm_so_bot.value.slaConfigId),
      systemImpacted : "NA",
      taskOwner : this.insertslaForm_so_bot.value.taskOwner,
      thresholdLimit :  parseInt(this.insertslaForm_so_bot.value.thresholdLimit),
      totalRetries :  parseInt(this.insertslaForm_so_bot.value.totalRetries),
      notificationStatus:1
    };*/
    /*
     if(this.sla_bot.sourceType=="UiPath")
      slaalertsc["botName"]=this.insertslaForm_so_bot.value.botName+"_Env";
     else
       slaalertsc["botName"]=this.insertslaForm_so_bot.value.botName;
 
     if(this.sla_bot.sourceType=="EPSoft")
       slaalertsc["botId"]=this.sla_bot.botId;
     else
       slaalertsc["botId"]=0;
     if(this.slaconId==undefined)
       this.rest.slaconfigapi(slaalertsc).subscribe( res =>
       {
           let resp:any=res
           if(resp.errorMessage==undefined)
           {
             Swal.fire(resp.Status,"","success")
             this.get_sla_list();
           }
           else
             Swal.fire(resp.errorMessage,"","success")
     });
    else
     this.rest.update_sla_config(slaalertsc).subscribe( res =>
     {
           let resp:any=res
           if(resp.errorMessage==undefined)
           {
             Swal.fire(resp.Status,"","success")
             this.get_sla_list();
           }
           else
             Swal.fire(resp.errorMessage,"","success")
 
     });*/
     setTimeout(()=>{
       this.toastService.showSuccess(this.toastMessages.SLAConfigSave,'response');
       this.SLAclose();
     },1000)
 
 
  }
 
 
checkboxstatus(data){
  let checkboxstatus = data;
  this.insertslaForm_so_bot.value.Alerts = checkboxstatus;
}

SLAclose(){
  document.getElementById("SLAConfig").style.display = "none";
  this.resetsla();
}

// emailcheckm(){
//   if(this.emailcheck == true)
//   {
//     this.emailcheck = false;
//   }
//   else
//   {
//     this.emailcheck = true;
//   }
// }

// smscheckm(){
//   if(this.smscheck == true)
//   {
//     this.smscheck = false;
//   }
//   else
//   {
//     this.smscheck = true;
//   }
// }

cascadingImp(){
  if(this.insertslaForm_so_bot.value.cascadingImpact == true)

  {
    this.cascadingImpactbtn = true;
  }
  else
  {
    this.cascadingImpactbtn = false;
  }
}

// slaalerts(){
//   if(this.emailcheck == true){
//     if(this.smscheck == true){
//       this.insertslaForm.value.notificationType = 'email,sms';
//     }
//     else{
//       this.insertslaForm.value.notificationType = 'email';
//     }
//   }
//   else if(this.smscheck == true)
//   {
//     this.insertslaForm.value.notificationType = 'sms';
//   }
//   else
//   {
//     this.insertslaForm.value.notificationType = '';
//   }
//   let expectedDate : any;
//   expectedDate = new Date();
//   //this.insertslaForm.value.expectedDate+"T"+this.insertslaForm.value.expectedTime+":00.000Z"
//   let date1: any;

//   if((expectedDate.getMonth()+1)<10){
//   date1 = expectedDate.getFullYear()+"-0"+(expectedDate.getMonth()+1)+"-"+expectedDate.getDate()+"T00:"+this.insertslaForm.value.expectedEDate+":00.000Z";
//   }
//   else{
//    date1 = expectedDate.getFullYear()+"-"+(expectedDate.getMonth()+1)+"-"+expectedDate.getDate()+"T00:"+this.insertslaForm.value.expectedEDate+":00.000Z";
//   }

//  let slaalertsc = {
//      botId : parseInt(this.slabotId),
//     botName : this.insertslaForm.value.botName,
//     botSource : this.insertslaForm.value.botSource,
//     breachAlerts : this.insertslaForm.value.breachAlerts,
//     cascadingImpact : this.insertslaForm.value.cascadingImpact,
//     expectedETime :  date1,
//     notificationType : this.insertslaForm.value.notificationType,
//     processName : this.insertslaForm.value.processName,
//     retriesInterval : parseInt(this.insertslaForm.value.retriesInterval),
//     slaConfigId : parseInt(this.insertslaForm.value.slaConfigId),
//     systemImpacted : this.insertslaForm.value.systemImpacted,
//     taskOwner : this.insertslaForm.value.taskOwner,
//     thresholdLimit : parseInt(this.insertslaForm.value.thresholdLimit),
//     totalRetries : parseInt(this.insertslaForm.value.totalRetries),
//   };
//    this.rest.slaconfigapi(slaalertsc).subscribe( res =>
//     {
//       Swal.fire({
//         position: 'center',
//         icon: 'success',
//         title: 'SLA Configuration Updated Successfully',
//         showConfirmButton: false,
//         timer: 2000
//       })
//      /* if(res.errorCode==undefined){
//       Swal.fire({
//         position: 'center',
//         icon: 'success',
//         title: "Successfully connected.",
//         showConfirmButton: false,
//         timer: 2000
//       })
//       }else{
//         Swal.fire({
//           position: 'center',
//           icon: 'error',
//           title: 'Connection failed!',
//           showConfirmButton: false,
//           timer: 2000
//         })
//       }*/
//     });
//   this.SLAclose();
// }

resetsla(){
  this.insertslaForm_so_bot.reset();
  //this.insertslaForm.get("thresholdLimit").setValue("");
  this.insertslaForm_so_bot.get("breachAlerts").setValue("");
  this.emailcheck = false;
  this.smscheck = false;
  this.castoggle = false;
  this.cascadingImpactbtn = false;
  $('.emailcheck').prop('checked', false);
  $('.smscheck').prop('checked', false);
}


 loadbotdatadesign(botId)
  {
    if(this.selectedvalue==undefined || this.selectedvalue=='')
      this.router.navigate(["/pages/rpautomation/designer"],{queryParams:{name:"orchestration",botId:botId}});
    else
      this.router.navigate(["/pages/rpautomation/designer"],{queryParams:{processId:this.selectedvalue,botId:botId}});
  }


  assignreset(id)
  {
    let botId=$("#"+id+"__select").val();
    if(botId!=0)
      {
        $("#"+id+"__select").prop('selectedIndex',0);
      }
  }

  getallbots()
  {
    this.rest.getallsobots().subscribe(botlist =>
    {
      if(botlist){
        this.bot_list=botlist;
        this.isbotloading='Success'
        if(this.selectedvalue!=null){
       setTimeout(() => {
        this.checkTaskAssigned(this.selectedvalue)
       }, 2000);
        }
      }

     
    },(error)=>{
      this.isbotloading='Error'
    });
  }

  getautomatedtasks(process){
   this.spinner.show();
    this.rest.getautomatedtasks(process).subscribe(automatedtasks=>{
      let response:any=[];
      response=automatedtasks;
      if(response.automationTasks != undefined)
      {
        this.rest.getAllActiveBots().subscribe(bots=>{
          this.Active_bots_list=bots;
          let responsedata=response.automationTasks.map(item=>{
              item["processFilterId"]="processId_"+item.processId+"_"+item.processName
              // if(item.sourceType=="UiPath")
              //   item["taskOwner"]="Karthik Peddinti";
              // else if(item.sourceType=="EPSoft")
              //   item["taskOwner"]=this.Active_bots_list.find(bot=>bot.botId==item.botId)==undefined?"---":this.Active_bots_list.find(bot=>bot.botId==item.botId).createdBy;
              // else{
              //   item["taskOwner"]="---"
              // }
              return item;
          });
          this.responsedata=responsedata;
          this.automatedtask=responsedata;
         // this.dataSource2= new MatTableDataSource(this.responsedata);
            // this.dataSource2.paginator=this.paginator10;
            // setTimeout(()=>{
            //   this.dataSource2.sort=this.automatedSort;
            // },300)
            
          if(process==0)
          {
            this.getprocessnames(undefined);
  
          }else
          {
            this.getprocessnames(process);
          }
            this.update_task_status();

        });
       
      }
      // this.spinner.hide();
    },(err)=>{
      this.spinner.hide();
    })
  }

  getprocessnames(processId){
    this.spinner.show();
    // this.rest.getprocessnames().subscribe(processnames=>{
    this.rest.getprocessnamesByLatestVersion().subscribe(processnames=>{
      this.resp=processnames
      this.process_names=this.resp.filter(item=>item.status=="APPROVED");
      let filtered_selected_process=this.resp.filter(item=>item.status=="APPROVED");
      this.selected_process_names = filtered_selected_process.sort((a, b) => (a.processName.toLowerCase() > b.processName.toLowerCase()) ? 1 : ((b.processName.toLowerCase() > a.processName.toLowerCase()) ? -1 : 0));
      let processnamebyid;
      if(processId != undefined)
      {
        processnamebyid=this.process_names.find(data=>data.processId==processId);
        this.applyFilter(processnamebyid.processId);
      }
      else
      {
        this.selectedvalue="";
      }
      this.spinner.hide();
    },(err)=>{
      this.spinner.hide();
    })
  }

  dropTable(event) {
    if(this.selectedvalue!="" && this.selectedvalue != 0 && this.selectedvalue!="0" && this.selectedvalue != undefined) {
      this.spinner.show();
      let filteredTasks:any=this.automatedtask.filter(item=>item.processId==this.selectedvalue);
      if(this.reOrderedData.length == 0){
        this.reOrderedData = filteredTasks
      }
      moveItemInArray(this.reOrderedData,event.dragIndex,event.dropIndex)
      // const draggedItem = filteredTasks[event.dragIndex]; 
      // filteredTasks.splice(event.dragIndex, 1); // Remove the dragged item from its previous index 
      // filteredTasks.splice(event.dropIndex, 0, draggedItem);
      let array:any= this.reOrderedData;
      let tasksOrder=array.map(item=>{
        return {
          "taskId":String(item.taskId)
        }
      })
      this.rest.saveTasksOrder(tasksOrder).subscribe((data:any)=>{
        this.spinner.hide();
        // this.responsedata=array;
        this.reOrderedData = array;

        // this.dataSource2.paginator=this.paginator10;
        // this.dataSource2.sort=this.automatedSort;
      },(err=>{
        this.spinner.hide();
       this.toastService.showError(this.toastMessages.reorderTaskErr);
      }))
    }
    else
    {
      this.toastService.showWarn(this.toastMessages.reorderTaskWarn);
    }
    // if (event.previousContainer === event.container) {
    //   moveItemInArray(event.container.data.data, event.previousIndex, event.currentIndex);
    // } else {
    //   transferArrayItem(event.previousContainer.data.data, event.container.data.data, event.previousIndex, event.currentIndex);
    // }
    //const prevIndex = this.automatedtask.findIndex((d) => d === event.item.data);
    // moveItemInArray(this.automatedtask, prevIndex, event.currentIndex);
    // this.automatedtable.renderRows();
  }

  applyFilter(filterValue:any) {
    let processnamebyid=this.process_names.find(data=>parseInt(filterValue)==data.processId);
    this.selectedcategory=parseInt(processnamebyid.categoryId);
    this.selectedvalue=parseInt(processnamebyid.processId);
    let processes=this.automatedtask.filter(item=>item.processId==this.selectedvalue);
    this.responsedata=processes
    // this.dataSource2.paginator=this.paginator10;
    // this.dataSource2.sort=this.automatedSort
    //this.dataSource2.filter = "processId_"+filterValue+"_"+processnamebyid.processName;
    this.checkTaskAssigned(processnamebyid.processId);
    this.reOrderedData=[]
  }

  applyFilter1(value)
  {
    this.selectedcategory=parseInt(value);
    this.environments=this.environmentsData.filter(item=>item.categoryId==value);
    this.selected_process_names=this.process_names.filter(item=>item.categoryId==this.selectedcategory)
    let automatedTasks=this.automatedtask.filter(item=>item.categoryId==value);
    this.responsedata=automatedTasks
    // this.dataSource2.paginator=this.paginator10;
    // this.dataSource2.sort=this.automatedSort;
    this.selectedvalue="";
    this.reOrderedData=[]
  }


  
    checkTaskAssigned(id){
      var processId=id;
      if( this.automatedtask.filter(item=>item.processId==processId).length==0)
      {
        this.checkAssignTasks=false;
        return;
      }
      else
      {
        let taskslist=this.automatedtask.filter(item=>item.processId==processId)
        for(let i=0; i<taskslist.length;i++)
        {
          let item=taskslist[i]
          if(item.taskType=="Automated")
          { 
            if(item.botId==""||item.botId==undefined || item.botId==null || item.botId=='null')    
            {
              this.checkAssignTasks=false
              return true;
            }
            else
            {
              if(this.checkResource(item.botId,item.sourceType,item.taskType)!="0")
              {
                this.checkAssignTasks=true
              }
              else
              {
                this.checkAssignTasks=false;
                return true;
              }
            }
          }else if(item.taskType="Human")
          {
            if(item.assignedUserId==""||item.assignedUserId==undefined || item.assignedUserId==null || item.assignedUserId=='null')    
            {
              this.checkAssignTasks=false
              return true;
            }
            else
            {
                if(this.checkResource(item.assignedUserId,item.sourceType,item.taskType)!="0")
                {
                  this.checkAssignTasks=true
                }
                else
                {
                  this.checkAssignTasks=false; 
                  return true;
                }
            }
          }
        }

      }
    }
    checkResource(id: any,  sourceType:any, taskType:any ) {
      var val=""  
      if(taskType=="Automated")
      {
        
        if(sourceType=="EPSoft")
          val= (this.bot_list.find(item=>parseInt(item.botId)==parseInt(id))!=undefined)?(this.bot_list.find(item=>parseInt(item.botId)==parseInt(id)).botId):"0";
        else if(sourceType=='UiPath')
          val= (this.uipath_bots.find(item=>item.Key==id)!=undefined)?this.uipath_bots.find(item=>item.Key==id).Key:"0";
        else if(sourceType=='BluePrism')
          val= (this.blueprismbots.find(item=>item.botName==id)!=undefined)?this.blueprismbots.find(item=>item.botName==id).botName:"0";
        //return val;
      }
      else if(taskType=="Human")
      {
        val= (this.humans_list.find(item=>parseInt(item.userId.id)==parseInt(id))!=undefined)?(this.humans_list.find(item=>parseInt(item.userId.id)==parseInt(id)).userId.id):"0";
      }
      return val
    }

  close()
  {
    document.getElementById("create-bot").style.display ="none";

    document.getElementById("load-bot").style.display ="none";
  }

  assignbot(id, processId)
  {
    let botId=$("#"+id+"__select").val();
    let source=this.responsedata.find(item=>item.taskId==id).sourceType;
    // if(source=="UiPath")
    //   this.responsedata.find(item=>item.taskId==id).taskOwner="Karthik Peddinti";
    // else if(source=="EPSoft")
    // {
    //   this.responsedata.find(item=>item.taskId==id).taskOwner=this.bot_list.find(bot=>bot.botId==botId).createdBy;
    // }
    // else{
    //   this.responsedata.find(item=>item.taskId==id).taskOwner="---"
    // }
    // this.dataSource2= new MatTableDataSource(this.responsedata);
    // this.dataSource2.sort=this.automatedSort;
    // this.dataSource2.paginator=this.paginator10;
   
    if(botId!=0)
    {
      this.spinner.show();
      this.rest.assign_bot_and_task(botId,id,source,"Automated",this.userID).subscribe(data=>{// added userID as we are sending taskowner
        let response:any=data;
        this.spinner.hide();
        if(response.status!=undefined)
        {
          if(this.automatedtask.find(item=>item.taskId==id)!=undefined)
          {
            this.automatedtask.find(item=>item.taskId==id).botId=(botId);
            this.responsedata.find(item=>item.taskId==id).botId=(botId);
            
            // this.dataSource2.sort=this.automatedSort;
            // this.dataSource2.paginator=this.paginator10;
            if(this.selectedvalue!=undefined && this.selectedvalue!="")
            {
              this.applyFilter(this.selectedvalue);
            }
          }
          this.toastService.showSuccess(this.toastMessages.aissignResource,'response'); 
          this.checkTaskAssigned(processId);
        }else
        {
          this.toastService.showError(this.toastMessages.aissignResourceErr);
        }
      })
    }
  }


  assignhuman(task){
    let botId=$("#"+task.taskId+"__select").val();
    if(botId!=0){
      this.spinner.show();
      this.rest.assign_bot_and_task(botId,task.taskId,task.assignedUserId,"Human","").subscribe(data=>{
        let response:any=data;
         this.spinner.hide();
        if(response.status!=undefined){
          this.responsedata.find(item=>item.taskId==task.taskId).assignedUserId=String(botId);
          this.automatedtask.find(item=>item.taskId==task.taskId).assignedUserId=String(botId);
          this.toastService.showSuccess(response.status,'response'); 
          if(this.selectedvalue!=""){
            this.checkTaskAssigned(task.processId)
          }
        }else
        {
         this.toastService.showError(response.errorMessage);
        }
      })
    }
  }


  createtaskbotoverlay(taskId)
  {
    localStorage.setItem("taskId",taskId);
    this.router.navigate(["/pages/rpautomation/home"]);
  }


  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }


  resetbot(task:any){
      if(task.taskType=="Automated")
        $("#"+task.taskId+"__select").val((this.responsedata.find(data=>data.taskId==task.taskId).botId));
      else
        $("#"+task.taskId+"__select").val((this.responsedata.find(data=>data.taskId==task.taskId).assignedUserId));
    }  


  startprocess()
  {

    if(this.selectedvalue!=undefined)
    {
      this.spinner.show();
    this.rest.startprocess(this.selectedvalue,this.selectedEnvironment,this.selectedexecutiontype).subscribe(data=>{
      let response:any=data;
      this.spinner.hide();
      if(response.errorMessage==undefined){
        this.toastService.showSuccess(response.status,'response');
        this.update_task_status()
      }else
      {
       this.toastService.showError(response.errorMessage);
      }
      //this.rpa_studio.spinner.hide();
      this.update_task_status();
    },(err)=>{
      
      //this.rpa_studio.spinner.hide();
    })
  }
  }


  resettasks()
  {

    //this.rpa_studio.spinner.show();
    this.spinner.show();
    this.rest.getautomatedtasks(0).subscribe(response=>{
      this.spinner.hide();
      let data:any=response;
      this.responsedata= data.automationTasks
      // this.dataSource2.sort=this.automatedSort;
      // this.dataSource2.paginator=this.paginator10;
      if(this.selectedvalue==undefined)
      {
        this.applyFilter(this.selectedvalue)
      }

    });
  }



  update_task_status()
  {
    this.timer = setInterval(() => {
      this.rest.getautomatedtasks(0).subscribe(response => {
        let responsedata:any=response;
        if(responsedata.automationTasks!=undefined)
        {
          if(responsedata.automationTasks.length==0)
          {
            clearInterval(this.timer);
          }else{
            responsedata.automationTasks.forEach(statusdata=>{
              let data:any;
              // if(statusdata.status=="InProgress" || statusdata.status=="Running")
              // {
              //   data="<span pTooltip='"+statusdata.status+"' class='text-primary'><img src='../../../../assets/images/RPA/DotSpin.gif' class='testplus'></span>";
              // }
              // else if(statusdata.status=="Success" || statusdata.status=="Approved")
              // {
              //   data='<span  pTooltip="'+statusdata.status+'"><img src="../../../../../assets/images/RPA/icon_latest/Success.svg" class="testplus"></span>';
              // }
              // else if(statusdata.status=="Failed" || statusdata.status=="Failure" || statusdata.status=="Rejected")
              // {
              //   data='<span  pTooltip="'+statusdata.status+'"><img src="../../../../../assets/images/RPA/icon_latest/close-red.svg" class="testplus"></span><span class="text-danger"></span>';
              // }
              // else if(statusdata.status=="New")
              // {
              //   data="<span   pTooltip='"+statusdata.status+"'><img src='../../../../../assets/images/RPA/newicon.png' class='testplus1' ></span><span class='text-primary'>" +"</span>";
              // }
              // else if(statusdata.status=="Pending")
              // {
              //   data="<span  pTooltip='"+statusdata.status+"'  class='text-warning'><i class='fa fa-clock'></i></span>";
              // }
              // else if(statusdata.status=="")
              // {
              //   data="-";
              // }
              $("#"+statusdata.taskId+"__status").html(data);

              $("#"+statusdata.taskId+"__failed").html(statusdata.failureTask)

              $("#"+statusdata.taskId+"__success").html(statusdata.successTask)
              this.automatedtask.find(item=>item.taskId==statusdata.taskId).status=statusdata.status;
              if(this.responsedata.find(item=>item.taskId==statusdata.taskId)){
                this.responsedata.find(item=>item.taskId==statusdata.taskId).status=statusdata.status;
           
              }
              // if(responsedata.automationTasks.filter(prodata=>prodata.status=="InProgress"||prodata.status=="Running").length>0)
              // {
              // }else
              // {
              //   clearInterval(timer);
              // }
            })
          }
        }else
        {
          clearInterval(this.timer);
        }

      })

    }, 5000);
  }

  ngOnDestroy() { 
     clearInterval(this.timer)
     let url=window.location.hash;
    window.history.pushState("", "", url.split("?")[0]);
  }

  getenvironments()
  {
    this.rest.listEnvironments().subscribe(response=>{
      let resp:any=response
      let response1:any=resp.sort((a, b) => (a.environmentName.toLowerCase() > b.environmentName.toLowerCase()) ? 1 : ((b.environmentName.toLowerCase() > a.environmentName.toLowerCase()) ? -1 : 0));
      if(resp.errorCode == undefined)
      {
        this.environments=response1;
        this.environmentsData=response1;
        if(this.categaoriesList.length==1)
          this.environments=this.environmentsData.filter(item=>this.categaoriesList[0].categoryId==item.categoryId)
      }
    })
  }

  getCategoryList(processid){
    this.rest.getCategoriesList().subscribe(data=>{
      let catResponse : any;
      catResponse=data
      this.categaoriesList=catResponse.data.sort((a, b) => (a.categoryName.toLowerCase() > b.categoryName.toLowerCase()) ? 1 : ((b.categoryName.toLowerCase() > a.categoryName.toLowerCase()) ? -1 : 0));
      this.getenvironments();
      this.getautomatedtasks(processid);
    },(err)=>{
      this.spinner.hide()
    })
  }

  getUserslist() {
    let masterTenant=localStorage.getItem("masterTenant")
    let tenantid=localStorage.getItem("tenantName")
    this.rest.getuserslist(masterTenant,tenantid).subscribe(data => {
      this.isHumanLoading = "Success"
      let users: any = data;
      users.forEach(e => {
        if (e.user_role_status != "INACTIVE") {
          this.humans_list.push(e);
          this.humans_list.sort((a, b) => a.userId.firstName.localeCompare(b.userId.firstName));
        }
      })
      if (this.isbotloading == "Success" && this.isHumanLoading == "Success") {
        if (this.selectedvalue != "")
          this.checkTaskAssigned(this.selectedvalue)
      }
    }, err => {
      this.isHumanLoading = "Failure"
    })
  }

  getprocesslogs(){

    //document.getElementById("filters").style.display = "none";
    // this.logs_modal=this.modalService.show(template,{class:"logs-modal"})
    //this.logs_modal=this.modalService.show(template,{class:"modal-lg"})
    this.processId1 = this.selectedvalue;
    this.popup=true;
   
  }

  closepop()
  {
    this.popup=false;
    document.getElementById("filters").style.display = "block";

    
  }
  reset_all()
  {
    this.spinner.show();
    this.selectedEnvironment="";
    this.selectedvalue="";
    if(this.categaoriesList.length==1)
    {
      this.selectedcategory=(this.categaoriesList[0].categoryId)
    }else
    {
      this.selectedcategory="";
    }
    this.getautomatedtasks(0)
  }


  startscheduler()
  {
    //document.getElementById("filters").style.display = "none";
    this.schdata={
      processid:this.selectedvalue,
      environment:this.selectedEnvironment,
      processName:this.process_names.find(item=>item.processId==this.selectedvalue).processName,
    }
    this.schedulepopup=true;
  }

  closescheduler()
  {
    this.schedulepopup=false;
    document.getElementById("filters").style.display = "block";


  }

  changesource(botsource,id)
  {
    
    this.responsedata.find(item=>item.taskId==id).sourceType=botsource;
    this.automatedtask.find(item=>item.taskId==id).sourceType=botsource; 
  //  this.dataSource2= new MatTableDataSource(this.responsedata);
    // this.dataSource2.sort=this.automatedSort;
    // this.dataSource2.paginator=this.paginator10;
    if(this.selectedvalue!=undefined)
    {
      this.applyFilter(this.selectedvalue);
      this.cd.detectChanges();
    }
  }

  closeconfig()
  {
    document.getElementById("configuration").style.display="none";
    this.uipath=false;
    this.kofax=false;
    this.blueprism=false;
    this.UiPathconfigoverlay = false;
    this.blueprismconfigoverlay = false;
  }

  getUIpathconfiguration(){
    this.UiPathconfigoverlay = true;
    document.getElementById("UIpathconfiguration").style.display="block";
  }

  getblueprismconfiguration(){
    this.blueprismconfigoverlay = true;
    this.getblueprismconnections()
    document.getElementById("blueprismconfiguration").style.display="block";
  }


  getblueprismconnections()
  {
    this.rest.getblueprisconnections().subscribe(data=>{
     this.blueprism_configs=data;
     this.BluePrismFlag=false;
     this.addBPconfigstatus=false;
    })
  }

  testBluePrismconnection()
  {
    if(this.BluePrismConfigForm.valid)
    {
      let response:any;
      response=this.BluePrismConfigForm.value;
      (response.status==true)?response.status=1:response.status=0;
      response.port=parseInt(response.port);
      this.rest.testcon_blueprism_config(response).subscribe(resp=>{
        let response:any=resp
        this.toastService.showSuccess(response.status,'response');
        if(response.errorCode==undefined){
        this.toastService.showSuccess(response.status,'response');
          }else{
          this.toastService.showError(response.errorMessage);
        }
      })
    }
    else
    {
    
    }
  }

  save_blue_prism_config()
  {
   
    if(this.BluePrismConfigForm.valid)
    {
      let response:any;
      response=this.BluePrismConfigForm.value;
      (response.status==true)?response.status=1:response.status=0;
      response.port=parseInt(response.port);
      if(this.addBPconfigstatus==true)
      {
      this.rest.save_blueprism_config(response).subscribe(resp=>{
        let response:any=resp
       this.toastService.showSuccess(response.status,'response');
        this.BluePrismConfigForm.reset();
        this.getblueprismconnections();
      })
      }
      else if(this.BluePrismFlag==true)
      {
        response["bluePrismId"]=this.bpid;
        this.rest.edit_blueprism_config(response).subscribe(resp=>{
          let response:any=resp
          this.toastService.showSuccess(response.status,'response');
          this.BluePrismConfigForm.reset();
          this.getblueprismconnections();
        })
      }
    }else
    {
     
    }
  }


  getblueprismbots()
  {
    this.rest.getblueprismbots().subscribe(data=>{
      this.blueprismbots=data;
    })
  }

  public bpid:any;
  edit_blue_prism_config(id)
  {
    this.bpid=id;
    let data=this.blueprism_configs.find(data=>data.bluePrismId==id);
    this.BluePrismConfigForm.get("configName").setValue(data.configName);
    this.BluePrismConfigForm.get("bluePrismUsername").setValue(data.bluePrismUsername);
    this.BluePrismConfigForm.get("bluPrismPassword").setValue(data.bluPrismPassword);
    this.BluePrismConfigForm.get("hostAddress").setValue(data.hostAddress);
    this.BluePrismConfigForm.get("username").setValue(data.username);
    this.BluePrismConfigForm.get("password").setValue(data.password);
    this.BluePrismConfigForm.get("port").setValue(data.port);
    this.BluePrismConfigForm.get("status").setValue(data.status==0?false:true);
  
    this.BluePrismFlag=true;
    this.addBPconfigstatus=false;
    this.blueprismconfigoverlay = true;
  }

  delete_blueprism_config(id)
  {
    let Id = [parseInt(id)];
    this.rest.delete_blueprism_config(Id).subscribe(data=>{
      let response:any=data;
       this.toastService.showSuccess(response.status,'response');
          this.getblueprismconnections();
    })
  }

  configuration()
  {
    this.uipath=true;this.kofax=false;this.blueprism=false;
    this.selectedcategory="";
    document.getElementById("configuration").style.display="block";
    this.rest.getOrchestrationconfig().subscribe(items=>{
      let response:any=items
      this.configurations_data=response.value;
      this.configurations=response.value.reverse();
    })
  }


  checked(source,check:Boolean)
  {
    let checkdata:Boolean;
    checkdata=!(check);
    
    if(checkdata==true)
    {
      this.configurations=this.configurations_data.filter(item=>item.sourceType==source).reverse();
      this.checkedsource=source;
    }
    else
    {
    this.configurations=this.configurations_data.reverse();
    this.checkedsource='';
    }
  }
  saveconfiguration()
  {
    if(this.accountName !="" && this.tenantId!="" && this.userKey!="" && this.clientId !="")
    {
      let data:any={
        "accountName":this.accountName,
        "tenantName":this.tenantId,
        "userKey":this.userKey,
        "clientId":this.clientId,
        "active":this.activeStatus,
        "sourceType":this.checkedsource,
      }
      this.rest.saveOrchestrationconfig(data).subscribe(resp=>{
        let response:any=resp;
        if(response.status!=undefined)
        {
        this.toastService.showSuccess(response.status,'response');
          this.configuration();
        }
        else
        {
          this.toastService.showError(response.errorMessage);
        }
      })
      this.accountName="";this.tenantId="";this.userKey="";this.clientId="";this.activeStatus=false;
      this.toastService.showSuccess(this.toastMessages.configAddSucss,'response');
      this.addconfigstatus=false;
    }else
    {
      this.toastService.showWarn(this.toastMessages.fillDetails);
    }
  }


  getuipathbots()
  {
    this.uiPathBotFlag=false;
    this.rest.get_uipath_bots().subscribe((bots)=>{
      let response:any=bots
      
      this.uipath_bots=response.value;
      this.uiPathBotFlag=true;
      if(this.selectedvalue!='')
        this.checkTaskAssigned(this.selectedvalue)
    });
  }


  runsmoketest(taskId)
  {
    let data=this.responsedata.find(item=>item.taskId==taskId)
    let header=" <div class='text-center'><span style='padding:10px;font-size:16px'>Task Name:&nbsp;<a>"+data.taskName+"</a></span><span style='padding:10px;font-size:16px'>Status:&nbsp;<a>"+data.status+"</a></span><span style='padding:10px;font-size:16px'>Source:&nbsp;<a>"+data.sourceType+"</a></span></div><br><br>";
    let errorbody="<div class='text-center'><br><br><i style='font-size:28px;color:red' class='fas  fa-exclamation-triangle'></i><br><br> <div style='font-size:24px;color:red;'> Smoke Test Run Failed</div><br><br></div> "
    let successbody="<div class='text-center'><br><br><i style='font-size:28px;' class='fas text-success  fa-check-circle'></i><br><br> <div style='font-size:24px;' class='text-success'> Smoke Test Run Successfully</div><br><br></div> "
    this.spinner.show()
    setTimeout(()=>{
      this.spinner.hide();
      Swal.fire({
        width: '700px',
        html:header+(data.status=="Success"?successbody:errorbody),
        confirmButtonColor: (data.status=="Success"?"green":"red"),
        confirmButtonText: 'Dismiss',
        showConfirmButton:true
      });
    },5000)
  }

  delete(taskid){
    // Swal.fire({
    //   title: 'Are you Sure?',
    //   text: "You won't be able to revert this!",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   customClass: {
    //     confirmButton: 'btn bluebg-button',
    //     cancelButton:  'btn new-cancelbtn',
    //   },
    //   confirmButtonText: 'Yes, delete it!'
    // }).then((result) => {
    //   if (result.value) {
      this.confirmationService.confirm({
        header:'Are you sure?',
        message:"You won't be able to revert this!",
        acceptLabel:'Yes',
        rejectLabel:'No',
        rejectButtonStyleClass: ' btn reset-btn',
        acceptButtonStyleClass: 'btn bluebg-button',
        defaultFocus: 'none',
        rejectIcon: 'null',
        acceptIcon: 'null',
      accept:()=>{
      this.spinner.show();
      this.rest.deleteTaskInProcess(taskid).subscribe(resp => {
          let value: any = resp
        if (value.message === "Task Deleted Successfully!!") {
          this.getautomatedtasks(this.selectedvalue);
          this.toastService.showSuccess(this.toastMessages.TaskDelete,'response'); 
        }
        else {
          this.toastService.showError(this.toastMessages.deleteError);
        }
        this.spinner.hide();
        })
    }
  })
  }

  addtasks(template){
    this.addTaskForm.reset();
    this.rest.tasksListInProcess(this.selectedvalue).subscribe(resp => {
      this.taskslist = resp.tasks;
    })
    // this.taskslist=[{taskId:1,taskName:"abc"},{taskId:1,taskName:"abc"},{taskId:1,taskName:"abc"},
    // {taskId:1,taskName:"abc"},{taskId:1,taskName:"abc"},
    // {taskId:1,taskName:"abc"},{taskId:1,taskName:"abc"},{taskId:1,taskName:"abc"},{taskId:1,taskName:"abc"},{taskId:1,taskName:"abc"},]
    this.logs_modal = this.modalService.show(template);
  }

  addexistingtasks(){
    //this.spinner.show();
    this.rest.addtaskInProcess(this.addTaskForm.get('tasks').value).subscribe(resp => {
      let value: any = resp
   
    if (value.message === "Task Added Successfully!!") {
      this.getautomatedtasks(this.selectedvalue);
      this.toastService.showSuccess(this.toastMessages.addTask,'response'); 
    }
    else {
      this.toastService.showError(this.toastMessages.deleteError);
    }
    // this.spinner.hide();
    this.logs_modal.hide();
    this.addTaskForm.reset();
  })
  }
  
  changeTaskOwner(userid){// to get userId from users list
    this.userID= userid
  }

  getUserDetails() {  //third party tenant based visibility
    this.dataTransfer.logged_userData.subscribe(res => {
      if (res) {
        this.userDetails = res;
        if(this.userDetails.thirdPartyRPAEnabled){
          this.botSource_list=["EPSoft","UiPath","BluePrism"];
        }
        else{
          this.botSource_list=["EPSoft"];
        }
      }
    })
  }

  clearTableFilters(table: Table) {
    this.searchValue =""
    table.filterGlobal("","")
    table.sortOrder = 0;
    table.sortField = '';
    table.clear();
  }
  closeOverlay(event){  //overlay close 

    this.schedulepopup=event;
  }

  getColor(status) {
    return this.statusColors[status]?this.statusColors[status]:'';
  }

  
}




@Pipe({
  name: 'Checkbotslist'
})
export class Checkbotslist implements PipeTransform {

  transform(value: any,arg1: any,categories:any) {
    let users:any=[],usersbycat:any=[];
    users=value;
    usersbycat=users.filter(item=>item.userId.department==arg1);
    return usersbycat;
  }

}
@Pipe({
  name: 'Checkhumanslist'
})
export class Checkhumanslist implements PipeTransform {

  transform(value: any,arg1: any,categories:any) {
    let users:any=[],usersbycat:any=[];
    users=value;
    usersbycat=users.filter(item=>item.userId.department==arg1);
    return usersbycat;
  }

}
