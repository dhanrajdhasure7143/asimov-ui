import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import {RestApiService} from '../../../services/rest-api.service';
import {sohints} from '../model/new-so-hints';
import { DataTransferService } from '../../../services/data-transfer.service';
import * as moment from 'moment';
import { NgxSpinnerService } from "ngx-spinner";
import { Pipe, PipeTransform } from '@angular/core';
declare var $:any;
import { NotifierService } from 'angular-notifier';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-new-so-bot-management',
  templateUrl: './new-so-bot-management.component.html',
  styleUrls: ['./new-so-bot-management.component.css']
})
export class NewSoBotManagementComponent implements OnInit {
public slaupdate : boolean = false;
    public botid:any;
    public isTableHasData = true;
    public blueplogsdata = true;
    public respdata1=false;
    public blueprismbotname: any;
    schdata:any;
    displayedColumns: string[] = ["botName","sourceType" ,"department","description","version","botStatus", "Action","Schedule","Logs"];
    departmentlist :string[] = ['Development','QA','HR'];
    displayedblueprismcolums: string[] = ['bluePrismBotSessionid','startTimeStamp','endTimeStamp','status','error'];
    botNameFilter = new FormControl('');
    departmentFilter = new FormControl('');
    blueprimslogs : MatTableDataSource<any>;
    dataSource1:MatTableDataSource<any>;
    dataSource4:MatTableDataSource<any>;
    dataSource5:MatTableDataSource<any>;
    viewlogid="check123";
    processnames:any=[]
    viewlogid1="check456";
    logflag:String;
    respdata2:Boolean;
    selectedcat:any="";
    search:any="";    
    savebotrespose:any;
    public selected_source:any = "";
    public sla_bot:any
    public isDataSource: boolean;
    public userRole:any = [];
    public isButtonVisible = false;
    public bot_list:any=[];
    public process_names:any=[];
    public selectedvalue:any;
    public selectedTab:number;
    public responsedata;
    form: FormGroup;
    public selectedEnvironment:any='';
    public environments:any=[];
    public categaoriesList:any=[];
    public automatedtasks:any=[];
    public insertslaForm_so_bot:FormGroup;
    public emailcheck: boolean = false;
    public smscheck: boolean = false;
    public castoggle:boolean = false;
    //public expectedTime : any = 0;
    public expectedDate : any = 0;
    public automatedtask: any;
    public updatesladata: any;
    public fakearray:any=(new Array(60));
  public cascadingImpactbtn: boolean = false;
    log_botid:any;
    log_version:any;
    filteredLogs:any=[];
    public slaconId:any;
    public sla_list:any=[];
    public datasourcelist : any = [];
    public timer:any;
    public logsmodalref:BsModalRef;
    public usersList:any=[];
    public allVersionsByBotId:any=[];
    public allLogs:any=[];
    public logTasks:any=[];
    logsbotid:any;
    selectedversion:any;
    @ViewChild("paginator1",{static:false}) paginator1: MatPaginator;
    @ViewChild("sort1",{static:false}) sort1: MatSort;
    @ViewChild("paginator4",{static:false}) paginator4: MatPaginator;
    @ViewChild("paginator5",{static:false}) paginator5: MatPaginator;
    @ViewChild("paginator6",{static:false}) paginator6: MatPaginator;
    @ViewChild("sort4",{static:false}) sort4: MatSort;
    @ViewChild("sort5",{static:false}) sort5: MatSort;
    @ViewChild("sort6",{static:false}) sort6: MatSort;
    @ViewChild("paginator7",{static:false}) paginator7: MatPaginator;
    @ViewChild("sort7",{static:false}) sort7: MatSort;

    displayedColumns4: string[] = ['run_id','version','start_date','end_date' , "bot_status"];
    Viewloglist:MatTableDataSource<any>;
    displayedColumns5: string[] = ['task_name','start_date','end_date','status','error_info' ];
    uipathlogs:MatTableDataSource<any>;
    displayedColumns6: string[] = ['ReleaseName','StartTime','EndTime','State','Info'];
    logbyrunid:MatTableDataSource<any>;
    popup:Boolean=false;
    constructor(private route: ActivatedRoute,
      private rest:RestApiService,
      private router: Router,
     // private hints: sohints,
      private dt : DataTransferService,
      private spinner:NgxSpinnerService,
      private formBuilder: FormBuilder,
      private notify:NotifierService,
      private modalService:BsModalService,
      private detectChanges:ChangeDetectorRef
      )
    {
      this.insertslaForm_so_bot=this.formBuilder.group({
        botName: ["", Validators.compose([Validators.required])],
        //botSource: ["", Validators.compose([Validators.required])],
        breachAlerts: [""],
        //notificationType: [""],
        retriesInterval: [""],
        slaConfigId: [""],
        taskOwner: ["", Validators.compose([Validators.required])],
        thresholdLimit: [""],
        email:[false],
        sms:[false],
        totalRetries: [""],
      });
    }

