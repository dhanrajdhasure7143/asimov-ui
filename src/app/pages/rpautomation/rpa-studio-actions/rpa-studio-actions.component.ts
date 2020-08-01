import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { RpaStudioWorkspaceComponent } from '../rpa-studio-workspace/rpa-studio-workspace.component';
import { RestApiService } from '../../services/rest-api.service';
import { element } from 'protractor';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CronOptions } from 'src/app/shared/cron-editor/CronOptions';
import cronstrue from 'cronstrue';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RpaStudioTabsComponent } from '../rpa-studio-tabs/rpa-studio-tabs.component'
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { RpaStudioComponent } from '../rpa-studio/rpa-studio.component';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-rpa-studio-actions',
  templateUrl: './rpa-studio-actions.component.html',
  styleUrls: ['./rpa-studio-actions.component.css']
})
export class RpaStudioActionsComponent implements OnInit {
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
  displayedColumns: string[] = ['run_id','version','start_date','start_time','end_date' ,'end_time', "bot_status"];
  Viewloglist:MatTableDataSource<any>;
  displayedColumns1: string[] = ['task_name', 'status','start_time','start_date','end_time','end_date','error_info' ];
  logbyrunid:MatTableDataSource<any>; 
  
  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:false}) sort: MatSort;

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
  public startDate: Date;
  selectTime;
  public endDate: Date;
  public cronExpression = '0/1 * 1/1 * *';
  public isCronDisabled = false;
  public selectedTimeZone :any;
  public viewlogid:any;
  public she:any;
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
  constructor(private fb : FormBuilder,private rest : RestApiService, private http:HttpClient,
    private rpa_tabs:RpaStudioTabsComponent, private rpa_studio:RpaStudioComponent) { 
    this.form = this.fb.group({
      'startTime' : [this.startTime, Validators.required],
      'endTime' : [this.endTime, Validators.required],
    })
  }

  ngOnInit() {
    this.startbot=false;
    this.pausebot=false;
    this.resumebot=false;
    this.logflag=false;
    this.botstatistics();
    this.getEnvironmentlist();
    this.getpredefinedbotlist();

    this.schedulepopid="schedule-"+this.botState.botName;  
    this.viewlogid="viewlog-"+this.botState.botName;
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



  saveBotFunAct() {
    this.finalenv=[];
    this.environment.forEach(data=>{
        if(data.checked==true)
        {
          this.finalenv.push(data.environmentId)
        }
    })
    if(this.savebotrespose==undefined)
    {
      
      this.childBotWorkspace.saveBotFun(this.botState,this.finalenv).subscribe(data=>{
        this.savebotrespose=data;
        if(this.savebotrespose.botId!=undefined)
        {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: "Bot Saved Sucessfully",
            showConfirmButton: false,
            timer: 2000
          })
          this.getschecdules();
          this.startbot=true;
          this.pausebot=false;
          this.resumebot=false;
          this.childBotWorkspace.disable=true;
        }
        else
        {
          
          this.childBotWorkspace.disable=false;
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: "Bot failed to Save",
            showConfirmButton: false,
            timer: 2000
          })
        }  
      });
    }
    else
    {
      
      this.childBotWorkspace.saveCron(this.she);
      this.childBotWorkspace.updateBotFun(this.savebotrespose,this.finalenv).subscribe(data=>{
        this.childBotWorkspace.successCallBack(data);
        this.savebotrespose=data;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: "Bot Updated Sucessfully",
          showConfirmButton: false,
          timer: 2000
        })
        this.getschecdules();
      });
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


  getEnvironmentlist() {
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
          this.selectedTimeZone=savedschedule.timeZone;
          let savecond={
          "scheduleInterval" :savedschedule.scheduleInterval,
          "startDate":savedschedule.startDate,
          "endDate":savedschedule.endDate,
          "intervalId":savedschedule.intervalId,
          }
          schedules.push(savecond)
          })
        this.she={
          "TimeZone":this.scheduleLists[0].timeZone,
          "numberofRepetitions":1,
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
      "scheduleInterval" :this.cronExpression,
      "startDate":`${this.startDate["year"]+","+this.startDate["month"]+","+this.startDate["day"]+","+this.startTime["hour"]+","+this.startTime["minute"]}`,
      "endDate"  :`${this.endDate["year"]+","+this.endDate["month"]+","+this.endDate["day"]+","+this.endTime["hour"]+","+this.endTime["minute"]}`,
      "intervalId": this.childBotWorkspace.idGenerator(),
    }
    let sche2= 
    {
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
        "TimeZone":this.selectedTimeZone,
        "numberofRepetitions":1,
        "scheduleIntervals" : arraydata,
      }
    }
    else
    {
      this.she.TimeZone=this.selectedTimeZone,
      this.she.scheduleIntervals.push(scheduleddata);
      console.log(this.she)
    }

    this.scheduleLists.push(sche2)
    this.hiddenSchedlerPopUp = false;
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
      versionsdata.forEach(version =>{
        this.versionsList.push(version)
      })
   
    })
  }

  getpredefinedbotlist() {
    this.rest.getpredefinedbots().subscribe(data => {
      this.predefinedbotsData=data;   
    });
   }

   removeSchedule(scheduleRecord)
   { 
      if(this.she!=undefined)
      { 
        console.log(this.she)
        let index=this.she.scheduleIntervals.findIndex(schedule=>schedule.intervalId==scheduleRecord.intervalId);
        this.she.scheduleIntervals.splice(index,1);
        let index2=this.scheduleLists.findIndex(scheduleitem=>scheduleitem.intervalId==scheduleRecord.intervalId);
        this.scheduleLists.splice(index2,1);
        if(this.she.scheduleIntervals.length==0)
        {
          this.she=undefined;
        }
      }

   }

   switchversion(vid)
   {
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
          })
        /*}
    })*/
   }







   viewlogdata(){
    let response: any;
    let log:any=[];
    this.logresponse=[];
    this.rest.getviewlogdata(this.savebotrespose.botId,this.savebotrespose.version).subscribe(data =>{
        this.logresponse=data;
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
      this.Viewloglist = new MatTableDataSource(log);
      console.log(this.Viewloglist);

      this.Viewloglist.paginator=this.paginator;
      this.Viewloglist.sort=this.sort;
      
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
      this.logbyrunid.paginator=this.paginator;
      this.logbyrunid.sort=this.sort;
    })
}

back(){
  //document.getElementById("ViewLog").style.display="none";
  this.logflag=false;
}

viewlogclose(){
  document.getElementById(this.viewlogid).style.display="none";
}

loadpredefinedbot(botId)
{
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
  })
}



convertcron(cronexp)
{
  return cronstrue.toString(cronexp);
}
  
}
