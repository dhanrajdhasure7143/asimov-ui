import {Input, Component, OnInit, EventEmitter,Output, SimpleChanges } from '@angular/core';
import { CronOptions } from 'src/app/shared/cron-editor/CronOptions';
import {RestApiService} from 'src/app/pages/services/rest-api.service';
import cronstrue from 'cronstrue';
import moment from 'moment';
import { NotifierService } from 'angular-notifier';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isArray } from 'highcharts';
// import { keys } from 'highcharts';

@Component({
  selector: 'app-ai-agent-scheduler',
  templateUrl: './ai-agent-scheduler.component.html',
  styleUrls: ['./ai-agent-scheduler.component.css']
})
export class AiAgentSchedulerComponent implements OnInit {
  @Output() schedulerData = new EventEmitter<any>();
  @Input() public disabled: boolean;
  @Input() public options: CronOptions;
  @Input() public schedulerValue: any;
  @Input() public isEdit: any;
  selectOptions: any;
  state: any;
    
  @Input() get cron(): string { return this.localCron; }
  set cron(value: string) {
        this.localCron = value;
        this.cronChange.emit(this.localCron);
  }

  @Output() cronChange = new EventEmitter();

  private localCron: string;
  botid:any;
  // test:boolean=false;
  processid:any;
  beforetime:boolean=false;
  public Environments:any;
  public timesZones: any = [];
  i="";
  public cronOptions: CronOptions = {
    formInputClass: 'form-control cron-editor-input',
    formSelectClass: 'form-control cron-editor-select',
    formRadioClass: 'cron-editor-radio',
    formCheckboxClass: 'cron-editor-checkbox',

    defaultTime: "00:00:00",

    hideMinutesTab: false,
    hideHourlyTab: false,
    hideDailyTab: true,
    hideWeeklyTab: true,
    hideMonthlyTab: true,
    hideYearlyTab: false,
    hideAdvancedTab: false,
    hideSpecificWeekDayTab : false,
    hideSpecificMonthWeekTab : false,
    use24HourTime: true,
    hideSeconds: false,

    cronFlavor: "standard"
  }
  CronOptions:any;
  processName:any;
  cronExpression = '0/1 * 1/1 * *';
  isCronDisabled = false;
  picker1;
  picker2;
  starttime:any;
  h:any;
  todaytime:any;
  endtime:any="23:59";
  schedules:any=[];
  startdate:any;
  enddate:any;
  timezone:any="";
  schedule_list:any=[];
  botdata:any;
  selectedEnvironment:any;
  environmentid:any;
  deletestack:any=[];
  month:any;
  day:any;
  endtimeerror:any;
  issame:boolean;
  selecteddate:any;
  isbefore:boolean;
  flags={
    startflag:false,
    stopflag:false,
    pauseflag:false,
    resumeflag:false,
    deleteflag:false,
  }
  q=0;
  currenttime: any;
  start_time:any;
  end_time:any;
  starttimeerror:any;
  aftertime:boolean=false;
  checkScheduler : boolean = false;
  activeTab: string = 'daily';
  frequency: string = '';
  form: FormGroup;
  selectedFrequency: any;
  frequencyOptions = [
    { frequencyName: 'Recurring', value: 'recurring' },
    { frequencyName: 'One Time', value: 'onetime' }
  ];

selectedDays: string[] = [];
selectedRecurringType: string;
isDisplayed: boolean= true;
isMonthly: boolean=true;
response:any;
fromMonth: any;
toMonth: any;
scheduled_data:any={};

  constructor(
    private rest:RestApiService, 
    private notifier: NotifierService,
    private loader:LoaderService,
    private toastService: ToasterService,
    private toastMessages: toastMessages,
    private fb: FormBuilder
     ) { }
  mindate= moment().format("YYYY-MM-DD");
  ngOnInit() {
    var dtToday = new Date();
    this.selecteddate=new Date()
   // this.startdate=this.startdate.getFullYear()+"-"+(this.startdate.getMonth()+1)+"-"+this.startdate.getDate();
   this.month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();
    if(this.month < 10)
        this.month = '0' + this.month.toString();
    if(day < 10)
        this.day = '0' + day.toString();
    var minDate= year + '-' + this.month + '-' + day;
    $('#txtDate').attr('min', minDate);
    $('#enddatepicker').attr('min', minDate);
    // this.get_schedule()

    this.startdate =  moment(new Date()).format("YYYY-MM-DD");
    this.enddate = moment(new Date()).format("YYYY-MM-DD");
   this.gettime();
    this.starttime=(new Date).getHours()+":"+(new Date).getMinutes();
     this.getAlltimezones();
    this.form = this.fb.group({
      frequency: ['', Validators.required]
    });
  }  