  ngOnInit() {
   // this.dt.changeHints(this.hints.botmanagment);
    this.spinner.show();
    this.getCategoryList();
    this.getallbots();
    this.getautomatedtasks();
    this.getprocessnames();
    this.get_sla_list();
    this.getusersList();
    this.popup=false;
  }


  ngAfterViewInit(): void {
    console.log(this.sort5)
  }
  method(){
    let result: any = [];
    this.dataSource1 = this.datasourcelist;
    if(this.selectedcat == undefined ){
      this.selectedcat = '';
    }
    if(this.selected_source == undefined ){
      this.selected_source = '';
    }
    if(this.search == undefined){
      this.search = '';
    }
    if(this.search != '' && this.selected_source != '' && this.selectedcat != '')
    {
      let category =this.categaoriesList.find(val=>this.selectedcat==val.categoryId).categoryName;
      for(let a of this.datasourcelist){
        if( category == a.department){
          if(this.selected_source == a.sourceType){
          result.push(a);
        }
        }
      }
      this.respdata1=(result.lenght>0)?false:true;
      this.dataSource1 = new MatTableDataSource(result);
      let value1 = this.search.toLowerCase();
       this.dataSource1.filter = value1;
       this.dataSource1.sort=this.sort1;
       this.dataSource1.paginator=this.paginator1;
      
    }
    else if(this.search != '' && this.selected_source !="")
    {
      for(let a of this.bot_list){
      
        if(this.selected_source == a.sourceType){
          result.push(a);
        }
      }
      
      this.respdata1=(result.length>0)?false:true;
      this.dataSource1 = new MatTableDataSource(result);
      let value1 = this.search.toLowerCase();
       this.dataSource1.filter = value1;
       this.dataSource1.sort=this.sort1;
       this.dataSource1.paginator=this.paginator1;
    }
    else if(this.search != '' && this.selectedcat != '')
    {
      let category =this.categaoriesList.find(val=>this.selectedcat==val.categoryId).categoryName;
      for(let a of this.bot_list){
     
        if( category == a.department){
          result.push(a);
        }
      }
      
      this.respdata1=(result.length>0)?false:true;
      this.dataSource1 = new MatTableDataSource(result);
      let value1 = this.search.toLowerCase();
      
       this.dataSource1.filter = value1;
     
       this.dataSource1.sort=this.sort1;
       this.dataSource1.paginator=this.paginator1;
    }
    else if(this.selected_source !='' && this.selectedcat != '')
    {
      let category =this.categaoriesList.find(val=>this.selectedcat==val.categoryId).categoryName;
      for(let a of this.datasourcelist){
        if( category == a.department){
          if(this.selected_source == a.sourceType){
          result.push(a);
          if(this.search != '')
          {
            let value1 = this.search.toLowerCase();
            result.filter = value1;
           
          }
        }
        }
      }
      
      this.respdata1=(result.length>0)?false:true;
      this.dataSource1 = new MatTableDataSource(result);
      this.dataSource1.sort=this.sort1;
      this.dataSource1.paginator=this.paginator1;
    }
    else if(this.search !="")
    {
      this.dataSource1 = new MatTableDataSource(this.datasourcelist);
      this.dataSource1.sort=this.sort1;
      this.dataSource1.paginator=this.paginator1;
      let value1 = this.search.toLowerCase();
      this.dataSource1.filter = value1;
      this.respdata1=(this.dataSource1.filteredData.length>0)?false:true;
      
    }
    else if(this.selected_source!="")
    {
      for(let a of this.bot_list){
      
        if(this.selected_source == a.sourceType){
          result.push(a);
        }
      }
      
      this.respdata1=(result.length>0)?false:true;
      this.dataSource1 = new MatTableDataSource(result);
      this.dataSource1.sort=this.sort1;
      this.dataSource1.paginator=this.paginator1;
    }
    else if(this.selectedcat!="")
    {
      let category =this.categaoriesList.find(val=>this.selectedcat==val.categoryId).categoryName;
      for(let a of this.bot_list){
       
        if( category == a.department){
          result.push(a);
        }
      }
      this.respdata1=(result.length>0)?false:true;
      this.dataSource1 = new MatTableDataSource(result);
      this.dataSource1.sort=this.sort1;
      this.dataSource1.paginator=this.paginator1;
    }
    else
    {
      this.dataSource1=new MatTableDataSource(this.bot_list);
      this.dataSource1.paginator=this.paginator1;
      this.dataSource1.sort=this.sort1;

    }
  }

