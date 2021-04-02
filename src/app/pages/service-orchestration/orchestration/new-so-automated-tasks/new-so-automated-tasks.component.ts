import {ViewChild,Input, Component, OnInit,Pipe, PipeTransform } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {RestApiService} from '../../../services/rest-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/filter';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import {sohints} from '../model/so-hints';
import { DataTransferService } from '../../../services/data-transfer.service';
declare var $:any;
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-new-so-automated-tasks',
  templateUrl: './new-so-automated-tasks.component.html',
  styleUrls: ['./new-so-automated-tasks.component.css']
})
export class NewSoAutomatedTasksComponent implements OnInit {
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
  displayedColumns: string[] = ["processName","taskName","processOwner","taskOwner","taskType", "category","sourceType","Assign","status","Operations","Smoke_Test"];
  dataSource2:MatTableDataSource<any>;
  public isDataSource: boolean;
  public userRole:any = [];
  public isButtonVisible = false;
  public bot_list:any=[];
  public humans_list:any=[];
  public process_names:any=[];
  public selected_process_names:any=[];
  public selectedvalue:any;
  public selectedTab:number;
  public responsedata;
  public selectedEnvironment:any='';
  public environments:any=[];
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
  @ViewChild("paginator10",{static:false}) paginator10: MatPaginator;
  @ViewChild("sort10",{static:false}) sort10: MatSort;
  @Input('processid') public processId: any;
  public insertslaForm:FormGroup;
  public BluePrismConfigForm:FormGroup;
  public BluePrismFlag:Boolean=false;

  constructor(
    private route: ActivatedRoute,
    private rest:RestApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private spinner:NgxSpinnerService,
    private http:HttpClient,
    private hints: sohints,
    private dt : DataTransferService,
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

    this.insertslaForm=this.formBuilder.group({
      botName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      botSource: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      breachAlerts: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      cascadingImpact: false,
      /*expectedDate: [],
      expectedTime : [],*/
      expectedEDate : [],
      notificationType: [],
      processName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      retriesInterval: ["", Validators.compose([Validators.maxLength(2)])],
      slaConfigId: ["", Validators.compose([Validators.required, Validators.maxLength(2)])],
      systemImpacted: ["", Validators.compose([ Validators.maxLength(50)])],
      taskOwner: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      thresholdLimit: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      totalRetries: ["", Validators.compose([Validators.maxLength(2)])],
    });
  }

  ngOnInit() {
    this.dt.changeHints(this.hints.soochestartionhints);
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
    this.getenvironments();
    this.getCategoryList(this.processId);
    this.getallbots();
    this.gethumanslist();
    this.getuipathbots();
    this.getblueprismbots();
 }

 SLACon(botId){
   let slaconId = botId;
   this.slabotId = botId;
   let data: any;
   for(data of this.automatedtask)
    {
      if(data.botId==slaconId)
      {
        if(data.sourceType == 'EPSoft')
        {
          this.bot_list.filter(x =>
            {
            if(x.botId == slaconId){
            this.insertslaForm.get("botName").setValue(x.botName);
            }
          });
        }
        else if(data.sourceType == 'UiPath')
         {
           console.log("uiapath_bots",data.sourceType);
             this.uipath_bots.filter(x =>
              {
              if(x.Key == slaconId){
              console.log(x.ProcessKey);
              this.insertslaForm.get("botName").setValue(x.ProcessKey);
              }
            });
        }
        this.updatesladata=data;
        this.insertslaForm.get("processName").setValue(this.updatesladata["processName"]);
        this.insertslaForm.get("taskOwner").setValue(this.updatesladata["taskOwner"]);
        this.insertslaForm.get("botSource").setValue(this.updatesladata["sourceType"]);
        break;
      }
    }
    document.getElementById("SLAConfig").style.display="block";
 }