  ngOnChanges(){
    console.log(this.isEdit)
    if(this.isEdit){
      if (this.schedulerValue) {
        console.log("schedulerValue For Formating",JSON.parse(this.schedulerValue));
        if(Array.isArray(JSON.parse(this.schedulerValue)))
        this.scheduled_data = JSON.parse(this.schedulerValue)[0];
        this.timezone = this.scheduled_data.timezone;

        // Method that changes the data to display in overlay (Update case)
        this.schedularInfoSetup(this.scheduled_data)
      }
    }
  }

gettime(){
 
  this.todaytime=(new Date).getHours()+":"+(new Date).getMinutes();
  // this.todaytime="8:6"
   let firstchar=this.todaytime.split(":")
   let str1='0'
   if(firstchar[0]<10){
     var firstchar1=str1.concat(firstchar[0])
     
   }
   else{
     firstchar1=firstchar[0]
   }
   if(firstchar[1]<10){
     var firstchar2=str1.concat(firstchar[1])
   }
   else{
     firstchar2=firstchar[1]
   }
   this.todaytime=firstchar1+ ":" +firstchar2
}
  // get_schedule(){
  //     this.loader.show()
  //     this.rest.getbotSchedules().subscribe((response:any)=>{
  //       this.loader.hide()
  //       if(response.errorMessage==undefined)
  //       {
  //         this.schedule_list=[...response.map(item=>{
  //           item["checked"]=false;
  //           return item;
  //         })];
  //         this.checkScheduler=false;
  //         this.flags={
  //           startflag:false,
  //           stopflag:false,
  //           pauseflag:false,
  //           resumeflag:false,
  //           deleteflag:false,
  //         }
  //       }
  //       else
  //        this.toastService.showError(response.errorMessage+'!');
  //       },err=>{
  //       this.loader.hide()
  //       this.toastService.showError(this.toastMessages.schLoadFail);
  //     })

  // }

onFrequencyChange(event: any) {
  this.selectedFrequency = event.target.value;
  this.selectedRecurringType = 'recurring'; 
}

onRecurringTypeChange(event: any) {
  this.selectedRecurringType = event.target.value;
}

public setActiveTab(tab: string, event: any) {
  event; 
  if (!this.disabled) {
      this.activeTab = tab;
  }
}

  onTimeZoneChange(timezone){
    let d:any = new Date(new Date().toLocaleString("en-US", {timeZone: timezone}));
    // this.startdate=  d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    this.startdate =  moment(d).format("YYYY-MM-DD");
    this.enddate = moment(d).format("YYYY-MM-DD");
    this.starttime=d.getHours()+":"+d.getMinutes();
  }

  // onOnetimeChange(event,time){ 
  //       console.log("onetime")
  //       this.todaytime = moment().format("HH:mm");
     
  //       event=this.tConv24(event)
  //       this.beforetime=false;
  //       this.aftertime=false;
        
  //       if(this.isDateToday(this.selecteddate)){
  //         if(time=='starttime'){
  //           this.currenttime=this.tConv24(this.todaytime)
  //           this.end_time=this.tConv24(this.endtime)
  //           //  let a=moment(event,'h:mma')
  //           //  let b=moment(this.currenttime,'h:mma')
  //           //  let f=moment(this.end_time,'h:mma')

  //           let a = moment(event, 'h:mma');
  //           let b = moment(this.currenttime,'h:mma')
  //           let f = a.clone().add(5, 'minutes').format('h:mma');
  //          console.log("start and end time:",a,f);
  //            this.isbefore=(a.isBefore(b));
  //            let g=(a.isAfter(f))
  //            this.issame=(a.isSame(f))
  //           if(this.isbefore){
  //             this.starttimeerror="start time should not be before than current time"
  //             this.beforetime=true
  //           }
            
  //           if(g){
  //              this.starttimeerror="start time should not be greater than end time";
  //              this.beforetime=true
  //           }
  //           if(this.issame){
  //             this.starttimeerror="start time should not be equal to end time";
  //             this.beforetime=true
  //           }
           
  //         this.endtime = f;
  //         }

  //         else{
  //           this.start_time=this.tConv24(this.starttime);
  //           this.currenttime=this.tConv24(this.todaytime)
            
  //           let c=moment(this.start_time,'h:mma')
  //           let d=moment(event,'h:mma');
  //           let currenttime=moment(this.currenttime,'h:mma')
  //           let beforecurrenttime=(d.isBefore(currenttime))
           
  //           let e=(c.isBefore(d))
  //          let starttime_error=(c.isBefore(currenttime))
            
