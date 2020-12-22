import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { RpaStudioWorkspaceComponent } from '../rpa-studio-workspace/rpa-studio-workspace.component';
import { RestApiService } from '../../services/rest-api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CronOptions } from 'src/app/shared/cron-editor/CronOptions';
import cronstrue from 'cronstrue';
import {  HttpClient } from '@angular/common/http';
import { Router} from '@angular/router';
import { RpaStudioTabsComponent } from '../rpa-studio-tabs/rpa-studio-tabs.component'
import Swal from 'sweetalert2';
import { RpaStudioComponent } from '../rpa-studio/rpa-studio.component';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NotifierService } from 'angular-notifier';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

import { DatePipe } from '@angular/common'
@Component({
  selector: 'app-rpa-studio-actions',
  templateUrl: './rpa-studio-actions.component.html',
  styleUrls: ['./rpa-studio-actions.component.css']
})
export class RpaStudioActionsComponent implements OnInit {
  public check_schedule_flag: boolean = false;
  public environment: any = [];
  public predefined: any = [];
  public optionList: boolean = true;
  public optionPredefinedbotList: boolean = false;
  public environmentValue: any = [];
  public predefinedbotValue: any = [];
  public selectedEnvironments: any = []
  public versionsList: any = [];
  public startbot:Boolean;
  public pausebot:Boolean;
  public resumebot:Boolean;
  public savebotrespose:any;
  public selectedenv:any=[];
  public finalenv:any=[];
  public envflag:Boolean=true;
  public schedulepopid="";
  public logflag:Boolean;
  public runid:any;
  public viewlog:Boolean;
  public botid:any;
  public botverid:any;
  public resplogbyrun:any;
  public logresponse:any=[];
  public schpop:Boolean=false;
  public schedule:any

  displayedColumns: string[] = ['run_id','version','start_date','end_date', "bot_status"];
  Viewloglist:MatTableDataSource<any>;
  displayedColumns1: string[] = ['task_name', 'status','start_date','end_date','error_info' ];
  logbyrunid:MatTableDataSource<any>;

  @ViewChild("paginator1",{static:false}) paginator1: MatPaginator;
  @ViewChild("paginator2",{static:false}) paginator2: MatPaginator;
  @ViewChild("sort1",{static:false}) sort1: MatSort;
  @ViewChild("sort2",{static:false}) sort2: MatSort;

  @Input('tabsArrayLength') public tabsArrayLength: number;
  @Input('botState') public botState: any;
  @Output() closeTabEvent = new EventEmitter<void>();
  @ViewChild('t', { static: false }) ngbTabset;
  @Input('tabsArray') public tabsArray: any[];
  @Input('tabActiveId') public tabActiveId: string;
  @ViewChild(RpaStudioWorkspaceComponent, { static: false }) childBotWorkspace: RpaStudioWorkspaceComponent;
  pause: any;
  resume: any;
  stop: any;
  checked: boolean;
  listEnvironmentData: any = [];
  dropdownList: any = [];
  predefinedList: any = [];
  selectedDropdown: any = [];
  predefineddropdown: any = [];
  botStatisticsData: object = {};
  predefinedbotsData:any =[];
  deploymachinedata:any;
  // scheduler
  hiddenSchedlerPopUp : boolean = false;
  startTime = {hour: 0, minute: 0};
  endTime = {hour: 23, minute: 59};
  scheduleLists: any[] = [];
  form: FormGroup;
  public startDate: NgbDateStruct;
  public endDate: NgbDateStruct;
  selectTime;
  public cronExpression = '0/1 * 1/1 * *';
  public isCronDisabled = false;
  public selectedTimeZone :any;
  public viewlogid:any;
  public viewlogid1:any;
  public respdata1:boolean = false;
  public respdata2:boolean = false;
  public she:any;
  public insertForm:FormGroup;
  public minDate:NgbDateStruct;
  public timesZones: any[] = ["UTC","Asia/Dubai","America/New_York","America/Los_Angeles","Asia/Kolkata","Canada/Atlantic","Canada/Central","Canada/Eastern","GMT"];
  i="";
  public cronOptions: CronOptions = {
    formInputClass: 'form-control cron-editor-input',
    formSelectClass: 'form-control cron-editor-select',
    formRadioClass: 'cron-editor-radio',
    formCheckboxClass: 'cron-editor-checkbox',

    defaultTime: "00:00:00",

    hideMinutesTab: false,
    hideHourlyTab: false,
    hideDailyTab: false,
    hideWeeklyTab: false,
    hideMonthlyTab: false,
    hideYearlyTab: false,
    hideAdvancedTab: false,
    hideSpecificWeekDayTab : false,
    hideSpecificMonthWeekTab : false,

    use24HourTime: true,
    hideSeconds: false,

    cronFlavor: "standard"
  }
  userRole;
  isButtonVisible: boolean;
  constructor(private fb : FormBuilder,private rest : RestApiService, private http:HttpClient,
    private rpa_tabs:RpaStudioTabsComponent, private rpa_studio:RpaStudioComponent,
    private notifier: NotifierService, private calender:NgbCalendar, private router:Router,
    private formBuilder: FormBuilder,
    ) {
    this.form = this.fb.group({
      'startTime' : [this.startTime, Validators.required],
      'endTime' : [this.endTime, Validators.required],
    })
  }

