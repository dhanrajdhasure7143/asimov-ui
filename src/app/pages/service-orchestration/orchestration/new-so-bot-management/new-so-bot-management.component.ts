import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
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
    displayedColumns: string[] = ["botName","botType","sourceType" ,"department","description","version","botStatus", "Action","Schedule","Logs","Smoke_Test"];
    departmentlist :string[] = ['Development','QA','HR'];
    displayedblueprismcolums: string[] = ['bluePrismBotSessionid','startTimeStamp','endTimeStamp','status','error'];
    botNameFilter = new FormControl('');
    botTypeFilter = new FormControl('');
    departmentFilter = new FormControl('');
    blueprimslogs : MatTableDataSource<any>;
    dataSource1:MatTableDataSource<any>;
    dataSource4:MatTableDataSource<any>;
    dataSource5:MatTableDataSource<any>;
    viewlogid="check123";
    processnames:any=[]
    viewlogid1="check456";
    logflag:Boolean;
    respdata2:Boolean;
    selectedcat:any;
    search:any;
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
    logresponse:any=[];
    public slaconId:any;
    public sla_list:any=[];
    public datasourcelist : any = [];
    public timer:any;

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
      private hints: sohints,
      private dt : DataTransferService,
      private spinner:NgxSpinnerService,
      private formBuilder: FormBuilder,
      private notify:NotifierService,
      )
    {
      this.insertslaForm_so_bot=this.formBuilder.group({
        botName: ["", Validators.compose([Validators.required])],
        botSource: ["", Validators.compose([Validators.required])],
        breachAlerts: ["", Validators.compose([Validators.required])],
        notificationType: [""],
        retriesInterval: [""],
        slaConfigId: ["", Validators.compose([Validators.required])],
        taskOwner: ["", Validators.compose([Validators.required])],
        thresholdLimit: ["", Validators.compose([Validators.required])],
        email:[false],
        sms:[false],
        totalRetries: [""],
      });
    }

  ngOnInit() {
    this.dt.changeHints(this.hints.botmanagment);
    this.spinner.show();
    this.getCategoryList();
    this.getallbots();
    this.getautomatedtasks();
    this.getprocessnames();
    this.get_sla_list();
    this.popup=false;
  }
  method(){
    let result: any = [];
    this.dataSource1 = this.datasourcelist;
    if(this.selectedcat == undefined){
      this.selectedcat = '';
    }
    if(this.selected_source == undefined){
      this.selected_source = '';
    }
    if(this.search == undefined){
      this.search = '';
    }
    if(this.search != '' && this.selected_source != '' && this.selectedcat != '')
    {
      console.log(this.search, this.selectedcat, this.selected_source);
      let category =this.categaoriesList.find(val=>this.selectedcat==val.categoryId).categoryName;
      for(let a of this.datasourcelist){
        if( category == a.department){
          if(this.selected_source == a.sourceType){
          result.push(a);
        }
        }
      }
      this.dataSource1 = new MatTableDataSource(result);
      console.log(this.dataSource1);
      let value1 = this.search.toLowerCase();
       console.log(value1);
       this.dataSource1.filter = value1;
       console.log(this.dataSource1.filteredData);
       this.dataSource1.sort=this.sort1;
       this.dataSource1.paginator=this.paginator1;
    }
    else if(this.search != '' && this.selected_source)
    {
      for(let a of this.bot_list){
        console.log(a.sourceType);
        if(this.selected_source == a.sourceType){
          result.push(a);
        }
      }
      this.dataSource1 = new MatTableDataSource(result);
      let value1 = this.search.toLowerCase();
       console.log(value1);
       this.dataSource1.filter = value1;
       console.log(this.dataSource1.filteredData);
       this.dataSource1.sort=this.sort1;
       this.dataSource1.paginator=this.paginator1;
    }
    else if(this.search != '' && this.selectedcat != '')
    {
      let category =this.categaoriesList.find(val=>this.selectedcat==val.categoryId).categoryName;
      for(let a of this.bot_list){
        console.log(a.department);
        if( category == a.department){
          result.push(a);
        }
      }
      this.dataSource1 = new MatTableDataSource(result);
      let value1 = this.search.toLowerCase();
       console.log(value1);
       this.dataSource1.filter = value1;
       console.log(this.dataSource1.filteredData);
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
            console.log(result);
          }
        }
        }
      }
      this.dataSource1 = new MatTableDataSource(result);
      this.dataSource1.sort=this.sort1;
      this.dataSource1.paginator=this.paginator1;
    }
    else if(this.search)
    {
      this.dataSource1 = new MatTableDataSource(this.datasourcelist);
      let value1 = this.search.toLowerCase();
       console.log(value1);
       this.dataSource1.filter = value1;
       console.log(this.dataSource1.filteredData);
       this.dataSource1.sort=this.sort1;
       this.dataSource1.paginator=this.paginator1;
    }
    else if(this.selected_source)
    {
      for(let a of this.bot_list){
        console.log(a.sourceType);
        if(this.selected_source == a.sourceType){
          result.push(a);
        }
      }
      this.dataSource1 = new MatTableDataSource(result);
      this.dataSource1.sort=this.sort1;
      this.dataSource1.paginator=this.paginator1;
    }
    else if(this.selectedcat)
    {
      let category =this.categaoriesList.find(val=>this.selectedcat==val.categoryId).categoryName;
      for(let a of this.bot_list){
        console.log(a.department);
        if( category == a.department){
          result.push(a);
        }
      }
      this.dataSource1 = new MatTableDataSource(result);
      this.dataSource1.sort=this.sort1;
      this.dataSource1.paginator=this.paginator1;
    }
  }

  getslaconfig(){

  }
  public selected_source:any;
  public sla_bot:any
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
      this.insertslaForm_so_bot.get("botSource").setValue(this.slaconId.botSource);
      this.insertslaForm_so_bot.get("breachAlerts").setValue(this.slaconId.breachAlerts);
      this.insertslaForm_so_bot.get("taskOwner").setValue(this.slaconId.taskOwner);
      this.insertslaForm_so_bot.get("retriesInterval").setValue(this.slaconId.retriesInterval);
      this.insertslaForm_so_bot.get("thresholdLimit").setValue(this.slaconId.thresholdLimit);
      this.insertslaForm_so_bot.get("totalRetries").setValue(this.slaconId.totalRetries);
      this.insertslaForm_so_bot.get("slaConfigId").setValue(this.slaconId.slaConfigId);
      if(this.slaconId.notificationType=="email")
        this.insertslaForm_so_bot.get("email").setValue(true);
      if(this.slaconId.notificationType=="sms")
        this.insertslaForm_so_bot.get("sms").setValue(true);
      if(this.slaconId.notificationType=="email,sms")
      {
        this.insertslaForm_so_bot.get("sms").setValue(true);
        this.insertslaForm_so_bot.get("email").setValue(true);
      }
    }
    else
    {
      this.insertslaForm_so_bot.get("taskOwner").setValue(this.sla_bot.createdBy);
      this.insertslaForm_so_bot.get("botName").setValue(this.sla_bot.botName);
      this.insertslaForm_so_bot.get("botSource").setValue(this.sla_bot.sourceType);
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
  let notificationtype="";
  if(this.insertslaForm_so_bot.get("email").value==true)
    notificationtype="email"
  if(this.insertslaForm_so_bot.get("sms").value==true)
    notificationtype="sms"
  if(this.insertslaForm_so_bot.get("sms").value==true&&this.insertslaForm_so_bot.get("email").value==true)
    notificationtype="email,sms"
   let slaalertsc = {
     //botName : this.insertslaForm_so_bot.value.botName,
     botSource : this.insertslaForm_so_bot.value.botSource,
     breachAlerts : this.insertslaForm_so_bot.value.breachAlerts,
     cascadingImpact : false,
     expectedETime : "0000-00-00T00:00:00.000Z",
     notificationType : notificationtype,
     processName : "NA",
     retriesInterval :  parseInt(this.insertslaForm_so_bot.value.retriesInterval),
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
    console.log(botId);
    localStorage.setItem("botId",botId);
    this.router.navigate(["/pages/rpautomation/home"]);
  }

  getallbots()
  {
    let response:any=[];
    this.spinner.show()
    this.selected_source="";
    this.rest.getallsobots().subscribe(botlist =>
    {
      response=botlist;
      if(response.errorMessage!=undefined)
      {
        this.spinner.hide();
        Swal.fire(response.errorMessage,"","error");
        return;
        //this.rpa_studio.spinner.hide();
      }
      response.forEach(data=>{
        let object:any=data;
        if(data.botType==0)
        {
          object.botType='Attended'
        }
        else if(data.botType==1)
        {
          object.botType='Unattended';
        }
        this.bot_list.push(object)
      })
      response.forEach(data=>{
        let object:any=data;
      if(this.categaoriesList.find(resp => resp.categoryId==data.department)!=undefined)
      {
        object.department=this.categaoriesList.find(resp => resp.categoryId==data.department).categoryName;
      }
        if(data.department==1)
        {
          object.department='Development'
        }
        else if(data.department==2)
        {
          object.department='HR';
        }
        else if(data.department==3)
        {
          object.department='QA';
        }
        this.bot_list.push(object)

      })
      this.bot_list=botlist;
      if(this.bot_list.length >0)
      {
        this.respdata1 = false;
        console.log(this.respdata1)
      }else
      {
        this.respdata1 = true;
        console.log(this.respdata1);
      }
      this.rest.get_uipath_bots().subscribe(bots=>{
        let uipath_bots:any=[];
        uipath_bots=bots
        let uipathbots:any=uipath_bots.value.map(item=>{
          item["createdAt"]=item.CreationTime;
          return item
        });
        response.concat(uipathbots);
      })
      response.sort((a,b) => a.createdAt > b.createdAt ? -1 : 1);
      this.bot_list=response;
      this.automatedtask = this.bot_list;
      console.log(this.bot_list)
      this.datasourcelist = this.bot_list;
      this.dataSource1= new MatTableDataSource(this.bot_list);
      this.isDataSource = true;
      this.dataSource1.sort=this.sort1;
      this.dataSource1.paginator=this.paginator1;
      this.dataSource1.data = response;
     // this.spinner.hide();
      /*this.departmentFilter.valueChanges.subscribe((departmentFilterValue) => {
        //this.filteredValues['department'] = departmentFilterValue;
        //this.dataSource1.filter = JSON.stringify(this.filteredValues);
        if(this.dataSource1.filteredData.length > 0){
          this.isTableHasData = true;
        } else {
          this.isTableHasData = false;
        }
        },(err)=>{

          ///this.rpa_studio.spinner.hide();
        });

        this.botNameFilter.valueChanges.subscribe((botNameFilterValue) => {
          //this.filteredValues['botName'] = botNameFilterValue;
          this.dataSource1.filter = JSON.stringify(this.filteredValues);
          if(this.dataSource1.filteredData.length > 0){
            this.isTableHasData = true;
          } else {
            this.isTableHasData = false;
          }
        });

      //this.dataSource1.filterPredicate = this.customFilterPredicate();*/
      this.update_bot_status();
      this.spinner.hide();
    },(err)=>{
      this.spinner.hide();
    })
  }


  update_bot_status(){
    this.timer = setInterval(() => {
      this.rest.getallsobots().subscribe(botlist =>{
        let responsedata:any=botlist
        responsedata.forEach(statusdata => {
          let data:any;
          if(statusdata.status=="InProgress" || statusdata.status=="Running")
                {
                  data="<span matTooltip='"+statusdata.status+"' style='filter: none; width: 19px;' class='text-primary'><img src='../../../../assets/images/RPA/DotSpin.gif' style='filter: none; width: 19px;'></span>";
                }
                else if(statusdata.botStatus=="Success" || statusdata.botStatus=="Completed")
                {
                  data='<span  matTooltip="'+statusdata.botStatus+'"  style="filter: none; width: 19px;"  class="text-success"><i class="fa fa-check-circle"  style="font-size:19px" aria-hidden="true"></i></span>';
                }
               
                else if(statusdata.botStatus=="Failure" || statusdata.botStatus=="Failed")
                {
                  data='<span  matTooltip="'+statusdata.botStatus+'"    style="filter: none; width: 19px;"  class="text-danger"><i class="fa fa-times-circle" aria-hidden="true"></i></span>&nbsp;<span class="text-danger"></span>';
                }
                
          $("#"+statusdata.botId+"__status").html(data);
        });
          
        })
    }, (5*60000));
  
  }


  viewlogdata(botid ,version){
  let response: any;
   let log:any=[];
   this.logresponse=[];
   this.log_botid=botid;
   this.log_version=version
   this.rest.getviewlogdata(botid,version).subscribe(data =>{
       this.logresponse=data;
       if(this.logresponse.length >0)
       {
         this.respdata1 = false;
         console.log(this.respdata1)
       }else
       {
         this.respdata1 = true;
         console.log(this.respdata1);
       }
       console.log(this.logresponse)
       if(this.logresponse.length>0)
       this.logresponse.forEach(data=>{
       response=data;
       if(response.start_time != null)
       {
         let startdate=response.start_time.split("T");
         response["start_date"]=startdate[0];
         response.start_time=startdate[1].slice(0,8);


       }else
       {
         response["start_date"]="-";
         response.start_time="-";
       }
       if(response.end_time != null)
       {
         let enddate=response.end_time.split("T");
         response["end_date"]=enddate[0];
         response.end_time=enddate[1].slice(0,8);
       }else
       {
         response["end_date"]="---";
         response.end_time="---";


       }
       log.push(response)
     });
     console.log(log);
     log.sort((a,b) => a.run_id < b.run_id ? -1 : 1);
     this.Viewloglist = new MatTableDataSource(log);
     console.log(this.Viewloglist);

     this.Viewloglist.paginator=this.paginator4;
     this.Viewloglist.sort=this.sort4;

     document.getElementById(this.viewlogid).style.display="block";
     $(".tour_guide").hide()

   });
 }

 public botrunid
 ViewlogByrunid(runid){
   console.log(runid);
   this.botrunid=runid;
   let responsedata:any=[];
   let logbyrunidresp:any;
   let resplogbyrun:any=[];
   this.rest.getViewlogbyrunid(this.log_botid,this.log_version,runid).subscribe((data)=>{
     responsedata = data;
     if(responsedata.length >0)
     {
       this.respdata2 = false;
       console.log(this.respdata2)
     }else
     {
       this.respdata2 = true;
       console.log(this.respdata2);
     }
     console.log(responsedata);
     responsedata.forEach(rlog=>{
       logbyrunidresp=rlog;
       logbyrunidresp["start_date"]=logbyrunidresp.start_time;
       logbyrunidresp["end_date"]=logbyrunidresp.end_time;
       logbyrunidresp.start_time=logbyrunidresp.start_time;
       logbyrunidresp.end_time=logbyrunidresp.end_time;

       resplogbyrun.push(logbyrunidresp)
     });
     console.log(resplogbyrun);
     this.logflag=true;
     this.logbyrunid = new MatTableDataSource(resplogbyrun);
     console.log(this.logbyrunid);
     this.logbyrunid.paginator=this.paginator5;
     this.logbyrunid.sort=this.sort5;
     document.getElementById(this.viewlogid).style.display="none";
     document.getElementById(this.viewlogid1).style.display="block";
     $(".tour_guide").hide()
       })
   }

   back(){
     //document.getElementById("ViewLog").style.display="none";
     document.getElementById(this.viewlogid1).style.display="none";
     document.getElementById(this.viewlogid).style.display="block";
   }

   viewlogclose(){
    $(".tour_guide").show()
     document.getElementById(this.viewlogid).style.display="none";
   }

   viewlogclose1(){
    $(".tour_guide").show()
     document.getElementById(this.viewlogid1).style.display="none";
     document.getElementById(this.viewlogid).style.display="none";
   }



   getschecdules(botId)
   {

    // this.rest.scheduleList(botId).subscribe((data)=> this.scheduleResponse(data))
   }



   executionAct(botid,source) {
    this.spinner.show();
      console.log(source);
      if(source=="EPSoft")
      this.rest.execution(botid).subscribe(res =>{
        let response:any;
        response=res;
        this.spinner.hide();
        if(response.status!= undefined)
        Swal.fire(response.status,"","success")
        else
        Swal.fire(response.errorMessage,"","warning");
      });
      else if(source=="UiPath")
      this.rest.startuipathbot(botid).subscribe(res=>{
        let response:any=res;
        this.spinner.hide();
        if(response.value!=undefined)
        {
          Swal.fire("Bot  Execution Initated Successfully !!","","success");
        }
        else
        {
          Swal.fire(response.errorMessage,"","warning");
        }
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
            Swal.fire("Bot Execution initiated successfully","","success");
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
        });
      }



    }


    pauseBot(botId) {
        Swal.fire({
          icon: 'success',
          title: "Bot Paused Sucessfully !!",
          showConfirmButton: true,
        })

        this.rest.getUserPause(botId).subscribe(data => {
        });
    }

    resumeBot(botid) {
        Swal.fire({
          icon: 'success',
          title: "Bot Resumed Sucessfully !!",
          showConfirmButton: true,
        })
        this.rest.getUserResume(botid).subscribe(data => {
        })
    }

    stopBot(botid) {
        Swal.fire({
          icon: 'success',
          title: "Bot Execution Stopped !!",
          showConfirmButton: true,
          })

          this.rest.stopbot(botid,"").subscribe(data=>{
            console.log(data)

          })
    }

    getBluePrismlogs(botname){
      $(".tour_guide").hide()
      this.blueprismbotname = botname;
      console.log("this.blueprismbotname",this.blueprismbotname)
      document.getElementById("divblueprismlogs").style.display = "block";
      let blueprismlogs:any=[]
      this.spinner.show();
      this.rest.get_blue_prism_logs(botname).subscribe(logsdataresp=>{
      let response:any=logsdataresp;
      console.log(response.length);
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
          console.log("logs---------------->",blueprismlogs)
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
    getuipathlogs(botname)
    {
      
      this.uipathbotName=botname;
      document.getElementById("uipathlogs").style.display="block";
      $(".tour_guide").hide()
      this.spinner.show();
      this.rest.getuipathlogs().subscribe(resp=>{
        let response:any=resp;
        let logs:any=response.value.filter(rest=>rest.ReleaseName==botname+"_Env");
        let logsbytime:any=logs.sort((right,left)=>{
          return moment.utc(left.StartTime).diff(moment.utc(right.StartTime))
        });
        console.log(logsbytime)
        this.uipathlogs=new MatTableDataSource(logsbytime);
        this.uipathlogs.sort=this.sort6;
        this.uipathlogs.paginator=this.paginator6;
        this.spinner.hide();
      });

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
      this.categaoriesList=catResponse.data;
    });
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
}