  //           if(e==false ){
  //             this.aftertime=true;
  //             this.endtimeerror="end time should not be before than or equal to start time"
  //           }
  //           if(beforecurrenttime){
  //             this.aftertime=true;
  //             this.endtimeerror="end time should not be before than or equal to current time"
  //           }
  //          if(starttime_error){
  //            this.beforetime=true;
  //            this.starttimeerror="start time should not be before than current time"
  //          }
  //         }
  //       }
  //       else{
  //         if(this.startdate==this.enddate){
  //           if(time=='starttime'){
  //             this.end_time=this.tConv24(this.endtime)
  //             this.start_time=this.tConv24(this.starttime)
  //              let a=moment(this.end_time,'h:mma')
  //             let b = moment(this.start_time, 'h:mma').add(5, 'minutes');
  //             this.issame=(a.isSame(b))
  //             this.isbefore=(b.isAfter(a));
  //             if(this.isbefore){
  //               this.beforetime=true;
  //               this.starttimeerror="start time should not be before than end time"
      
  //             }
  //             if(this.issame ){
  //               this.beforetime=true;
  //               this.starttimeerror="start time should not be equal to end time"
  //             }
             
  //           }
  //           else{
  //             this.end_time=this.tConv24(this.endtime)
  //             this.start_time=this.tConv24(this.starttime)
  //              let a=moment(this.end_time,'h:mma')
  //              let b=moment(this.start_time,'h:mma')
  //              this.issame=(a.isSame(b))
  //              this.isbefore=(a.isBefore(b));
  //              if(this.isbefore ){
  //               this.aftertime=true;
  //               this.endtimeerror="end time should not be before than start time"
  //              }
  //              if(this.issame){
  //               this.aftertime=true;
  //               this.endtimeerror="end time should not be equal to start time"
  //              }
              
      
  //           }
  //         }
  //         if (this.startdate === this.enddate) {
  //           if (time === 'starttime') {
  //             this.end_time = this.tConv24(this.endtime);
  //             this.start_time = this.tConv24(this.starttime);
          
  //             // Convert cron time (5 minutes) to moment duration
  //             let cronDuration = moment.duration(5, 'minutes');
          
  //             // Calculate end time as start time + cron time
  //             let endTimeMoment = moment(this.start_time, 'h:mma').add(cronDuration);
          
  //             // Compare moments for end time and calculated end time
  //             let a = moment(this.end_time, 'h:mma');
  //             let b = endTimeMoment;
          
  //             // Check if start time is before end time or they are the same
  //             this.isbefore = b.isAfter(a);
  //             this.issame = a.isSame(b);
          
  //             // Set error flags and messages based on conditions
  //             if (this.isbefore) {
  //               this.beforetime = true;
  //               this.starttimeerror = "Start time should not be before than end time";
  //             }
  //             if (this.issame) {
  //               this.beforetime = true;
  //               this.starttimeerror = "Start time should not be equal to end time";
  //             }
  //           } else {
  //             this.end_time = this.tConv24(this.endtime);
  //             this.start_time = this.tConv24(this.starttime);
          
  //             let cronDuration = moment.duration(5, 'minutes');
          
  //             let endTimeMoment = moment(this.start_time, 'h:mma').add(cronDuration);
          
  //             let a = moment(this.end_time, 'h:mma');
  //             let b = endTimeMoment;
          
  //             this.isbefore = a.isBefore(b);
  //             this.issame = a.isSame(b);
          
  //             if (this.isbefore) {
  //               this.aftertime = true;
  //               this.endtimeerror = "End time should not be before than start time";
  //             }
  //             if (this.issame) {
  //               this.aftertime = true;
  //               this.endtimeerror = "End time should not be equal to start time";
  //             }
  //           }
  //         }
          
         
  //       }
       
       
  //     }