  ngOnInit() {
    this.userRole = localStorage.getItem("userRole")
    this.userRole = this.userRole.split(',');
    this.isButtonVisible = this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('RPA Admin');
    this.startbot=false;
    this.pausebot=false;
    this.resumebot=false;
    this.logflag=false;
    this.botstatistics();
    this.getEnvironmentlist();
    this.getpredefinedbotlist();

    this.schedulepopid="schedule-"+this.botState.botName;
    this.viewlogid="viewlog-"+this.botState.botName;

    const ipPattern =
    "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
      this.insertForm=this.formBuilder.group({
        environmentName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        environmentType: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        agentPath: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        hostAddress: ["", Validators.compose([Validators.required, Validators.pattern(ipPattern), Validators.maxLength(50)])],
        username: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        password: ["", Validators.compose([Validators.required , Validators.maxLength(50)])],
        connectionType: ["SSH",Validators.compose([Validators.required,, Validators.maxLength(50), Validators.pattern("[A-Za-z]*")])],
        portNumber: ["22",  Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern("[0-9]*")])],
        activeStatus: [true]
      })

    if(this.botState.botId!=undefined)
    {
      this.savebotrespose=this.botState;
      console.log(this.botState.botId)
      this.getschecdules();
      this.childBotWorkspace.saveCron(this.she);
      this.botState.envIds.forEach(envdata=>{
          this.environment.find(data=>data.environmentId==envdata).checked=true;
      })

    }
  }

  onCreateSubmit(){}

  deploybot() {

    this.rest.deployremotemachine(this.savebotrespose.botId).subscribe(data => {
      this.deploymachinedata = data;
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title:this.deploymachinedata.status,
        showConfirmButton: false,
        timer: 2000
      })

    })

  }

  //loadpredefinedbot(){}
  versionChange(ver){}


  reset()
  {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
    if (result.value) {
      this.childBotWorkspace.resetdata();
    }
  })
  }



  delete()
  {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
        if (result.value) {
          let response;
          this.rest.getDeleteBot(this.savebotrespose.botId).subscribe(data=>{
            response=data
            if(response.status!=undefined)
            {
              Swal.fire({
                position:'top-end',
                icon:"success",
                title:response.status,
                showConfirmButton:false,
                timer:2000})
                this.rpa_tabs.closeTab(this.botState);
            }else
            {

                Swal.fire({
                  position:'top-end',
                  icon:"error",
                  title:response.errorMessage,
                  showConfirmButton:false,
                  timer:2000})
                  //this.rpa_tabs.closeTab(this.botState);

            }
          })
          //this.nodes = this.nodes.filter((node): boolean => nodeId !== node.id);
          //this.jsPlumbInstance.removeAllEndpoints(nodeId);
        }

      })
    }



  async saveBotFunAct() {
    this.rpa_studio.spinner.show();
    this.finalenv=[];
    this.environment.forEach(data=>{
        if(data.checked==true)
        {
          this.finalenv.push(data.environmentId)
        }
    })
    if(this.savebotrespose==undefined)
    {
      let checkbotres=await this.childBotWorkspace.saveBotFun(this.botState,this.finalenv);
      if(checkbotres==false)
      {

        this.rpa_studio.spinner.hide();
        Swal.fire({
          icon: 'warning',
          title: "Please check connections",
          showConfirmButton: true,
        })
      }
      else
      {
        checkbotres.subscribe(data=>{
        this.savebotrespose=data;
        this.rpa_studio.spinner.hide();

        if(this.savebotrespose.botId!=undefined)
        {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: "Bot Saved Sucessfully",
            showConfirmButton: false,
            timer: 2000
          })
          for(let p=0 ;p<this.childBotWorkspace.nodes.length;p++)
          {
            this.childBotWorkspace.nodes[p].status="executed";
          }
          this.childBotWorkspace.uploadfile(this.finalenv);
          this.getschecdules();
          this.startbot=true;
          this.pausebot=false;
          this.resumebot=false;
          this.childBotWorkspace.disable=true;
          let bottask:any=this.botState;
          if(bottask.taskId!=0)
          {
            this.rpa_assignbot(this.savebotrespose.botId, bottask.taskId);
          }
        }
        else
        {

          this.childBotWorkspace.disable=false;
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: "Bot failed to Save",
            showConfirmButton: false,
            timer: 2000
          })
        }
      });
      }
    }
    else
    {

       this.childBotWorkspace.saveCron(this.she);
       let checkbot:any=await this.childBotWorkspace.updateBotFun(this.savebotrespose,this.finalenv)
       if(checkbot==false)
       {
        this.rpa_studio.spinner.hide();
        Swal.fire({
          icon: 'warning',
          title: "Please check connections",
          showConfirmButton: true,
        })

       }else
       {
         await checkbot.subscribe(data=>{
          this.childBotWorkspace.successCallBack(data);
          this.savebotrespose=data;
          this.rpa_studio.spinner.hide();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: "Bot Updated Sucessfully",
            showConfirmButton: false,
            timer: 2000
          })
          this.getschecdules();
          this.childBotWorkspace.uploadfile(this.finalenv);
        });
      }
    }
  }



  executionAct() {
    let response:any;
    if(this.savebotrespose!=undefined)
    {

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: "Bot Initiated Sucessfully !!",
        showConfirmButton: false,
        timer: 2000
      })

      this.startbot=false;
      this.pausebot=true;
      this.resumebot=false;
      this.rest.execution(this.savebotrespose.botId).subscribe(res =>{
        response = res;
        if(response.errorCode==undefined)
        {
          /*
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: response.status,
            showConfirmButton: false,
            timer: 2000
          })*/

        }else
        {
          /*Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: response.errorMessage,
            showConfirmButton: false,
            timer: 2000
          })*/
        }
      })
    }
  }

  pauseBot() {
    if(this.savebotrespose!=undefined)
    {


      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: "Bot Paused Sucessfully !!",
        showConfirmButton: false,
        timer: 2000
      })

      this.pausebot=false;
      this.startbot=false;
      this.resumebot=true;
      this.rest.getUserPause(this.savebotrespose.botId).subscribe(data => {
      this.pause = data;
       /* Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: this.pause.status,
          showConfirmButton: false,
          timer: 2000})
        })*/
    });
  }
  }

  resumeBot() {
    if(this.savebotrespose!=undefined)
    {


      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: "Bot Resumed Sucessfully !!",
        showConfirmButton: false,
        timer: 2000
      })
      this.pausebot=true;
      this.startbot=false;
      this.resumebot=false;
      this.rest.getUserResume(this.savebotrespose.botId).subscribe(data => {
        this.resume = data;
      /*  Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: this.resume.status,
          showConfirmButton: false,
          timer: 2000})*/
        })
    }
  }

  stopBot() {
    let data="";
    if(this.savebotrespose!=undefined)
    {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: "Bot Execution Stopped !!",
        showConfirmButton: false,
        timer: 2000})

        this.startbot=true;
        this.pausebot=false;
        this.resumebot=false;

        this.rest.stopbot(this.savebotrespose.botId,data).subscribe(data=>{
          console.log(data)

        })
    }
  }


  getEnvironmentlist()
  {
    this.listEnvironmentData=[];
    this.environment=[];
    this.rest.listEnvironments().subscribe(data => {
    this.listEnvironmentData=data;
      this.listEnvironmentData.forEach(env=>{
        env["checked"]=false;
        this.environment.push(env);
      })
      if(this.botState.botId!=undefined)
      {
        this.botState.envIds.forEach(envdata=>{
            this.environment.find(data=>data.environmentId==envdata).checked=true;
        })
      }
      this.environment.filter(data =>{
        if(data.checked==true){
          this.envflag=false;
        }
      });
      console.log(this.environment)
    })
  }


  checkuncheckenv(id:any)
  {
   // console.log(this.environment.filter(data => data.checked==true).length)
    if(this.environment.find(data=>data.environmentId==id).checked==false)
    {
      this.environment.find(data=>data.environmentId==id).checked=true
    }
    else if(  this.environment.find(data=>data.environmentId==id).checked==true)
    {
      this.environment.find(data=>data.environmentId==id).checked=false
    }
    this.environment.filter(data =>{
      if(data.checked==true){
        this.envflag=false;
      }
    })


  }

  getallpredefinebots() {
    this.predefined = [];
    console.log(this.predefinedbotsData);
    if (this.predefinedbotsData) {
      this.optionPredefinedbotList = !this.optionPredefinedbotList;
      this.predefinedbotsData.forEach(element => {
        let temp: any = {
          botName: element.botName
        };
        this.predefined.push(temp)
      })
    }
  }


  schedulerPopUp(){
    let date:any=this.calender.getToday(); 
    console.log(date["year"])
    this.startDate=this.calender.getToday()
    this.minDate=this.calender.getToday();
      //this.startDate=this.calender.getToday();
      //console.log(this.startDate)
      document.getElementById(this.schedulepopid).style.display="block";
      this.hiddenSchedlerPopUp = true
      let data:any
    }

    scheduleResponse(data){
      console.log(data);
      this.scheduleLists = data;
      let schedules:any =[];
      if(this.she==undefined)
      {
        this.scheduleLists.forEach(savedschedule=>{

          let savecond={

          "timeZone":savedschedule.timeZone,
          "scheduleInterval" :savedschedule.scheduleInterval,
          "startDate":savedschedule.startDate,
          "endDate":savedschedule.endDate,
          "intervalId":savedschedule.intervalId,
          }
          schedules.push(savecond)
          })
        this.she={
          //"TimeZone":this.scheduleLists[0].timeZone,
          //"numberofRepetitions":1,
          "scheduleIntervals" :schedules,
        }
        console.log()

      }
    }


    getschecdules()
    {
      this.rest.scheduleList(this.savebotrespose.botId).subscribe((data)=> this.scheduleResponse(data))
    }



    addCron(){
    let scheduleddata={

      "timeZone":this.selectedTimeZone,
      "scheduleInterval" :this.cronExpression,
      "startDate":`${this.startDate["year"]+","+this.startDate["month"]+","+this.startDate["day"]+","+this.startTime["hour"]+","+this.startTime["minute"]}`,
      "endDate"  :`${this.endDate["year"]+","+this.endDate["month"]+","+this.endDate["day"]+","+this.endTime["hour"]+","+this.endTime["minute"]}`,
      "intervalId": this.childBotWorkspace.idGenerator(),
    }
    let sche2=
    {
      "timeZone":this.selectedTimeZone,
      "scheduleInterval" :this.cronExpression,
      "lastRunTime":"---",
      "nextRunTime":"---",
      "executionStatus":"---",
      "intervalId": scheduleddata.intervalId,
    }
    if(this.she == undefined)
    {

      let arraydata=[];
      arraydata.push(scheduleddata);
      this.she = {
        //"numberofRepetitions":1,
        "scheduleIntervals" : arraydata,
      }
    }
    else
    {

      this.she.scheduleIntervals.push(scheduleddata);
      console.log(this.she)
    }
    console.log(this.she)
    this.scheduleLists.push(sche2)
    this.hiddenSchedlerPopUp = false;
    this.resetscheduler();
    }

    saveCronexp()
    {
      console.log(this.she)
      if(this.she!=undefined)
      {
        let filteredschedules:any=[]
        this.she.scheduleIntervals.forEach(data=>{
          let schedulefilter={
            "scheduleInterval" :data.scheduleInterval,
            "startDate":data.startDate,
            "endDate"  :data.endDate,
            "timeZone":data.timeZone,
          }
          filteredschedules.push(schedulefilter)
        })
        this.she.scheduleIntervals=filteredschedules;
        console.log(this.she);
      }
      this.childBotWorkspace.saveCron(this.she);
      document.getElementById(this.schedulepopid).style.display="none";
      Swal.fire({
        position:'top-end',
        icon:'success',
        title:'Scheduler Data saved successfull',
        showConfirmButton:false,
        timer:2000
        })
    }







    close(){
      document.getElementById(this.schedulepopid).style.display="none";
    }



    botstatistics() {
    this.rest.botStatistics().subscribe(Status => {
      this.botStatisticsData = Status;
      console.log(this.botStatisticsData);
    })
  }

  modify(){
    this.childBotWorkspace.modifyEnableDisable();
  }

  getVersionlist() {
    this.versionsList=[];
    let versionsdata:any=[];
    this.rest.getBotVersion(this.savebotrespose.botId).subscribe(data => {
      versionsdata=data;
      versionsdata.reverse().forEach((version,index )=>{
          if(index<3)
          this.versionsList.push(version)
      })

    })
  }

  getpredefinedbotlist() {
    this.rest.getpredefinedbots().subscribe(data => {
      this.predefinedbotsData=data;
    });
   }

   switchversion(vid)
   {
     this.rpa_studio.spinner.show();
    let response:any;
   /* Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value)
        {*/
          this.rest.getbotversiondata(this.savebotrespose.botId,vid).subscribe(data =>{
            response=data;
            let index=this.rpa_studio.tabsArray.findIndex(data=>data.botName==response.botName);
            this.rpa_studio.tabsArray[index]=response;
            this.rpa_studio.spinner.hide();
          })
        /*}
    })*/
   }

   viewlogdata(){
     this.childBotWorkspace.addsquences();
    let response: any;
    let log:any=[];
    this.logresponse=[];
    this.rest.getviewlogdata(this.savebotrespose.botId,this.savebotrespose.version).subscribe(data =>{
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

      this.Viewloglist.paginator=this.paginator1;
      this.Viewloglist.sort=this.sort1;

      document.getElementById(this.viewlogid).style.display="block";

    });
  }

  ViewlogByrunid(runid){
    console.log(runid);
    let responsedata:any=[];
    let logbyrunidresp:any;
    let resplogbyrun:any=[];
    this.rest.getViewlogbyrunid(this.savebotrespose.botId,this.savebotrespose.version,runid).subscribe((data)=>{
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
      this.logbyrunid.paginator=this.paginator2;
      this.logbyrunid.sort=this.sort2;
      document.getElementById(this.viewlogid).style.display="none";
      document.getElementById(this.viewlogid1).style.display="block";
        })
    }

    back(){
      //document.getElementById("ViewLog").style.display="none";
      document.getElementById(this.viewlogid1).style.display="none";
      document.getElementById(this.viewlogid).style.display="block";
    }

    viewlogclose(){
      document.getElementById(this.viewlogid).style.display="none";
    }

    viewlogclose1(){
      document.getElementById(this.viewlogid1).style.display="none";
      document.getElementById(this.viewlogid).style.display="none";
    }