 savedata(){}

checkboxstatus(data){
  let checkboxstatus = data;
  this.insertslaForm.value.Alerts = checkboxstatus;
}

SLAclose(){
  document.getElementById("SLAConfig").style.display = "none";
  this.resetsla();
}

emailcheckm(){
  if(this.emailcheck == true)
  {
    this.emailcheck = false;
  }
  else
  {
    this.emailcheck = true;
  }
}

smscheckm(){
  if(this.smscheck == true)
  {
    this.smscheck = false;
  }
  else
  {
    this.smscheck = true;
  }
}

cascadingImp(){
  if(this.insertslaForm.value.cascadingImpact == true)

  {
    this.cascadingImpactbtn = true;
  }
  else
  {
    this.cascadingImpactbtn = false;
  }
}

slaalerts(){
  if(this.emailcheck == true){
    if(this.smscheck == true){
      this.insertslaForm.value.notificationType = 'email,sms';
    }
    else{
      this.insertslaForm.value.notificationType = 'email';
    }
  }
  else if(this.smscheck == true)
  {
    this.insertslaForm.value.notificationType = 'sms';
  }
  else
  {
    this.insertslaForm.value.notificationType = '';
  }
  let expectedDate : any;
  expectedDate = new Date();
  //this.insertslaForm.value.expectedDate+"T"+this.insertslaForm.value.expectedTime+":00.000Z"
  let date1: any;

  if((expectedDate.getMonth()+1)<10){
  date1 = expectedDate.getFullYear()+"-0"+(expectedDate.getMonth()+1)+"-"+expectedDate.getDate()+"T00:"+this.insertslaForm.value.expectedEDate+":00.000Z";
  }
  else{
   date1 = expectedDate.getFullYear()+"-"+(expectedDate.getMonth()+1)+"-"+expectedDate.getDate()+"T00:"+this.insertslaForm.value.expectedEDate+":00.000Z";
  }

 let slaalertsc = {
     botId : parseInt(this.slabotId),
    botName : this.insertslaForm.value.botName,
    botSource : this.insertslaForm.value.botSource,
    breachAlerts : this.insertslaForm.value.breachAlerts,
    cascadingImpact : this.insertslaForm.value.cascadingImpact,
    expectedETime :  date1,
    notificationType : this.insertslaForm.value.notificationType,
    processName : this.insertslaForm.value.processName,
    retriesInterval : parseInt(this.insertslaForm.value.retriesInterval),
    slaConfigId : parseInt(this.insertslaForm.value.slaConfigId),
    systemImpacted : this.insertslaForm.value.systemImpacted,
    taskOwner : this.insertslaForm.value.taskOwner,
    thresholdLimit : parseInt(this.insertslaForm.value.thresholdLimit),
    totalRetries : parseInt(this.insertslaForm.value.totalRetries),
  };
  console.log(slaalertsc);
   this.rest.slaconfigapi(slaalertsc).subscribe( res =>
    {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'SLA Configuration Updated Successfully',
        showConfirmButton: false,
        timer: 2000
      })
     /* if(res.errorCode==undefined){
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: "Successfully Connected",
        showConfirmButton: false,
        timer: 2000
      })
      }else{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Connection Failed',
          showConfirmButton: false,
          timer: 2000
        })
      }*/
    });
  this.SLAclose();
}