  onOnetimeChange(event, time) {
    console.log("onetime");
    this.todaytime = moment().format("HH:mm");
    // event = this.tConv24(event);
    this.beforetime = false;
    this.aftertime = false;
  
    if (this.isDateToday(this.selecteddate)) {
      if (time === 'starttime') {
        this.currenttime = this.tConv24(this.todaytime);
        this.end_time = this.tConv24(this.endtime);
  
        let a = moment(event, 'h:mma');
        let b = moment(this.currenttime, 'h:mma');
        let f = a.clone().add(5, 'minutes').format('HH:mm');
        
        // const endTime = moment(a, 'HH:mm:ss').add(5, 'minutes').format('HH:mm');
        console.log("start and end time:", a.format('h:mma'), f);
  
        this.isbefore = a.isBefore(b);
        let g = a.isAfter(f);
        this.issame = a.isSame(f);
  
        if (this.isbefore) {
          this.starttimeerror = "Start time should not be before than current time";
          this.beforetime = true;
        }
  
        if (g) {
          this.starttimeerror = "Start time should not be greater than end time";
          this.beforetime = true;
        }
  
        if (this.issame) {
          this.starttimeerror = "Start time should not be equal to end time";
          this.beforetime = true;
        }
  
        this.endtime = f;
      } else {
        this.start_time = this.tConv24(this.starttime);
        this.currenttime = this.tConv24(this.todaytime);
  
        let c = moment(this.start_time, 'h:mma');
        let d = moment(event, 'h:mma');
        let currenttime = moment(this.currenttime, 'h:mma');
        let beforecurrenttime = d.isBefore(currenttime);
  
        let e = c.isBefore(d);
        let starttime_error = c.isBefore(currenttime);
  
        if (!e) {
          this.aftertime = true;
          this.endtimeerror = "End time should not be before than or equal to start time";
        }
  
        if (beforecurrenttime) {
          this.aftertime = true;
          this.endtimeerror = "End time should not be before than or equal to current time";
        }
  
        if (starttime_error) {
          this.beforetime = true;
          this.starttimeerror = "Start time should not be before than current time";
        }
      }
    } else {
      // if (this.startdate === this.enddate) {
        if (time === 'starttime') {
          // this.end_time = this.tConv24(this.endtime);
          this.start_time = this.tConv24(this.starttime);
  
          // let a = moment(this.end_time, 'h:mma');
          // let a = moment(this.start_time, 'h:mma');
          // let b = moment(this.start_time, 'h:mma').add(5, 'minutes');
          // let f = a.clone().add(5, 'minutes').format('HH:mm');

          let a = moment(event, 'h:mma');
          let b = moment(this.currenttime, 'h:mma');
          let f = a.clone().add(5, 'minutes').format('HH:mm');
  
          this.issame = a.isSame(f);
          this.isbefore = b.isAfter(a);
  
          // if (this.isbefore) {
          //   this.beforetime = true;
          //   this.starttimeerror = "Start time should not be before than end time";
          // }
  
          if (this.issame) {
            this.beforetime = true;
            this.starttimeerror = "Start time should not be equal to end time";
          }
        } else {
          this.end_time = this.tConv24(this.endtime);
          this.start_time = this.tConv24(this.starttime);
  
          let a = moment(this.end_time, 'h:mma');
          let b = moment(this.start_time, 'h:mma').add(5, 'minutes');
  
          this.issame = a.isSame(b);
          this.isbefore = a.isBefore(b);
  
          if (this.isbefore) {
            this.aftertime = true;
            this.endtimeerror = "End time should not be before than start time";
          }
  
          if (this.issame) {
            this.aftertime = true;
            this.endtimeerror = "End time should not be equal to start time";
          }
        }
      // }
    }
  }
  

  onChangeHour(event,time){ 
//  this.todaytime=(new Date).getHours()+":"+(new Date).getMinutes();;
    this.todaytime = moment().format("HH:mm");
 
    event=this.tConv24(event)
    this.beforetime=false;
    this.aftertime=false;
    
    if(this.isDateToday(this.selecteddate)){
      if(time=='starttime'){
        this.currenttime=this.tConv24(this.todaytime)
        this.end_time=this.tConv24(this.endtime)
         let a=moment(event,'h:mma')
         let b=moment(this.currenttime,'h:mma')
         let f=moment(this.end_time,'h:mma')
       
         this.isbefore=(a.isBefore(b));
         let g=(a.isAfter(f))
         this.issame=(a.isSame(f))
        if(this.isbefore){
          this.starttimeerror="start time should not be before than current time"
          this.beforetime=true
        }
        
        if(g){
           this.starttimeerror="start time should not be greater than end time";
           this.beforetime=true
        }
        if(this.issame){
          this.starttimeerror="start time should not be equal to end time";
          this.beforetime=true
        }
       
      }
      else{
        this.start_time=this.tConv24(this.starttime);
        this.currenttime=this.tConv24(this.todaytime)
        
        let c=moment(this.start_time,'h:mma')
        let d=moment(event,'h:mma');
        let currenttime=moment(this.currenttime,'h:mma')
        let beforecurrenttime=(d.isBefore(currenttime))
       
        let e=(c.isBefore(d))
       let starttime_error=(c.isBefore(currenttime))
        
        if(e==false ){
          this.aftertime=true;
          this.endtimeerror="end time should not be before than or equal to start time"
        }
        if(beforecurrenttime){
          this.aftertime=true;
          this.endtimeerror="end time should not be before than or equal to current time"
        }
       if(starttime_error){
         this.beforetime=true;
         this.starttimeerror="start time should not be before than current time"
       }
      }
    }
    else{
      if(this.startdate==this.enddate){
        if(time=='starttime'){
     

          this.end_time=this.tConv24(this.endtime)
          this.start_time=this.tConv24(this.starttime)
           let a=moment(this.end_time,'h:mma')
           let b=moment(this.start_time,'h:mma')
          this.issame=(a.isSame(b))
           this.isbefore=(b.isAfter(a));
          if(this.isbefore){
            this.beforetime=true;
            this.starttimeerror="start time should not be before than end time"
  
          }
          if(this.issame ){
            this.beforetime=true;
            this.starttimeerror="start time should not be equal to end time"
          }
         
        }
        else{
          this.end_time=this.tConv24(this.endtime)
          this.start_time=this.tConv24(this.starttime)
           let a=moment(this.end_time,'h:mma')
           let b=moment(this.start_time,'h:mma')
           this.issame=(a.isSame(b))
           this.isbefore=(a.isBefore(b));
           if(this.isbefore ){
            this.aftertime=true;
            this.endtimeerror="end time should not be before than start time"
           }
           if(this.issame){
            this.aftertime=true;
            this.endtimeerror="end time should not be equal to start time"
           }
          
  
        }
      }
     
    }
   
   
  }
  tConv24(time24) {
    
    
    var ts = time24;
    var H = +ts.substr(0, 2);
    this.h = (H % 12) || 12;
    this.h = (this.h < 10)?("0"+this.h):this.h;  // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? " AM" : " PM"; 
    ts = this.h + ts.substr(2, 3) +ampm;
    return ts;

  };