loadpredefinedbot(botId)
{
  this.rpa_studio.spinner.show();
  let responsedata:any=[]
  this.rest.getpredefinedotdata(botId).subscribe(data=>{
    responsedata=data;
    let j=200;
    responsedata.tasks.forEach(element=>
    {
      this.childBotWorkspace.finaldataobjects.push(element)
      let nodename=  element.nodeId.split("__")[0];
      let nodeid=element.nodeId.split("__")[1];
      console.log(nodeid);
      j=j+100;
      let node={
        id:this.childBotWorkspace.idGenerator(),
        name:nodename,
        selectedNodeTask:element.taskName,
        path:this.rpa_studio.templateNodes.find(data=>data.name==nodename).path,
        tasks:this.rpa_studio.templateNodes.find(data=>data.name==nodename).tasks,
        x:j+'px',
        y:"10px",
    }


    for(var i=0; i<responsedata.sequences.length; i++)
    {
      if(responsedata.sequences[i].sourceTaskId!=undefined )
      {
        if(responsedata.sequences[i].sourceTaskId==nodeid)
        {
          responsedata.sequences[i].sourceTaskId=node.id;
        }
      }
      if(responsedata.sequences[i].targetTaskId!=undefined )
      {

        if( responsedata.sequences[i].targetTaskId==nodeid)
        {
          responsedata.sequences[i].targetTaskId=node.id;
        }
      }
    }
    element.nodeId=nodename+"__"+node.id;
    this.childBotWorkspace.nodes.push(node);
    this.childBotWorkspace.finaldataobjects.push(element);
    setTimeout(() => {
      this.childBotWorkspace.populateNodes(node);
    }, 240);


    })
    this.childBotWorkspace.addconnections(responsedata.sequences);
    this.rpa_studio.spinner.hide();
  })
}



