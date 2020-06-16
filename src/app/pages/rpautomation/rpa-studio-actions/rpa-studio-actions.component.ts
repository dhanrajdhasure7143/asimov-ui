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
<<<<<<< Updated upstream
    this.deploybot();
    // this.botstatistics();
    // this.getEnvironmentlist();
    // this.getpredefinedbotlist();
=======
    this.startbot=false;
    this.pausebot=false;
    this.resumebot=false;
    this.botstatistics();
    this.getEnvironmentlist();
    this.getpredefinedbotlist();
>>>>>>> Stashed changes
  }

  deploybot() {
    
    this.rest.deployremotemachine(this.savebotrespose.botId).subscribe(data => {
      this.deploymachinedata = data;
      console.log()
    })
    
  }

  deploydummybot()
  {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: "Bot deployed successfully",
      showConfirmButton: false,
      timer: 2000})
  }
  
  saveBotFunAct() {
    
    this.startbot=true;
    this.pausebot=false;
    this.resumebot=false;
    this.environment.forEach(data=>{
        if(data.Checked==true)
        {
          this.finalenv.push(data.environmentId)
        }
    })
    if(this.savebotrespose==undefined)
    {
      
      this.childBotWorkspace.saveBotFun(this.botState,this.finalenv).subscribe(data=>{
        this.childBotWorkspace.successCallBack(data);
        this.savebotrespose=data;
      });
    }
    else
    {
      this.childBotWorkspace.updateBotFun(this.savebotrespose).subscribe(data=>{
        this.childBotWorkspace.successCallBack(data);
        this.savebotrespose=data;
      });
    }
  }
 
 

  executionAct() {
    this.startbot=true;
    this.pausebot=false;
    this.resumebot=false;
    console.log(this.savebotrespose.botId)
    this.childBotWorkspace.execution(this.savebotrespose.botId)

  }
  
  pauseBot(botId) {
    
    this.pausebot=false;
    this.startbot=false;
    this.resumebot=true;
    this.rest.getUserPause(this.savebotrespose.botId).subscribe(data => {
      this.pause = data;
    })
  }

  resumeBot(botId) {
    
    this.pausebot=true;
    this.startbot=false;
    this.resumebot=false;
    this.rest.getUserResume(this.savebotrespose.botId).subscribe(data => {
      this.resume = data;
    })
  }

  stopBot(botId) {
    this.startbot=true;
    this.pausebot=false;
    this.resumebot=false;
    return this.stop;
  }

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

  getCheckboxValues(event, data) {
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
    console.log(selectedEnvironments)
    console.log("booochiiiiiiii")
    console.log(this.environment);
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
  
  
  getEnvironmentlist() {
    this.rest.listEnvironments().subscribe(data => {
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


  getVersionlist() {
    this.versionsList=[];
    let versionsdata:any=[];
    this.rest.getBotVersion(this.savebotrespose.botId).subscribe(data => {
      versionsdata=data;
      versionsdata.forEach(version =>{
        this.versionsList.push(version)
      })
      console.log(this.versionsList)
    })
  }



  getpredefinedbotlist() {
    this.rest.getpredefinedbots().subscribe(data => {
      console.log(data);
      this.predefinedbotsData=data;   
    });
   }


  
}