  dateChange($event,date){
    this.beforetime=false;
    this.aftertime=false;
   if(date=='startdate'){
    //this.enddate=this.startdate;
    $('#enddatepicker').attr('min', this.startdate);
   }
  
   this.selecteddate=$event.target.value
   if(this.isDateToday($event.target.value)) {
    this.starttime=(new Date).getHours()+":"+(new Date).getMinutes();
    this.endtime='23:59'
   }
    else{
      this.starttime="00:00";
      this.endtime='23:59'
    }
    
  }
  isDateToday(date) {
    const otherDate = new Date(date);
    const todayDate = new Date();
  
    if (
      otherDate.getDate() === todayDate.getDate() &&
      otherDate.getMonth() === todayDate.getMonth() &&
      otherDate.getFullYear() === todayDate.getFullYear()
    ) {
      return true;
    } else {
      return false;
    }
  }

  readValue(weeklyResponse){
    this.response = weeklyResponse;
  }

  readMonthlyValue(event: { fromMonth: any, toMonth: any, day: any }) {
    const { fromMonth, toMonth, day } = event;
    console.log('From Month:', fromMonth);
    console.log('To Month:', toMonth);
    console.log('day:', day);
    this.fromMonth = fromMonth;
    this.toMonth = toMonth;
    this.day = day;
  }

  add_scheduler(){
    // Scheduler
    if(this.isDateToday(this.selecteddate)){
      this.todaytime=(new Date).getHours()+":"+(new Date).getMinutes();
      let current_time=this.tConv24(this.todaytime)
      let start_time=this.tConv24(this.starttime)
       let validatecurrenttime=moment(start_time,'h:mma');
       let validatesystemtime=moment(current_time,'h:mma');
       let isbefore=(validatecurrenttime.isBefore(validatesystemtime));
       if(isbefore){
         this.beforetime=true;
         this.starttimeerror="start time should not be before than current time"
       } else{
         this.beforetime=false
        this.addscheduler()
       }
    } else{
      this.addscheduler()
    }
  }