convertcron(cronexp)
{
  return cronstrue.toString(cronexp);
}



  rpa_assignbot(botId,taskId)
  {
    this.rest.assign_bot_and_task(botId,taskId).subscribe(data=>{
      let response:any=data;
      if(response.status!=undefined)
      {
        this.notifier.notify("info",response.status);
      }
    });
  }




  resetscheduler()
  {
    this.startDate=this.calender.getToday();
    this.selectedTimeZone=undefined;
    this.cronExpression = '0/1 * 1/1 * *';
    this.endDate=undefined;
  }


startSchedule()
{
  let scheduleRecord = this.scheduleLists.filter(product => product.checked==true).map(p => p);
  let i:any;

  for(i=0;i<scheduleRecord.length;i++)
  {
  console.log(scheduleRecord[i]);
  let s = scheduleRecord[i];
  console.log(s.scheduleInterval);
  console.log(s.intervalId);
  console.log(this.savebotrespose.botId);
  let startschedule={
    "botId":this.savebotrespose.botId,
    "scheduleInterval":s.scheduleInterval,
    "intervalId":s.intervalId,
  }
  let responsemessage:any
  this.rest.start_schedule(startschedule).subscribe(response=>{
    responsemessage=response;
    if(responsemessage.errorMessage==undefined)
    {
      this.notifier.notify("info",responsemessage.status);

    }
  });
}
  this.removeallchecks();
}