  getslaconfig(){

  }
  SelectSLACon(bot){
    
    this.sla_bot=bot;
    if(this.sla_bot.sourceType=="EPSoft")
      this.slaconId=this.sla_list.find(item=>item.botId==bot.botId);
    else if(this.sla_bot.sourceType=="UiPath")
      this.slaconId=this.sla_list.find(item=>item.botName==bot.botName+"_Env");
    else
      this.slaconId=this.sla_list.find(item=>item.botName==bot.botName);
    if(this.slaconId!=undefined)
    {
      //this.insertslaForm_so_bot.get("botName").setValue(this.slaconId.botName);
      this.insertslaForm_so_bot.get("botName").setValue(bot.botName);
      //this.insertslaForm_so_bot.get("botSource").setValue(this.slaconId.botSource);
      this.insertslaForm_so_bot.get("breachAlerts").setValue(this.slaconId.breachAlerts);
      this.insertslaForm_so_bot.get("taskOwner").setValue(this.slaconId.taskOwner);
      this.insertslaForm_so_bot.get("retriesInterval").setValue(this.slaconId.retriesInterval);
      this.insertslaForm_so_bot.get("thresholdLimit").setValue(this.slaconId.thresholdLimit);
      this.insertslaForm_so_bot.get("totalRetries").setValue(this.slaconId.totalRetries);
      this.insertslaForm_so_bot.get("slaConfigId").setValue(this.slaconId.slaConfigId);
      /*if(this.slaconId.notificationType=="email")
        this.insertslaForm_so_bot.get("email").setValue(true);
      if(this.slaconId.notificationType=="sms")
        this.insertslaForm_so_bot.get("sms").setValue(true);
      if(this.slaconId.notificationType=="email,sms")
      {
        this.insertslaForm_so_bot.get("sms").setValue(true);
        this.insertslaForm_so_bot.get("email").setValue(true);
      }*/
    }
    else
    {
      this.insertslaForm_so_bot.get("taskOwner").setValue(this.sla_bot.createdBy);
      this.insertslaForm_so_bot.get("botName").setValue(this.sla_bot.botName);
      //this.insertslaForm_so_bot.get("botSource").setValue(this.sla_bot.sourceType);
      this.insertslaForm_so_bot.get("breachAlerts").setValue("");
      this.slaconId=undefined
    }
    document.getElementById("SLAConfig_overlay").style.display="block";
  }


  get_sla_list()
  {
    this.rest.getslalist().subscribe(sla_list=>{
      this.sla_list=sla_list;
    })
  }

 checkboxstatus(data){
   let checkboxstatus = data;
   this.insertslaForm_so_bot.value.Alerts = checkboxstatus;
 }