  addscheduler(){
    if(this.startdate !="" && this.enddate!=""  && this.starttime!=undefined  && this.timezone!="" && this.timezone!=undefined){
      let starttime=this.starttime.split(":")
      let starttimeparse=parseInt(starttime[0])
       let endtime=this.endtime.split(":")
       let endtimeparse=parseInt(endtime[0]);
        let startdate=this.startdate.split("-");
        let enddate=this.enddate.split("-");

        if (this.selectedFrequency === 'onetime') {
          // changing the time to end of the update day in ontime case 
          let end_time="23:59";
          endtime=end_time.split(":")
          enddate=this.startdate.split("-");
          this.cronExpression = '*/5 * * * *';
        }

        if (this.selectedFrequency === 'recurring' && this.activeTab === 'daily' && this.starttime) {
          const [hour, minute] = this.starttime.split(':');
          this.cronExpression = `${minute} ${hour} * * *`;
          console.log("payload for daily (hour:minute):"+hour+":"+ minute)
          console.log("cronExpression for daily is:", this.cronExpression);
        }

        if (this.selectedFrequency === 'recurring' && this.activeTab === 'weekly' && this.starttime) {
          const days = this.response;
          const [hour, minute] = this.starttime.split(':');
          const daysSelected = Object.keys(days).filter(key => days[key] === true);
          this.cronExpression = `${minute} ${hour} * * ${daysSelected}`;
          console.log("payload for weekly (hour,minute,daysSelected):", hour, minute, daysSelected);
          console.log("cron expression for weekly is:", this.cronExpression);
        }

        if (this.selectedFrequency === 'recurring' && this.activeTab === 'monthly' && this.starttime) {
          const [hour, minute] = this.starttime.split(':');
          const fromMonth = this.fromMonth;
          const toMonth = this.toMonth;
          const day = this.day;

          // Added a Selected Month based on the selected Month.
          startdate[1]= this.fromMonth
          enddate[1]= this.toMonth

          this.cronExpression = `${minute} ${hour} ${day} ${fromMonth}-${toMonth} *`;
          console.log("payload for monthly (hour, minute, frommonth, tomonth,day):",minute,hour,day,fromMonth,toMonth);
          console.log("cron expression for monthly is:", this.cronExpression);
      }

        let scheduleData= [
          {
          "intervalId":this.generateid(),
         "scheduleInterval":this.cronExpression,
         startDate:parseInt(startdate[0])+","+parseInt(startdate[1])+","+parseInt(startdate[2])+","+starttimeparse+","+starttime[1],
         endDate:parseInt(enddate[0])+","+parseInt(enddate[1])+","+parseInt(enddate[2])+","+ endtimeparse+","+ endtime[1],
         "timezone":this.timezone,
        //  "save_status":"unsaved",
        //  "processId":null,
        //  "processName":"",
        //  "envId":"",
        //  "check":false
        }]
        // data={
        //   scheduledIntervalid:27,
        //   scheduleInterval:this.cronExpression,
        //   startDate:parseInt(startdate[0])+","+parseInt(startdate[1])+","+parseInt(startdate[2])+","+starttimeparse+","+parseInt(starttime[1]),
        //   endDate:parseInt(enddate[0])+","+parseInt(enddate[1])+","+parseInt(enddate[2])+","+ endtimeparse+","+ parseInt(endtime[1]),
        //   timeZone:this.timezone,
        //   botSource:"EPSoft",
        //   botActionStatus:"New",
        //   modifiedBy:`${localStorage.getItem("firstName")} ${localStorage.getItem("lastName")} `,
        // }
       // let scheduleArr=[...this.schedule_list];
        //scheduleArr.push(data);
        this.schedulerData.emit(scheduleData)
        console.log("schedulerData:", this.schedulerData)
        // console.log(data)
        // return
        // this.loader.show()
        // this.rest.addbotSchedules([data]).subscribe((response:any)=>{
        //   this.loader.hide();
        //   if(response.errorMessage == undefined){
        //     this.toastService.showSuccess(this.toastMessages.saveSchedule, 'response');   
        //   }  
        //   else
        //  this.toastService.showError(response.errorMessage+'!');
        // },err=>{
        //   this.loader.hide();
        //   this.toastService.showError(this.toastMessages.saveError)
        // })
    }
    else
    {
      this.loader.hide();
      this.toastService.showError(this.toastMessages.fillDetails)
    }
  }

  check_all(event)
  {
    this.schedule_list=this.schedule_list.map((sch)=>{
      sch.checked=event.target.checked;
      if(this.schedule_list.filter(data=>data.checked == true).length == this.schedule_list.length){
        this.checkScheduler = true;
      }else{
        this.checkScheduler = false;
      }
      return sch;
    })
   
    this.updateflags();
  }


  check_schedule(event,intervalid)
  {
    this.schedule_list.find(data=>data.intervalId==intervalid).checked=event.target.checked;
    if(this.schedule_list.filter(data=>data.checked == true).length == this.schedule_list.length){
      this.checkScheduler = true;
    }else{
      this.checkScheduler = false;
    }
    this.updateflags();
  }

  convertcron(cronexp)
  {
    return cronstrue.toString(cronexp);
  }

  start_schedule(){
    let checked_schedule=this.schedule_list.find(data=>data.checked==true)
    if(this.botid!=undefined && this.botid != "")
    {
      let schedule={
        botId:this.botid,
        "scheduleInterval":checked_schedule.scheduleInterval,
        "intervalId":checked_schedule.intervalId,
      }
      this.rest.start_schedule(schedule).subscribe((resp:any)=>{
        if(resp.errorMessage==undefined)
        {
          this.toastService.showSuccess(this.toastMessages.scheduleStart,'response');   
        }
        else
          this.toastService.showError(resp.errorMessage+'!');
      })
    }
  }