resetsla(){
  this.insertslaForm.reset();
  //this.insertslaForm.get("thresholdLimit").setValue("");
  this.insertslaForm.get("breachAlerts").setValue("");
  this.emailcheck = false;
  this.smscheck = false;
  this.castoggle = false;
  this.cascadingImpactbtn = false;
  $('.emailcheck').prop('checked', false);
  $('.smscheck').prop('checked', false);
}


 loadbotdatadesign(botId)
  {
    localStorage.setItem("botId",botId);
    this.router.navigate(["/pages/rpautomation/home"]);
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
    this.rest.getAllActiveBots().subscribe(botlist =>
    {
      this.bot_list=botlist;
    });
  }



  getautomatedtasks(process)
  {
    let response:any=[];
    this.rest.getautomatedtasks(process).subscribe(automatedtasks=>{
      response=automatedtasks;

      if(response.automationTasks != undefined)
      {
        this.responsedata=response.automationTasks.map(item=>{
            if(item.sourceType=="UiPath")
              item["taskOwner"]="Karthik Peddinti";
            else if(item.sourceType=="EPSoft")
            {

              this.rest.getAllActiveBots().subscribe(botlist =>
                {
                  this.bot_list=botlist;
                  item["taskOwner"]=this.bot_list.find(bot=>bot.botId==item.botId).createdBy;
                });
            }
            else{
              item["taskOwner"]="---"
            }
            return item;
        });
        this.automatedtask= response.automationTasks;
        this.dataSource2= new MatTableDataSource(response.automationTasks);
        this.dataSource2.sort=this.sort10;
        this.dataSource2.paginator=this.paginator10;
        if(process==0)
        {
          this.getprocessnames(undefined);

        }else
        {
          this.getprocessnames(process);
        }
        this.update_task_status();
      }
      this.spinner.hide();
    },(err)=>{
      this.spinner.hide();
    })
  }



  getprocessnames(processId)
  {
    this.rest.getprocessnames().subscribe(processnames=>{
      let resp:any=[]
      resp=processnames
      this.process_names=resp.filter(item=>item.status=="APPROVED");
      this.selected_process_names=resp.filter(item=>item.status=="APPROVED");
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


  applyFilter(filterValue:any) {
    let processnamebyid=this.process_names.find(data=>filterValue==data.processId);
    this.selectedcategory=parseInt(processnamebyid.categoryId);
    this.applyFilter1(this.selectedcategory);
    this.selectedvalue=processnamebyid.processId;
    filterValue = processnamebyid.processName.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource2.filter = filterValue;
  }

  applyFilter1(value)
  {
    this.selectedcategory=parseInt(value);
    this.dataSource2.filter = this.categaoriesList.find(data=>this.selectedcategory==data.categoryId).categoryName.toLowerCase();
    this.selected_process_names=this.process_names.filter(item=>item.categoryId==this.selectedcategory)
    this.selectedvalue="";
  }


  close()
  {
    document.getElementById("create-bot").style.display ="none";

    document.getElementById("load-bot").style.display ="none";
  }

  assignbot(id)
  {
    let botId=$("#"+id+"__select").val();
    let source=this.responsedata.find(item=>item.taskId==id).sourceType;
    if(source=="UiPath")
    this.responsedata.find(item=>item.taskId==id).taskOwner="Karthik Peddinti";
    else if(source=="EPSoft")
    {
      this.responsedata.find(item=>item.taskId==id).taskOwner=this.bot_list.find(bot=>bot.botId==botId).createdBy;
    }
    else{
      this.responsedata.find(item=>item.taskId==id).taskOwner="---"
    }
    this.dataSource2= new MatTableDataSource(this.responsedata);
    this.dataSource2.sort=this.sort10;
    this.dataSource2.paginator=this.paginator10;
    if(this.selectedvalue!=undefined && this.selectedvalue!="")
    {
      this.applyFilter(this.selectedvalue);
    }
    if(botId!=0)
    this.rest.assign_bot_and_task(botId,id,source,"Automated").subscribe(data=>{
      let response:any=data;
      if(response.status!=undefined)
      {
        Swal.fire("Resource Assigned Successfully","","success");
      }else
      {
        Swal.fire("Failed to Assign Resource","","warning");
      }
    })
  }


  assignhuman(taskid)
  {
    let botId=$("#"+taskid+"__select").val();
    if(botId!=0)
    this.rest.assign_bot_and_task(botId,taskid,"","Human").subscribe(data=>{
      let response:any=data;
      if(response.status!=undefined)
      {
        Swal.fire(response.status,"","success");
      }else
      {
        Swal.fire(response.errorMessage,"","warning");
      }
    })
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


  resetbot(taskid:any)
  {
    $("#"+taskid+"__select").val((this.responsedata.find(data=>data.taskId==taskid).botId));
  }


  startprocess()
  {

    if(this.selectedvalue!=undefined)
    {
    this.rest.startprocess(this.selectedvalue,this.selectedEnvironment).subscribe(data=>{
      let response:any=data;
      if(response.errorMessage==undefined){
      Swal.fire({
        icon: 'success',
        title:response.status,
        showConfirmButton: true,
      });
      this.update_task_status()
    }else
    {
      Swal.fire({
        icon: 'warning',
        title:response.errorMessage,
        showConfirmButton: true,
      })

    }
      //this.rpa_studio.spinner.hide();
      this.update_task_status();
    },(err)=>{
      console.log(err)
      //this.rpa_studio.spinner.hide();
    })
  }
  }


  resettasks()
  {

    //this.rpa_studio.spinner.show();
    this.rest.getautomatedtasks(0).subscribe(response=>{
      let data:any=response;
      this.dataSource2= new MatTableDataSource(data.automationTasks);
      this.dataSource2.sort=this.sort10;
      this.dataSource2.paginator=this.paginator10;
      if(this.selectedvalue==undefined)
      {
        this.applyFilter(this.selectedvalue)
      }

    });
  }



  update_task_status()
  {
    let timer= setInterval(() => {
      this.rest.getautomatedtasks(0).subscribe(response => {
        let responsedata:any=response;
        if(responsedata.automationTasks!=undefined)
        {
          if(responsedata.automationTasks.length==0)
          {
            clearInterval(timer);
          }else{
            responsedata.automationTasks.forEach(statusdata=>{
              let data:any;
              if(statusdata.status=="InProgress" || statusdata.status=="Running")
              {
                data="<span matTooltip='"+statusdata.status+"' class='text-primary'><img src='../../../../assets/images/RPA/DotSpin.gif' style='filter: none; width: 19px;'></span>";
              }
              else if(statusdata.status=="Success")
              {
                data='<span  matTooltip="'+statusdata.status+'"  class="text-success"><i class="fa fa-check-circle"  style="font-size:19px" aria-hidden="true"></i></span>';
              }
              else if(statusdata.status=="Failed")
              {
                data='<span  matTooltip="'+statusdata.status+'"  class="text-danger"><i class="fa fa-times-circle" aria-hidden="true"></i></span>&nbsp;<span class="text-danger"></span>';
              }
              else if(statusdata.status=="New")
              {
                data="<span   matTooltip='"+statusdata.status+"'  ><img src='../../../../../assets/images/RPA/newicon.png' style='filter:none;height:20px' ></span>&nbsp;<span class='text-primary'>" +"</span>";
              }
              else if(statusdata.status=="Pending")
              {
                data="<span  matTooltip='"+statusdata.status+"'  class='text-warning' style='font-size:19px'><i class='fa fa-clock-o'></i></span>";
              }
              else if(statusdata.status=="")
              {
                data="---";
              }
              $("#"+statusdata.taskId+"__status").html(data);

              $("#"+statusdata.taskId+"__failed").html(statusdata.failureTask)

              $("#"+statusdata.taskId+"__success").html(statusdata.successTask)
              if(responsedata.automationTasks.filter(prodata=>prodata.status=="InProgress"||prodata.status=="Running").length>0)
              {
              }else
              {
                clearInterval(timer);
              }
            })
          }
        }else
        {
          clearInterval(timer);
        }

      })

    }, 5000);
  }

  getenvironments()
  {
    this.rest.listEnvironments().subscribe(response=>{
      let resp:any=response
      if(resp.errorCode == undefined)
      {
        this.environments=response;
      }
    })
  }

  getCategoryList(processid)
  {
    this.rest.getCategoriesList().subscribe(data=>{
      let catResponse : any;
      catResponse=data
      this.categaoriesList=catResponse.data;
      this.getautomatedtasks(processid);
    });
  }

  gethumanslist()
  {
    let tenant=localStorage.getItem("tenantName");
    this.rest.getuserslist(tenant).subscribe(data=>
    {
        this.humans_list=data;
    })
  }

  getprocesslogs(){
    this.processId1 = this.selectedvalue;
    this.popup=true;
  }

  closepop()
  {
    this.popup=false;
  }
  reset_all()
  {
    this.selectedEnvironment="";
    this.selectedvalue="";
    this.selectedcategory="";
    this.getautomatedtasks(0)

  }


  startscheduler()
  {
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
  }

  changesource(botsource,id)
  {
    this.responsedata.find(item=>item.taskId==id).sourceType=botsource;
    console.log(this.responsedata.find(item=>item.taskId==id).sourceType)
    this.dataSource2= new MatTableDataSource(this.responsedata);
    this.dataSource2.sort=this.sort10;
    this.dataSource2.paginator=this.paginator10;
    if(this.selectedvalue!=undefined)
    {
      this.applyFilter(this.selectedvalue);
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
        Swal.fire(response.status,"","success");
        if(response.errorCode==undefined){
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: response.status,
            showConfirmButton: false,
            timer: 2000
          })
          }else{
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: response.errorMessage,
              showConfirmButton: false,
              timer: 2000
            })
          }
      })
    }
    else
    {
      console.log("Invalid Form");

    }
  }

  save_blue_prism_config()
  {
    console.log(this.BluePrismConfigForm.value)
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
        Swal.fire(response.status,"","success");
        this.BluePrismConfigForm.reset();
        this.getblueprismconnections();
      })
      }
      else if(this.BluePrismFlag==true)
      {
        response["bluePrismId"]=this.bpid;
        this.rest.edit_blueprism_config(response).subscribe(resp=>{
          let response:any=resp
          Swal.fire(response.status,"","success");
          this.BluePrismConfigForm.reset();
          this.getblueprismconnections();
        })
      }
    }else
    {
      console.log("invalud",this.BluePrismConfigForm.value)
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
    console.log(this.blueprism_configs)
    this.BluePrismFlag=true;
    this.addBPconfigstatus=false;
    this.blueprismconfigoverlay = true;
  }

  delete_blueprism_config(id)
  {
    let Id = [parseInt(id)];
    this.rest.delete_blueprism_config(Id).subscribe(data=>{
      let response:any=data;
          Swal.fire(response.status,"","success");
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
    console.log(checkdata)
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
          Swal.fire(response.status,"","success")
          this.configuration();
        }
        else
        {
          Swal.fire(response.errorMessage,"","warning")
        }
      })
      this.accountName="";this.tenantId="";this.userKey="";this.clientId="";this.activeStatus=false;
      Swal.fire("Configuration added successfully","","success");
      this.addconfigstatus=false;
    }else
    {
      Swal.fire("Pleas fill data","","warning")
    }
  }


  getuipathbots()
  {
    this.rest.get_uipath_bots().subscribe((bots)=>{
      let response:any=bots
      this.uipath_bots=response.value;
    });
  }


  runsmoketest(taskId)
  {
    let data=this.responsedata.find(item=>item.taskId==taskId)
    let header=" <div class='text-center'><span style='padding:10px;font-size:12px'>Task Name:&nbsp;"+data.taskName+"</span><span style='padding:10px;font-size:12px'>Status:&nbsp;"+data.status+"</span><span style='padding:10px;font-size:12px'>Source:&nbsp;"+data.sourceType+"</span></div><br><br>";
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
