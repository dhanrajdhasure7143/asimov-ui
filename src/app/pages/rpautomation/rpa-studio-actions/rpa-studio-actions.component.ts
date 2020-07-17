import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { RpaStudioWorkspaceComponent } from '../rpa-studio-workspace/rpa-studio-workspace.component';
import { RestApiService } from '../../services/rest-api.service';
import { element } from 'protractor';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CronOptions } from 'src/app/shared/cron-editor/CronOptions';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RpaStudioTabsComponent } from '../rpa-studio-tabs/rpa-studio-tabs.component'
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { RpaStudioComponent } from '../rpa-studio/rpa-studio.component';

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
  public endDate: Date;
  public cronExpression = '0/1 * 1/1 * ?';
  public isCronDisabled = false;
  public selectedTimeZone :any;
  public timesZones: any[] = ["UTC","Asia/Dubai","America/New_York","America/Los_Angeles","Asia/Kolkata","Canada/Atlantic","Canada/Central","Canada/Eastern","GMT"];
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
  constructor(private fb : FormBuilder,private rest : RestApiService, private http:HttpClient,private rpa_tabs:RpaStudioTabsComponent, private rpa_studio:RpaStudioComponent) { 
    this.form = this.fb.group({
      'startTime' : [this.startTime, Validators.required],
      'endTime' : [this.endTime, Validators.required],
    })
  }

  ngOnInit() {
    this.startbot=false;
    this.pausebot=false;
    this.resumebot=false;
    this.botstatistics();
    this.getEnvironmentlist();
    this.getpredefinedbotlist();
    this.schedulepopid="schedule-"+this.botState.botName;
    if(this.botState.botId!=undefined)
    {
      this.savebotrespose=this.botState;
      this.botState.envIds.forEach(envdata=>{
          this.environment.find(data=>data.environmentId==envdata).checked=true;
      })
    }

  }

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
      });
    }
  }
 
  

  executionAct() {
    let response:any;
    if(this.savebotrespose!=undefined)
    {
      this.rest.execution(this.savebotrespose.botId).subscribe(res =>{
        response = res;
        if(response.errorCode==undefined)
        {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: response.status,
            showConfirmButton: false,
            timer: 2000            
          })
          this.startbot=false;
          this.pausebot=true;
          this.resumebot=false;
      
        }else
        {
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: response.errorMessage,
            showConfirmButton: false,
            timer: 2000            
          })
        }
      })
    }
  }
  
  pauseBot() {
    if(this.savebotrespose!=undefined)
    {
      this.rest.getUserPause(this.savebotrespose.botId).subscribe(data => {
      this.pause = data;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: this.pause.status,
          showConfirmButton: false,
          timer: 2000}) 
          this.pausebot=false;
          this.startbot=false;
          this.resumebot=true;
        })
    }
  }

  resumeBot() {
    if(this.savebotrespose!=undefined)
    {
      this.pausebot=true;
      this.startbot=false;
      this.resumebot=false;
      this.rest.getUserResume(this.savebotrespose.botId).subscribe(data => {
        this.resume = data;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: this.resume.status,
          showConfirmButton: false,
          timer: 2000})
        })
    }
  }

  stopBot() {
    let data="";
    if(this.savebotrespose!=undefined)
    {
      this.rest.stopbot(this.savebotrespose.botId,data).subscribe(data=>{
        console.log(data)
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: "Bot Execute Stopped",
          showConfirmButton: false,
          timer: 2000})
  
          this.startbot=true;
          this.pausebot=false;
          this.resumebot=false;
      })
    }
    
    
  }
/*
  listenvironments() {
    const selectedEnvironments: any = [];
    this.environment = [];
    console.log(this.listEnvironmentData.length > 0);
    const stored: string = localStorage.getItem('data');
    if (stored) {
      // split comma-separated string into array of environment names
      selectedEnvironments.push(...stored.split(','));
    }
    if (this.listEnvironmentData) {
      this.optionList = true;
      let value: any = []
      this.listEnvironmentData.forEach(element => {
        let temp: any = {
          environmentName: element.environmentName,
          environmentId: element.environmentId
        };
        this.environment.push(temp)
      })
    }
    else {
      this.optionList = false
      this.environment = [{
        name: "No Options"
      }]
    }
  }
*/
  /*getCheckboxValues(event, data) {
    let selectedEnvironments;
    let index = this.environment.findIndex(x => x.listEnvironmentData == data);
    if (event) 
    {

      if (localStorage.getItem('cheked') === null) 
      {
        selectedEnvironments = [];
      } 
      else 
      {
        selectedEnvironments = JSON.parse(localStorage.getItem('environmentId'));
      }
      selectedEnvironments.push(this.environment)
      localStorage.setItem('environmentId', JSON.stringify(selectedEnvironments));
      localStorage.CBState = JSON.stringify(selectedEnvironments);
    }
    else 
    {
      this.environment.splice(index, 1);
      localStorage.removeItem('environmentId');
    }
  }*/
  
  /*getEnvironmentlist() {
    this.rest.listEnvironments().subscribe(data => {
      data["checked"]=false;
      this.listEnvironmentData = data;
      let value: any = [];
      let subValue: any = []
      let showlist: any = [];
      showlist.forEach(el => {
        subValue.push(el.environmentName);
        this.environmentValue.push(el.environmentName);
        console.log(subValue)
        subValue.forEach(ele => {
          value.push(ele)
          console.log(value);
        })
      });
      value.forEach(element => {
        let temp: any = {
          environmentName: element.environmentName,
          checked: element.environmentId
        };
        this.dropdownList.push(temp)
      })
    })
  }
*/
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
      this.rest.scheduleList(this.savebotrespose.botId).subscribe((data)=> this.scheduleResponse(data))
    }
  
    scheduleResponse(data){
      console.log(data);
      this.scheduleLists = data
    }
    
    

    saveCron(){
    let sche :any;
    sche = {
    "TimeZone":this.selectedTimeZone,
    "numberofRepetitions":1,
    "scheduleIntervals" : [{
    "scheduleInterval" :this.cronExpression,
    "startDate":`${this.startDate["year"]+","+this.startDate["month"]+","+this.startDate["day"]+","+this.startTime["hour"]+","+this.startTime["minute"]}`,
    "endDate"  :`${this.endDate["year"]+","+this.endDate["month"]+","+this.endDate["day"]+","+this.endTime["hour"]+","+this.endTime["minute"]}`,
            }]
          }
    this.childBotWorkspace.saveCron(sche)
    this.hiddenSchedlerPopUp = false;
    Swal.fire({
    position:'top-end',
    icon:'success',
    title:'Scheduler Data saved successfull',
    showConfirmButton:false,
    timer:2000
          })
    // this.activeModal.close({"cronExpression":this.cronExpression,"timeZone":this.selectedTimeZone});
    document.getElementById(this.schedulepopid).style.display="none";
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
            console.log(response);
          })
        /*}
    })*/
   }

  
}