  // pause_schedule()
  // {
  //   let checked_schedule=this.schedule_list.find(data=>data.checked==true)
  //     let schedule={
  //       botId:this.data.botid,
  //       "botVersion": this.data.version,
  //       "scheduleInterval":checked_schedule.scheduleInterval,
  //       "intervalId":checked_schedule.intervalId,
  //     }
  //     this.rest.pause_schedule(schedule).subscribe(data=>{
  //       let resp:any=data
  //       if(resp.errorMessage==undefined){
  //         this.toastService.showSuccess(this.toastMessages.schedulePause,'response');
  //         this.get_schedule();
  //       } else{
  //        this.toastService.showError(resp.errorMessage+'!');
  //       }
  //     })
  // }

  // resume_schedule()
  // {
  //   let checked_schedule=this.schedule_list.find(data=>data.checked==true)
  //   let schedule={
  //     botId:this.data.botid,
  //     "botVersion": this.data.version,
  //     "scheduleInterval":checked_schedule.scheduleInterval,
  //     "intervalId":checked_schedule.intervalId,
  //   }
  //   this.rest.resume_schedule(schedule).subscribe(data=>{
  //     let resp:any=data
  //     if(resp.errorMessage==undefined){
  //       this.toastService.showSuccess(this.toastMessages.scheduleResume,'response');   
  //       this.get_schedule();
  //     }else
  //       this.toastService.showError(resp.errorMessage+'!');
  //   })

  // }


  // delete_schedule()
  // {
  //   this.loader.show()
  //   if(this.botid!="" && this.botid!=undefined)
  //   {
  //     let list=this.schedule_list.filter(data=>data.checked==true);
  //     this.rest.stop_schedule(list).subscribe((response:any)=>{
  //       this.loader.hide();
  //       if(response.errorMessage==undefined){
  //       this.toastService.showSuccess(this.toastMessages.scheduleDelete, 'response')
  //         this.get_schedule();
  //       } else{
  //         this.toastService.showError(response.errorMessage+'!');
  //       }
  //     },err=>{
  //       this.loader.hide()
  //       this.toastService.showError(this.toastMessages.deleteError);

        
  //     })
  //     // this.updateflags();
  //   }
  // }



  
  // async saveschedule()
  // {
  //   if(this.botid !=undefined && this.botid != "" && this.botid!="not_saved")
  //   {
  //     if(this.schedule_list.length==0)
  //     {
  //       this.botdata.botMainSchedulerEntity=null;
  //     }
  //     else
  //     {
  //       let schedules:any=[]
  //       this.schedule_list.forEach(data=>{
  //         if(data.save_status=="unsaved")
  //         {
  //           delete data.intervalId
  //           schedules.push(data);
  //         }
  //         else if(data.save_status=="saved")
  //         {
  //           schedules.push(data)
  //         }
  //       })
  //       if(this.botdata.botMainSchedulerEntity==null)
  //       {
  //         this.botdata.botMainSchedulerEntity={"scheduleIntervals":schedules};
  //       }
  //       else if(schedules.length==0)
  //       {
  //         this.botdata.botMainSchedulerEntity=null;
  //       }
  //     }
  //     await (await this.rest.updateBot(this.botdata)).subscribe(data =>{
  //       let resp:any=data;
  //       if(resp.errorMessage){
  //         this.notifier.notify("error","Failed to save. the scheduler")
  //       }
  //       else if(resp.botMainSchedulerEntity.scheduleIntervals.length==0)
  //       {
  //         this.notifier.notify("success","Updated successfully")
  //       }
  //       else if(resp.botMainSchedulerEntity.scheduleIntervals.length==this.schedule_list.length)
  //       {
        

  //         this.notifier.notify("success", "Schedules saved successfully");
          
  //       }
       
  //       this.get_schedule();
  //     })
  //   }
  //   else
  //   {
  //     let schedules:any=[]
  //       this.schedule_list.forEach(data=>{
  //         if(data.save_status=="unsaved")
  //         {
  //           delete data.intervalId
  //           schedules.push(data);
  //         }
  //       });
  //     this.notifier.notify("success","Schedule configured successfully")
  //     let sch:any={
  //       scheduleIntervals:schedules,
  //     }
  //     //this.actions.saveschedule(sch,this.schedule_list);
  //   }
  // }
  getenvironments()
  {
    this.rest.listEnvironments().subscribe(response=>{
      let resp:any=response
      if(resp.errorCode == undefined)
      {
        this.Environments=response;
      }
    })
  }

