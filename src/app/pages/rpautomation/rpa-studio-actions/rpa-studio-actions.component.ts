import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { RpaStudioWorkspaceComponent } from '../rpa-studio-workspace/rpa-studio-workspace.component';
import { RestApiService } from '../../services/rest-api.service';
import { element } from 'protractor';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CronOptions } from 'src/app/shared/cron-editor/CronOptions';


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
  constructor(private fb : FormBuilder,private rest : RestApiService) { 
    this.form = this.fb.group({
      'startTime' : [this.startTime, Validators.required],
      'endTime' : [this.endTime, Validators.required],
    })
  }

  ngOnInit() {
    this.deploybot();
    this.botstatistics();
    this.getEnvironmentlist();
    this.getpredefinedbotlist();
  }
  deploybot() {
    this.rest.deployremotemachine(this.saveBotFunAct).subscribe(data => {
      this.deploymachinedata = data;
    })
  }
  saveBotFunAct() {
    this.childBotWorkspace.saveBotFun();
  }
  executionAct() {
    this.childBotWorkspace.execution()
  }
  pauseBot(botId) {
    this.rest.getUserPause(botId).subscribe(data => {
      this.pause = data;
    })
  }
  resumeBot(botId) {
    this.rest.getUserResume(botId).subscribe(data => {
      this.resume = data;
    })
  }
  stopBot(botId) {
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
    let index = this.environment.findIndex(x => x.listEnvironmentData == data);
    if (event) {
      let selectedEnvironments;
      if (localStorage.getItem('cheked') === null) {
        selectedEnvironments = [];
      } else {
        selectedEnvironments = JSON.parse(localStorage.getItem('environmentId'));
      }
      selectedEnvironments.push(this.environment)
      localStorage.setItem('environmentId', JSON.stringify(selectedEnvironments));
      localStorage.CBState = JSON.stringify(selectedEnvironments);
    }
    else {
      this.environment.splice(index, 1);
      localStorage.removeItem('environmentId');
    }
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
    alert(
      JSON.stringify(sche)
    )
      // this.activeModal.close({"cronExpression":this.cronExpression,"timeZone":this.selectedTimeZone});
    }
    closeFun(){
      this.hiddenSchedlerPopUp = false;
    }
  
    }
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
  getpredefinedbotlist() {
    this.rest.getpredefinedbots().subscribe(data => {
      this.predefinedbotsData = data;
      let pre_value: any = [];
      let predefine_value: any = [];
      let showbots: any = [];
      showbots.forEach(ele => {
        predefine_value.push(ele.botName);
        this.predefinedbotValue.push(ele.botName);
        console.log(predefine_value)
        predefine_value.forEach(elem => {
          pre_value.push(elem)
          console.log(pre_value)
        })
      });
      pre_value.forEach(element => {
        let temp: any = {
          botName: element.botName
        };
        this.predefinedList.push(temp)
      })
    })
  }
}