stopSchedule()
{
  const scheduleRecord = this.scheduleLists.filter(product => product.checked==true).map(p => p);
  let i:any;

  for(i=0;i<scheduleRecord.length;i++)
  {
  console.log(scheduleRecord[i]);
  let s = scheduleRecord[i];
  console.log(s.scheduleInterval);
  console.log(s.intervalId);
  console.log(this.savebotrespose.botId);
  let stopschedule={
    "botId":this.savebotrespose.botId,
    "scheduleInterval":s.scheduleInterval,
    "intervalId":s.intervalId,
  }
  let responsemessage:any
this.rest.stop_schedule(stopschedule).subscribe(response=>{
  responsemessage=response

  if(responsemessage.errorMessage==undefined)
  {
    this.notifier.notify("info",responsemessage.status);

  }
});
}
this.removeallchecks();
}

pauseSchedule()
{ const scheduleRecord = this.scheduleLists.filter(product => product.checked==true).map(p => p);
  let i:any;

  for(i=0;i<scheduleRecord.length;i++)
  {
  console.log(scheduleRecord[i]);
  let s = scheduleRecord[i];
  console.log(s.scheduleInterval);
  console.log(s.intervalId);
  console.log(this.savebotrespose.botId);
  let pauseschedule={
    "botId":this.savebotrespose.botId,
    "scheduleInterval":s.scheduleInterval,
    "intervalId":s.intervalId,
  }
  let responsemessage:any
  this.rest.pause_schedule(pauseschedule).subscribe(response=>{
    responsemessage=response

    if(responsemessage.errorMessage==undefined)
    {
        this.notifier.notify("info",responsemessage.status);
    }
  });
}
  this.removeallchecks();
}