  generateid(){
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());

  }





  updateflags()
  {

    let length=this.schedule_list.filter(data=>data.checked==true).length;  
    if(length>0)
    {
      this.flags.deleteflag=true;
      if(length==1)
      {
        let schedule=this.schedule_list.find(data=>data.checked==true)
        if(schedule.botActionStatus!=undefined || schedule.schedularActionStatus!=undefined )
        {
          let status:any;
          if(schedule.schedularActionStatus != undefined)
            status=schedule.schedularActionStatus
          else if(schedule.botActionStatus!=undefined)
            status=schedule.botActionStatus
          if(status=='New')
          {
            this.flags.startflag=true;
            this.flags.pauseflag=false;
            this.flags.resumeflag=false;
            this.flags.stopflag=false;
          }
          else if(status=='Sarted' ||status=='Running' || status=="Resumed"  )
          {
            this.flags.startflag=false;
            this.flags.pauseflag=true;
            this.flags.resumeflag=false;
            this.flags.stopflag=true;
          }
          else if(status=='Paused')
          {
            this.flags.startflag=false;
            this.flags.pauseflag=false;
            this.flags.resumeflag=true;
            this.flags.stopflag=true;
          }
        }
        else
        {
          this.flags.startflag=false;
          this.flags.pauseflag=false;
          this.flags.resumeflag=false;
          this.flags.stopflag=false;
        }
      }
      else
      {
        this.flags.startflag=false;
        this.flags.pauseflag=false;
        this.flags.resumeflag=false;
        this.flags.stopflag=false;
      }
    }
    else
    {

      this.flags.startflag=false;
      this.flags.pauseflag=false;
      this.flags.resumeflag=false;
      this.flags.stopflag=false;
      this.flags.deleteflag=false;
    }

  }
  reset()
  {
    this.selectedEnvironment="";
    this.timezone="";
  }
  
  getAlltimezones(){
    this.rest.getTimeZone().subscribe(res =>{
        this.timesZones=res;
     })
  }

  get compareScheduleDates(){
    let startDate:Date=new Date(this.startdate);
    let endDate:Date=new Date(this.enddate);
    return (startDate > endDate)?true:false;
  }

  get isButtonDisabled() {
    if (this.selectedFrequency === 'onetime') {
      return this.beforetime
    } else {
      return this.beforetime || this.compareScheduleDates
    }
  }

  // Method to check the Cron Expression and display in Update Case
  schedularInfoSetup(scheduleData: any): void {
    const { startDate, endDate, scheduleInterval } = scheduleData;

    const startDateArray = startDate.split(',').map(Number);
    const endDateArray = endDate.split(',').map(Number);
    const startDateObj = new Date(startDateArray[0], startDateArray[1] - 1, startDateArray[2], startDateArray[3], startDateArray[4]);
    const endDateObj = new Date(endDateArray[0], endDateArray[1] - 1, endDateArray[2], endDateArray[3], endDateArray[4]);

    const onetime = startDateObj.getFullYear() === endDateObj.getFullYear() &&
    startDateObj.getMonth() === endDateObj.getMonth() &&
    startDateObj.getDate() === endDateObj.getDate();

    const formattedStartDate = startDateObj.toLocaleDateString('en-CA');
    const formattedEndDate = endDateObj.toLocaleDateString('en-CA');
    const formattedStartTime = startDateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const formattedEndTime = endDateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });


    // One Time
    if (onetime) {
      this.frequency = "onetime";
      this.form.get('frequency').setValue(this.frequency.toLowerCase());
      this.selectedFrequency = "onetime";

      this.startdate = formattedStartDate;
      this.enddate = formattedEndDate;
      this.starttime = formattedStartTime;
      this.endtime = formattedEndTime;
      return;
    }

    // Reccurring
    const recurring = !onetime;

    if (recurring) {
      this.frequency = "Recurring";
      this.form.get('frequency').setValue(this.frequency.toLowerCase());
      this.selectedFrequency = "recurring";
      this.cronExpression=scheduleInterval
    }

    let isMonthly = false;
    let isWeekly = false;
    let isDaily = false;
    let monthRange: string | undefined;
    let days: string[] | undefined;
    

    const cronParts = scheduleInterval.split(' ');

    if (cronParts[2] !== '*' && cronParts[3].includes('-')) {
        isMonthly = true;
        const fromMonth = Number(cronParts[3].split('-')[0]);
        const toMonth = Number(cronParts[3].split('-')[1]);
        monthRange = `${fromMonth} - ${toMonth}`;
    }

    if (cronParts[4] !== '*') {
        isWeekly = true;
        days = cronParts[4].split(',');
    }

    if (cronParts[4] === '*' && cronParts[5] === '*') {
        isDaily = true;
    }

    if (onetime) {
    } else if (isMonthly) {
        this.activeTab = 'monthly'
        this.isMonthly=true
    } else if (isWeekly) {
        this.activeTab = 'weekly'
    } else {
        this.activeTab = 'daily'
        const formattedStartDate = startDateObj.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
        const formattedEndDate = endDateObj.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
    }

    this.startdate = formattedStartDate;
    this.enddate = formattedEndDate;
    this.starttime = formattedStartTime;
    this.endtime = formattedEndTime;
  }

}
