import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { RpaStudioWorkspaceComponent } from '../rpa-studio-workspace/rpa-studio-workspace.component';
import { RestApiService } from '../../services/rest-api.service';
import { element } from 'protractor';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CronOptions } from 'src/app/shared/cron-editor/CronOptions';

import { HttpHeaders, HttpClient } from '@angular/common/http';

import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
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
  startTime = {hour: 1, minute: 60};
  endTime = {hour: 1, minute: 60};
  scheduleLists: any[] = [];
  form: FormGroup;
  public startDate: Date;
  public endDate: Date;
  public cronExpression = '* * * * *';
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
  constructor(private fb : FormBuilder,private rest : RestApiService, private http:HttpClient) { 
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


  
  saveBotFunAct() {
    
    this.startbot=true;
    this.pausebot=false;
    this.resumebot=false;
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
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: "Bot Saved Sucessfully",
          showConfirmButton: false,
          timer: 2000
        })
      });
    }
    else
    {
      this.childBotWorkspace.updateBotFun(this.savebotrespose).subscribe(data=>{
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
    this.startbot=false;
    this.pausebot=true;
    this.resumebot=false;
    console.log(this.savebotrespose.botId)
    this.childBotWorkspace.execution(this.savebotrespose.botId)
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: this.pause.status,
      showConfirmButton: false,
      timer: 2000
    })
  }
  
  pauseBot() {
    
    this.pausebot=false;
    this.startbot=false;
    this.resumebot=true;
    this.rest.getUserPause(this.savebotrespose.botId).subscribe(data => {
      this.pause = data;
      
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: this.pause.status,
      showConfirmButton: false,
      timer: 2000})
    })
  }

  resumeBot() {
    
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

  stopBot() {
    this.startbot=true;
    this.pausebot=false;
    this.resumebot=false;
    let data="";
    this.rest.stopbot(this.savebotrespose.botId,data).subscribe(data=>{
      console.log(data)
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: "Bot Execute Stopped",
        showConfirmButton: false,
        timer: 2000})

    })
    
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
    console.log(this.environment)
  })
}
  checkuncheckenv(id:any)
  {
    if(this.environment.find(data=>data.environmentId==id).checked==false)
    { 
      this.environment.find(data=>data.environmentId==id).checked=true
    }
    else if(  this.environment.find(data=>data.environmentId==id).checked==true)
    {
      this.environment.find(data=>data.environmentId==id).checked=false
    }
    if(this.environment.filter(data => data.checked==true).length > 0)
    {
      this.envflag=false;
    }
    else if(this.childBotWorkspace.finaldataobjects.length!=0 && this.environment.filter(data => data.checked==true).length > 0)
    {
      this.envflag=true;
    }
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
      this.hiddenSchedlerPopUp = true
      let data:any
      this.rest.scheduleList(data).subscribe((data)=> this.scheduleResponse(data))
    }
  
    scheduleResponse(data){
      console.log(data);
      this.scheduleLists = data
    }
    
    
    saveCron(){
      let sche :any;
      sche = {
        "scheduleInterval" : this.cronExpression,
        "timeZone":this.selectedTimeZone,
        "startDate": `${this.startDate["year"]+","+this.startDate["month"]+","+this.startDate["day"]+","+this.startTime["hour"]+","+this.startTime["minute"]}`,
        "endDate"  : `${this.endDate["year"]+","+this.endDate["month"]+","+this.endDate["day"]+","+this.endTime["hour"]+","+this.endTime["minute"]}`,

      }
      this.childBotWorkspace.saveCron(sche)
      // this.activeModal.close({"cronExpression":this.cronExpression,"timeZone":this.selectedTimeZone});
    }
    
    
    
    closeFun(){
      this.hiddenSchedlerPopUp = false;
    }
  
  
  
    botstatistics() {
    this.rest.botStatistics().subscribe(Status => {
      this.botStatisticsData = Status;
      console.log(this.botStatisticsData);
    })
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


  
}