resumeSchedule()
{
  const scheduleRecord = this.scheduleLists.filter(product => product.checked==true).map(p => p);
  let i:any;

  for(i=0;i<scheduleRecord.length;i++)
  {
  console.log(scheduleRecord[i]);
  let s = scheduleRecord[i];
  console.log(s.scheduleInterval);
  console.log(s.intervalId);
  console.log(this.savebotrespose.botId);
  let resumeschedule={
    "botId":this.savebotrespose.botId,
    "scheduleInterval":s.scheduleInterval,
    "intervalId":s.intervalId,
  }
  let responsemessage:any
  this.rest.resume_schedule(resumeschedule).subscribe(response=>{
    responsemessage=response
     console.log(responsemessage.errorMessage);
    if(responsemessage.errorMessage == undefined)
    {
      this.notifier.notify("info",responsemessage.status);
    }
  });
}
this.removeallchecks();
}

removeallchecks()
{
  this.check_schedule_flag = false;
  for(let i=0;i<this.scheduleLists.length;i++)
  {
    this.scheduleLists[i].checked= false;
    console.log(this.scheduleLists[i]);
  }
  console.log(this.check_schedule_flag);
}

checkAllCheckBox(ev) {
  this.scheduleLists.forEach(x => x.checked = ev.target.checked)
  this.check_schedule_flag = true;
}