 SLAclose_SO_bot(){
   document.getElementById("SLAConfig_overlay").style.display = "none";
   this.resetsla();
 }
 slaalerts(){
  /*let notificationtype="";
  if(this.insertslaForm_so_bot.get("email").value==true)
    notificationtype="email"
  if(this.insertslaForm_so_bot.get("sms").value==true)
    notificationtype="sms"
  if(this.insertslaForm_so_bot.get("sms").value==true&&this.insertslaForm_so_bot.get("email").value==true)
    notificationtype="email,sms"*/
   let slaalertsc = {
     //botName : this.insertslaForm_so_bot.value.botName,
     botSource : "EPSoft",
     breachAlerts : this.insertslaForm_so_bot.value.breachAlerts,
     cascadingImpact : false,
     expectedETime : "0000-00-00T00:00:00.000Z",
     notificationType : "email",
     processName : "NA",
     retriesInterval :  1,
     slaConfigId :  parseInt(this.insertslaForm_so_bot.value.slaConfigId),
     systemImpacted : "NA",
     taskOwner : this.insertslaForm_so_bot.value.taskOwner,
     thresholdLimit :  parseInt(this.insertslaForm_so_bot.value.thresholdLimit),
     totalRetries :  parseInt(this.insertslaForm_so_bot.value.totalRetries),
     notificationStatus:1,
     notificationStatusError:1
   };
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
            Swal.fire("Success",resp.Status,"success")
            this.get_sla_list();
            document.getElementById("SLAConfig_overlay").style.display = "none";
          }
          else
            Swal.fire("Error",resp.errorMessage,"error")
    });
   else
    this.rest.update_sla_config(slaalertsc).subscribe( res =>
    {
          let resp:any=res
          if(resp.errorMessage==undefined)
          {
            Swal.fire("Success",resp.Status,"success")
            this.get_sla_list();
            document.getElementById("SLAConfig_overlay").style.display = "none";
          }
          else
            Swal.fire("Error",resp.errorMessage,"error");

    });
 }

 resetsla(){
   this.insertslaForm_so_bot.reset();
   this.insertslaForm_so_bot.get("thresholdLimit").setValue("");
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

  getallbots()
  {
    this.spinner.show()
    this.selected_source="";
    this.rest.getallsobots().subscribe((botlist:any) =>
    {
      if(botlist.errorMessage!=undefined)
      {
        this.spinner.hide();
        this.respdata1=true
        Swal.fire("Error",botlist.errorMessage,"error");
      }else
      {
        this.respdata1=(botlist.length >0)? false: true;
        botlist.sort((a,b) => a.createdAt > b.createdAt ? -1 : 1);
        botlist=botlist.map((item:any)=>{
          let object:any=item;
          (this.categaoriesList.find(resp => resp.categoryId==item.department)!=undefined)?
          object.department=this.categaoriesList.find(resp => resp.categoryId==object.department).categoryName:object.department="-";
          return {
            botId:object.botId,
            botName:object.botName,
            botStatus:object.botStatus,
            description:object.description,
            department:object.department,
            sourceType:object.sourceType,
            categoryName:object.categoryName,
            version:object.version
          };
        });

        this.bot_list=botlist;
        this.datasourcelist = this.bot_list;
        this.dataSource1= new MatTableDataSource(botlist);
        this.isDataSource = true;
        this.dataSource1.sort=this.sort1;
        this.dataSource1.paginator=this.paginator1;
        this.spinner.hide();
    }
    },(err)=>{
      console.log(err)
      this.spinner.hide();
      Swal.fire("Error","Unable to get bots data","error")
    })
  }


  // update_bot_status(){
  //   this.timer = setInterval(() => {
  //     this.rest.getallsobots().subscribe(botlist =>{
  //       let responsedata:any=botlist
  //       responsedata.forEach(statusdata => {
  //         let data:any;
  //         if(statusdata.status=="InProgress" || statusdata.status=="Running")
  //               {
  //                 data="<span matTooltip='"+statusdata.status+"' style='filter: none; width: 19px;' class='text-primary'><img src='../../../../assets/images/RPA/DotSpin.gif' style='filter: none; width: 19px;'></span>";
  //               }
  //               else if(statusdata.botStatus=="Success" || statusdata.botStatus=="Completed")
  //               {
  //                 data='<span  matTooltip="'+statusdata.botStatus+'"  style="filter: none; width: 19px;"  class="text-success"><i class="fa fa-check-circle"  style="font-size:19px" aria-hidden="true"></i></span>';
  //               }
               
  //               else if(statusdata.botStatus=="Failure" || statusdata.botStatus=="Failed")
  //               {
  //                 data='<span  matTooltip="'+statusdata.botStatus+'"    style="filter: none; width: 19px;"  class="text-danger"><i class="fa fa-times-circle" aria-hidden="true"></i></span>&nbsp;<span class="text-danger"></span>';
  //               }
                
  //         $("#"+statusdata.botId+"__status").html(data);
  //       });
          
  //       })
  //   }, (5*60000));
  
  // }

  updateLog(logid,Logtemplate)
  {
   
     this.spinner.show();
    this.rest.updateBotLog(this.log_botid,this.log_version,logid).subscribe(data=>{
       let response:any=data;  
       this.spinner.hide();
       if(response.errorMessage==undefined)
         this.getEpsoftLogs(this.log_botid,this.log_version,Logtemplate,'update');
       else
         Swal.fire("Error",response.errorMessage,"error");
    },err=>{
      console.log(err)
      this.spinner.hide();
      Swal.fire("Error","Unable to update logs","error")
    });
  }

  getEpsoftLogs(botid ,version, template, action){
   // this.getBotVerions(botid);
    
   
    // this.log_botid=botid;
     this.log_version=version;
    // this.detectChanges.detectChanges()
    // this.viewlogid1=undefined;
    // this.spinner.show();
    // this.logflag="Loading";
    // this.rest.getviewlogdata(botid).subscribe((data:any) =>{
    //   this.spinner.hide();
    //   if(data.errorMessage==undefined)
    //   {
    //     this.logflag="Success"
    //     let log=data.map((item:any)=>{
    //       if(item.start_time != null)
    //       {
    //         let startdate=item.start_time.split("T");
    //         item["start_date"]=startdate[0];
    //         item.start_time=startdate[1].slice(0,8);
    //       }else
    //       {
    //         item["start_date"]="-";
    //         item.start_time="-";
    //       }
    //       if(item.end_time != null)
    //       {
    //         let enddate=item.end_time.split("T");
    //         item["end_date"]=enddate[0];
    //         item.end_time=enddate[1].slice(0,8);
    //       }else
    //       {
    //         item["end_date"]="---";
    //         item.end_time="---";
    //       }
    //       return item;
    //     });
    //     this.allLogs=[...log.sort((a,b) => a.run_id > b.run_id ? -1 : 1)];
    //     this.filteredLogs=[...this.allLogs.filter((item:any)=>item.version==version)] 
    //     if(action=="open")
    //       this.logs_modal=this.modalService.show(template,{class:"logs-modal"});
    //     this.Viewloglist = new MatTableDataSource(this.filteredLogs);
    //     this.detectChanges.detectChanges()
    //     this.Viewloglist.paginator=this.paginator4;
    //     this.Viewloglist.sort=this.sort4;
    //   }
    //   else
    //   {
    //     this.logflag="Error";
    //     Swal.fire("Error",data.errorMessage,"error");
    //   }
    // },(err)=>{
    //   console.log(err)
    //   this.spinner.hide()
    //   this.logflag="Error"
    //   Swal.fire("Error","Unable to get logs","error")
    // });
 }


 
 changeEpsoftLogs(version)
 {
    this.log_version=version;
    this.filteredLogs=[...this.allLogs.filter((item:any)=>item.version==version)]
    this.Viewloglist = new MatTableDataSource(this.filteredLogs);
    this.detectChanges.detectChanges()
    this.Viewloglist.paginator=this.paginator4;
    this.Viewloglist.sort=this.sort4;
 }


 public AllVersions:any=[]
 getBotVerions(botId:number,version,template)
 {
  this.spinner.show()
   this.AllVersions=[];
   this.logsbotid=botId
    console.log("botid",botId);
   this.rest.getBotVersion(botId).subscribe((data:any)=>{
     this.spinner.hide();
      if(data.errorMessage==undefined){
        this.AllVersions=data;
        this.selectedversion=version
        this.logsmodalref=this.modalService.show(template, {class:"logs-modal"})
      }
       
      else
      {
        Swal.fire("Error",data.errorMessage,"error");
      }
   },err=>{
      this.spinner.hide()
      Swal.fire("Error","Unable to get versions","error")
   })
 }



 public botrunid:number;
 ViewlogByrunid(runid){
   this.botrunid=runid;
   this.spinner.show();
   this.logflag="Loading"
   this.rest.getViewlogbyrunid(this.log_botid,this.log_version,runid).subscribe((data:any)=>{
      this.spinner.hide();
      if(data.errorMessage==undefined)
      {
        this.logTasks=[...data.map(rlog=>{
                        rlog["start_date"]=rlog.start_time;
                        rlog["end_date"]=rlog.end_time;
                        rlog.start_time=rlog.start_time;
                        rlog.end_time=rlog.end_time;
                        return rlog;
                      })];
        this.logflag="Success";
        this.logbyrunid = new MatTableDataSource(this.logTasks);
        this.detectChanges.detectChanges();
        this.logbyrunid.paginator=this.paginator5;
        this.logbyrunid.sort=this.sort5;
        this.viewlogid1=runid;
      }else
      {
        this.logflag="Error";
        Swal.fire("Error",data.errorMessage,"error")
      }
    },(err)=>{
      console.log(err)
      this.spinner.hide();
      this.logflag="Error";
      Swal.fire("Error","Failed to get bot logs","error");
    })
  }

  



   getschecdules(botId)
   {

    // this.rest.scheduleList(botId).subscribe((data)=> this.scheduleResponse(data))
   }



   executionAct(botid,source) {
    this.spinner.show();
   
      if(source=="EPSoft")
      this.rest.execution(botid).subscribe(res =>{
        let response:any;
        response=res;
        this.spinner.hide();
        if(response.status!= undefined)
        Swal.fire("Success",response.status,"success")
        else
        Swal.fire("Error",response.errorMessage,"error");
      },err=>{
        this.spinner.hide();
        Swal.fire("Error","Unable to execute bot","error")
      });
      else if(source=="UiPath")
      this.rest.startuipathbot(botid).subscribe(res=>{
        let response:any=res;
        this.spinner.hide();
        if(response.value!=undefined)
        {
          Swal.fire("Success","Bot  Execution Initated Successfully !!","success");
        }
        else
        {
          Swal.fire("Error",response.errorMessage,"error");
        }
      },(err)=>{
        
        this.spinner.hide();
        Swal.fire("Error","Failed to start bot","error")
      })
      // else if(source=="BluePrism")
      // {
      //   let bot=this.bot_list.find(data=>data.botId==botid)
      //   this.rest.start_blueprism_bot(bot.botName).subscribe(data=>{
      //     console.log(data);
      //     this.spinner.hide();
      //     Swal.fire("Bot Initiated Successfully!","","success");
      //     this.notify.notify("success",data);
      //   });
      // }
      else if(source=="BluePrism")
      {
        let bot=this.bot_list.find(data=>data.botId==botid)
        this.spinner.show();
          setTimeout(()=>{
            this.spinner.hide();
            Swal.fire("Success","Bot Execution initiated successfully","success");
          },3000)
        this.rest.start_blueprism_bot(bot.botName).subscribe(data=>{
          // console.log(data);
          // this.spinner.hide();
          // Swal.fire("Bot Initiated Successfully!","","success");
          
          let response:any=data;
          if(response.errorMessage==undefined)
           this.notify.notify("success",response.status);
          else
           this.notify.notify("error",response.errorMessage);
        },(err)=>{

          this.spinner.hide();
          Swal.fire("Error","Failed to start bot","error");
        });
      }



    }


    pauseBot(botId) 
    {

      this.rest.getUserPause(botId).subscribe(data => {
        let  response:any=data;
        if(response.errorMessage==undefined)
        {
          Swal.fire("Success",response.status,"success")
        }
        else
          Swal.fire("Error",response.errorMessage,"error")
      }, err=>{
        Swal.fire("Error","Unable to pause bot","error")
      });
      
    }

    resumeBot(botid) {
        this.rest.getUserResume(botid).subscribe(data => {
           let response:any=data;
           response.errorMessage==undefined?Swal.fire("Success",response.status,"success"):Swal.fire("Error",response.errorMessage,"error");
        })
    }

    stopBot(botid) {
     
          this.spinner.show();
          this.rest.stopbot(botid,"").subscribe(data=>{
            let response:any=data;
            
            this.spinner.hide();
            response.errorMessage==undefined?Swal.fire("Success",response.status,"success"):Swal.fire("Error",response.errorMessage,"error"); 
          },(err)=>{
        
            this.spinner.hide();
            Swal.fire("Error","Bot failed to stop","error");
          })
    }

    public bluePrsimAllLogs:any=[]
    getBluePrismlogs(botname){
      $(".tour_guide").hide()
      this.blueprismbotname = botname;
     
      document.getElementById("divblueprismlogs").style.display = "block";
      let blueprismlogs:any=[]
      this.spinner.show();
      this.rest.get_blue_prism_logs(botname).subscribe(logsdataresp=>{
      let response:any=logsdataresp;
     
      if(response.length > 0)
       {
        this.blueplogsdata = true;
       }
       else 
       {
        this.blueplogsdata = false;
       }
        if(response.errorMessage==undefined)
        {
          blueprismlogs=response.sort((right,left)=>{
            return moment.utc(left.startTimeStamp).diff(moment.utc(right.startTimeStamp))
          });
          // blueprismlogs=blueprismlogs.map(item=>{
          //   item["startTimeStamp"]=moment(item.startTimeStamp).format("MMM D ,yyyy, HH:MM");
          //   item["endTimeStamp"]=moment(item.endTimeStamp).format("MMM D ,yyyy, HH:MM");
          //   return item;
          // })
          this.bluePrsimAllLogs=[...blueprismlogs]
          this.blueprimslogs = new MatTableDataSource(blueprismlogs);
          this.blueprimslogs.sort=this.sort7;
          this.blueprimslogs.paginator=this.paginator7;
          this.spinner.hide()
        }
        else
        {
          this.spinner.hide()
        }
      },(err)=>{
        this.spinner.hide();
      })
   ;
    }
    viewblueprismlogclose(){
      $(".tour_guide").show()
      document.getElementById("divblueprismlogs").style.display = "none"
    }


    public uipathbotName:any;
    public uipathAllLogs:any=[];
    getuipathlogs(template,botname,action)
    {
      
      this.uipathbotName=botname;
      this.spinner.show();
      this.rest.getuipathlogs().subscribe(resp=>{
        let response:any=resp;
        let logs:any=response.value.filter(rest=>rest.ReleaseName==botname+"_Env");
        let logsbytime:any=logs.sort((right,left)=>{
          return moment.utc(left.StartTime).diff(moment.utc(right.StartTime))
        });
        this.uipathAllLogs=logsbytime;
        this.uipathlogs=new MatTableDataSource(logsbytime);
        this.detectChanges.detectChanges();
        this.uipathlogs.sort=this.sort6;
        this.uipathlogs.paginator=this.paginator6;
        this.spinner.hide();
        if(action=="closed")
        this.logsmodalref=this.modalService.show(template,{class:"logs-modal"});
      },err=>{
        console.log(err)
        this.spinner.hide()
        Swal.fire("Error","Unable to get uipath bots","error");
      });


    }



    sortLogs(sourceType:String, sortEvent:any, tableType:String)
    {
      let sortArray:any=[]
      if(sourceType=='EPSOFT')
      {
        if(tableType=='LOGS')
          sortArray=[...this.filteredLogs];
        else if(tableType=='RUNS')
          sortArray=[...this.logTasks]
      }
      else if(sourceType=="UIPATH")
      {
        sortArray=[...this.uipathAllLogs];
      }
      else if(sourceType=="BLUEPRISM")
      {
        sortArray=[...this.bluePrsimAllLogs];
      }
      let sortedArray:any=[]
      if(sortEvent.direction!='')
        sortedArray=sortArray.sort(function(a,b){
          let check_a=isNaN(a[sortEvent.active])?a[sortEvent.active].toUpperCase():a[sortEvent.active];
          let check_b=isNaN(b[sortEvent.active])?b[sortEvent.active].toUpperCase():b[sortEvent.active];
          if (sortEvent.direction=='asc')
            return (check_a > check_b) ? 1 : -1;
          else
            return (check_a < check_b) ? 1 : -1;
        },this);
      else
        sortedArray=[...sortArray];
      if(sourceType=='BLUEPRISM')
      {
        this.blueprimslogs= new MatTableDataSource(sortedArray);
        this.blueprimslogs.sort=this.sort7;
        this.blueprimslogs.paginator=this.paginator7;
      }
      else if(sourceType=='UIPATH')
      {
        this.uipathlogs=new MatTableDataSource(sortedArray);
        this.uipathlogs.sort=this.sort6;
        this.uipathlogs.paginator=this.paginator6;
      }
      else if(sourceType=='EPSOFT')
      {
        if(tableType=="LOGS")
        {
          this.Viewloglist = new MatTableDataSource(sortedArray);
          this.detectChanges.detectChanges()
          this.Viewloglist.paginator=this.paginator4;
          this.Viewloglist.sort=this.sort4;
        }
        else if(tableType=="RUNS")
        {
          this.logbyrunid= new MatTableDataSource(sortedArray);
          this.detectChanges.detectChanges();
          this.logbyrunid.paginator=this.paginator5;
          this.logbyrunid.sort=this.sort5;
        }
      }
    }

    viewuipathlogclose()
    {
      $(".tour_guide").show()
      document.getElementById("uipathlogs").style.display="none";
    }

   /* applyFilter(filterValue:any) {
      console.log(filterValue)
      let category=this.categaoriesList.find(val=>filterValue==val.categoryId);
      //this.selectedvalue=filterValue;
      filterValue = category.categoryName.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      console.log(filterValue);
      this.dataSource1.filter = filterValue;
    }


    applyFilter2(filterValue: string) {

      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      this.dataSource1.filter = filterValue;
    }

    applyFilter3(filterValue: string) {
      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      this.dataSource1.filter = filterValue;
    }
    */
   
  getCategoryList(){
    this.rest.getCategoriesList().subscribe(data=>{
      let catResponse : any;
      catResponse=data
      this.categaoriesList=catResponse.data.sort((a, b) => (a.categoryName.toLowerCase() > b.categoryName.toLowerCase()) ? 1 : ((b.categoryName.toLowerCase() > a.categoryName.toLowerCase()) ? -1 : 0));
      (this.categaoriesList.length==1?this.selectedcat=this.categaoriesList[0].categoryId:"")
    });
  }
  getusersList()
  {
    let tenant=localStorage.getItem("tenantName");
    this.rest.getuserslist(tenant).subscribe((data:any)=>
    {
      if(data.errorMessage==undefined)
      {
        this.usersList=data;
      }
      else
      {
        Swal.fire("Error","Unable to get users list","error");
      }
    },err=>{
      console.log(err);
      Swal.fire("Error","Unable to get users list","error");
    })
  }


  getautomatedtasks()
  {
    this.rest.getautomatedtasks(0).subscribe(tasks=>{
      this.automatedtasks=tasks;
    })
  }

    getprocessnames()
    {
      this.rest.getprocessnames().subscribe(processnames=>{
        this.processnames=processnames;
      })
    }



    openscheduler(bot)
    {
      $(".tour_guide").hide();
      this.botid=bot.botId;
      this.schdata={
        botid:bot.botId,
        source:bot.sourceType,
        version:bot.version,
        botname:bot.botName
      }
      this.popup=true;
    }


    close()
    {
      $(".tour_guide").show();
      this.popup=false;
    }

    reset()
    {
      if(this.categaoriesList.length==1)
        this.selectedcat=this.categaoriesList[0].categoryId;
      else
        this.selectedcat="";
      this.search=""
      this.getallbots()
    }



    /*runsmoketest(botid)
    {
      let data=this.bot_list.find(item=>item.botId==botid)
      let header=" <div class='text-center'><span style='padding:10px;font-size:12px'>Bot Name:&nbsp;"+data.botName+"</span><span style='padding:10px;font-size:12px'>Status:&nbsp;"+data.botStatus+"</span><span style='padding:10px;font-size:12px'>Source:&nbsp;"+data.sourceType+"</span></div><br><br>";
      let errorbody="<div class='text-center'><br><br><i style='font-size:28px;color:red' class='fas  fa-exclamation-triangle'></i><br><br> <div style='font-size:24px;color:red;'> Smoke Test Run Failed</div><br><br></div> "
      let successbody="<div class='text-center'><br><br><i style='font-size:28px;' class='fas text-success  fa-check-circle'></i><br><br> <div style='font-size:24px;' class='text-success'> Smoke Test Run Sucessfully</div><br><br></div> "
      this.spinner.show();
      setTimeout(()=>{
        this.spinner.hide();
        Swal.fire({
          width: '500px',
          html:header+(data.botStatus=="Success"?successbody:errorbody),
          confirmButtonColor: (data.botStatus=="Success"?"green":"red"),
          confirmButtonText: 'Dismiss',
          showConfirmButton:true
        });
      }, 5000)

    }*/

    runsmoketest(botId){
      let data=this.bot_list.find(item=>item.botId==botId);
      let header=" <div class='text-center'><span style='padding:10px;font-size:16px'>Bot Name:&nbsp;<a>"+data.botName+"</a></span><span style='padding:10px;font-size:16px'>Status:&nbsp;<a>"+data.botStatus+"</a></span><span style='padding:10px;font-size:16px'>Source:&nbsp;<a>"+data.sourceType+"</a></span></div><br><br>";
      let errorbody="<div class='text-center'><br><br><i style='font-size:28px;color:red' class='fas  fa-exclamation-triangle'></i><br><br> <div style='font-size:24px;color:red;'> Smoke Test Run Failed</div><br><br></div> "
      let successbody="<div class='text-center'><br><br><i style='font-size:28px;' class='fas text-success  fa-check-circle'></i><br><br> <div style='font-size:24px;' class='text-success'> Smoke Test Run Successfully</div><br><br></div> "
      this.spinner.show();
      if(data.sourceType == 'BluePrism'){
      let botName = data.botName;
      this.rest.runsmoketestBluePrism(botName).subscribe(processnames=>{
        let response:any;
        this.spinner.hide();
        response=processnames;
        response =JSON.parse(response);
        if(response.status!= undefined)     
       {
        Swal.fire({
          width: '700px',
          html:header+(successbody),
          confirmButtonColor: "green",
          confirmButtonText: 'Dismiss',
          showConfirmButton:true
        });
      }
        else{
        Swal.fire({
          width: '700px',
          html:header+(errorbody),
          confirmButtonColor: "warning",
          confirmButtonText: 'Dismiss',
          showConfirmButton:true
        });
      }
      });

    }
    else if(data.sourceType == 'UiPath')
    {
      this.rest.runsmoketestuipath().subscribe(processnames=>{
        let response:any;
        this.spinner.hide();
        response=processnames;
        if(response.status!= undefined)        
       {
        Swal.fire({
          width: '700px',
          html:header+(successbody),
          confirmButtonColor: "green",
          confirmButtonText: 'Dismiss',
          showConfirmButton:true
        });
      }
        else{
        Swal.fire({
          width: '700px',
          html:header+(errorbody),
          confirmButtonColor: "warning",
          confirmButtonText: 'Dismiss',
          showConfirmButton:true
        });
      }
      });
    }
    else
    {
      this.spinner.show();
      setTimeout(()=>{
        this.spinner.hide();
        Swal.fire({
          width: '700px',
          html:header+(data.botStatus=="Success"?successbody:errorbody),
          confirmButtonColor: (data.botStatus=="Success"?"green":"red"),
          confirmButtonText: 'Dismiss',
          showConfirmButton:true
        });
      },5000)
    }
  }


  getCheckbotList()
  {
    if((["UiPath","EPSoft","BluePrism"]).includes(this.selected_source))
    {
      if(this.bot_list.filter(item=>item.sourceType==this.selected_source).length==0)
        return true;
      else
        return false;
    }
    else{
        return false;
    }
  }
}