checkEnableDisableBtn(id, event)
{
  console.log(id);
  console.log(event.target.checked);
  this.scheduleLists.find(data=>data.intervalId==id).checked=event.target.checked;
  console.log(this.scheduleLists.length)
  if(this.scheduleLists.filter(data=>data.checked==true).length==this.scheduleLists.length)
  {
    this.check_schedule_flag=true;
  }else
  {
    this.check_schedule_flag=false;
  }
}


 removeSchedule()
 {
   let i:number;
  const scheduleRecord = this.scheduleLists.filter(product => product.checked==true).map(p => p.intervalId);
  console.log(scheduleRecord);
    if(scheduleRecord!=undefined)
    {
      for(i=scheduleRecord.length; i > 0 ; i--){
      console.log(this.she)
      let index=this.she.scheduleIntervals.findIndex(schedule=>schedule.intervalId==scheduleRecord);
      console.log(index)
      this.she.scheduleIntervals.splice(index,1);
      let index2=this.scheduleLists.findIndex(scheduleitem=>scheduleitem.intervalId==scheduleRecord);
      this.scheduleLists.splice(index2,1);
    }
      if(this.she.scheduleIntervals.length==0)
      {
        this.she=undefined;
      }
    }
    this.removeallchecks();
 }

  navtoenv()
  {

    document.getElementById("rpa_createenvironment"+"_"+this.botState.botName).style.display="block";
    //localStorage.setItem("tabsArray",JSON.stringify(this.rpa_studio.tabsArray));
    //this.router.navigate(['/pages/rpautomation/configurations']);
  }

  async saveEnvironment()
  {
   if(this.insertForm.valid)
   {
     if(this.insertForm.value.activeStatus==true)
      {
        this.insertForm.value.activeStatus=7
      }else{
        this.insertForm.value.activeStatus=8
      }
      this.insertForm.value.createdBy="admin";
      let environment=this.insertForm.value;
      await this.rest.addenvironment(environment).subscribe( res =>
      {
        this.close_c_env();
        Swal.fire("Environment added successfully","","success");
        //document.getElementById("rpa_createenvironment"+"_"+this.botState.botName).style.display='none';
        this.insertForm.reset();
        this.insertForm.get("portNumber").setValue("22");
        this.insertForm.get("connectionType").setValue("SSH");
        this.getEnvironmentlist()
        //this.rpa_studio.spinner.hide();
      });
    }
    else
    {
      alert("Invalid Form")
    }

  }

  EnvType1(){
    if(this.insertForm.value.environmentType == "Windows"){
      //this.updateForm.value.portNumber="44";
      this.insertForm.get("portNumber").setValue("44");
    }else if(this.insertForm.value.environmentType == "Linux"){
      this.insertForm.get("portNumber").setValue("22");
    }
  }




  close_c_env()
  {
    document.getElementById("rpa_createenvironment"+"_"+this.botState.botName).style.display="none";
  }

  openschedule()
  {
    this.schedule={
      botid:this.savebotrespose.botId
    }
    this.schpop=true;
  }

  closesch()
  {
    this.schpop=false;
  }

}
