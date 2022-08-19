import {Input, Component, OnInit ,Pipe, PipeTransform } from '@angular/core';
import { CronOptions } from 'src/app/shared/cron-editor/CronOptions';
import {RestApiService} from 'src/app/pages/services/rest-api.service';
import Swal from 'sweetalert2';
import cronstrue from 'cronstrue';
import moment from 'moment';
import { NotifierService } from 'angular-notifier';
import { RpaStudioActionsmenuComponent } from '../rpa-studio-actionsmenu/rpa-studio-actionsmenu.component'
import { first } from 'rxjs/operators';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';

@Component({
  selector: 'app-rpa-scheduler',
  templateUrl: './rpa-scheduler.component.html',
  styleUrls: ['./rpa-scheduler.component.css']
})
export class RpaSchedulerComponent implements OnInit {


  @Input('data') public data: any;
  botid:any;
  processid:any;
  beforetime:boolean=false;
  public Environments:any;
  public timesZones: any = ["UTC","Asia/Dubai","America/New_York","America/Los_Angeles","Asia/Kolkata","Canada/Atlantic","Canada/Central","Canada/Eastern","GMT"];
  //public timesZones: any = [];
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
  startdate:any= new Date();
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
  constructor(private rest:RestApiService, private notifier: NotifierService, private actions:RpaStudioActionsmenuComponent) { }

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
    if(this.data.botid!=undefined && this.data.botid !="not_saved")
    {
      this.botid=this.data.botid;
      this.get_schedule()
      this.getenvironments();

    }else if(this.data.botid=="not_saved")
    {
      this.botid=this.data.botid;
      this.schedule_list=this.data.schedule_list;
    }
    this.enddate=this.startdate;
   this.gettime();

    console.log("todaytime",this.todaytime);

    this.starttime=(new Date).getHours()+":"+(new Date).getMinutes();
    // this.getAlltimezones();
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
  get_schedule()
  {
    this.schedule_list=[];
    if(this.botid!="" && this.botid!=undefined && this.botid!="not_saved")
    {
      this.rest.getbotdata(this.botid).subscribe(data=>{
        let response:any=data;
        this.botdata=data
        if(response.botMainSchedulerEntity!=null)
        {
          this.schedule_list=response.botMainSchedulerEntity.scheduleIntervals;
          this.schedule_list.forEach((sch,index)=>{
            this.schedule_list[index].check=false;
            this.schedule_list[index].save_status="saved";
            this.schedule_list[index].run_status="not_started";
          })
          this.actions.updatesavedschedules(response.botMainSchedulerEntity);
          this.updateflags()
        }
      })
    }
    else if(this.botid=="not_saved")
    {
      this.schedule_list=[];
    }
    let sch:any={
      scheduleIntervals:this.schedule_list
    }
  }

  close()
  {
    document.getElementById("sch").style.display="none";
  }


  onTimeZoneChange(timezone)
  {
    let d:any = new Date(new Date().toLocaleString("en-US", {timeZone: timezone}));
    this.startdate=  d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    this.enddate=this.startdate;
    this.starttime=d.getHours()+":"+d.getMinutes();
  }
  onChangeHour(event,time){ 
 
 this.todaytime=(new Date).getHours()+":"+(new Date).getMinutes();;
 
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
        console.log(e)
        if(e==false ){
          this.aftertime=true;
          this.endtimeerror="end time should not be before than or equal to start time"
        }
        if(beforecurrenttime){
          this.aftertime=true;
          this.endtimeerror="end time should not be before than or equal to currenttime"
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
    this.enddate=this.startdate;
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
  add_sch()
  {
    
    // Scheduler
    if(this.isDateToday(this.selecteddate)){
      this.todaytime=(new Date).getHours()+":"+(new Date).getMinutes();;
      let current_time=this.tConv24(this.todaytime)
      let start_time=this.tConv24(this.starttime)
       let validatecurrenttime=moment(start_time,'h:mma');
       let validatesystemtime=moment(current_time,'h:mma');
       let isbefore=(validatecurrenttime.isBefore(validatesystemtime));
       if(isbefore){
         this.beforetime=true;
         this.starttimeerror="start time should not be before than current time"
       }
       else{
         this.beforetime=false
        this.addscheduler()
       }
       
    }
    else{
      this.addscheduler()
    }
   

   
   
 

  }

  addscheduler(){
    if(this.startdate !="" && this.enddate!=""  && this.cronExpression != "" && this.starttime!=undefined && this.endtime!=undefined && this.timezone!="" && this.timezone!=undefined)
    {
      let starttime=this.starttime.split(":")
      let starttimeparse=parseInt(starttime[0])
       let endtime=this.endtime.split(":")
       let endtimeparse=parseInt(endtime[0]);
        let startdate=this.startdate.split("-");
        let enddate=this.enddate.split("-");
         let data:any;
      if(this.botid!="" && this.botid!=undefined )
      {
        data={
          intervalId:this.generateid(),
          scheduleInterval:this.cronExpression,
          startDate:parseInt(startdate[0])+","+parseInt(startdate[1])+","+parseInt(startdate[2])+","+starttimeparse+","+starttime[1],
          endDate:parseInt(enddate[0])+","+parseInt(enddate[1])+","+parseInt(enddate[2])+","+ endtimeparse+","+ endtime[1],
         
        
          timeZone:this.timezone,
          save_status:"unsaved",
          check:false,
        }
        this.schedule_list.push(data);
      }
    }
    else
    {

      this.notifier.notify("error", "Please fill all inputs");
     
    }
  }

  check_all(event)
  {
    this.schedule_list.forEach((sch,index)=>{
      this.schedule_list[index].check=event.target.checked;
    })
    this.updateflags();
  }


  check_schedule(event,intervalid)
  {
    this.schedule_list.find(data=>data.intervalId==intervalid).check=event.target.checked
    this.updateflags();
  }

  convertcron(cronexp)
  {
    return cronstrue.toString(cronexp);
  }

  start_schedule()
  {
    let checked_schedule=this.schedule_list.find(data=>data.check==true)
    if(this.botid!=undefined && this.botid != "")
    {
      let schedule={
        botId:this.botid,
        "botVersion": checked_schedule.botVersion,
        "scheduleInterval":checked_schedule.scheduleInterval,
        "intervalId":checked_schedule.intervalId,
      }
      this.rest.start_schedule(schedule).subscribe(data=>{
        let resp:any=data;
      
        if(resp.errorMessage==undefined)
        {
         
          this.notifier.notify("success",resp.status)
        
          this.get_schedule();
        }
        else
        {
          this.notifier.notify("error", resp.errorMessage);
         
        }

      })
    }
  }

  pause_schedule()
  {
    let checked_schedule=this.schedule_list.find(data=>data.check==true)
    if(this.botid!="" && this.botid!=undefined)
    {
      let schedule={
        botId:this.botid,
        "botVersion": checked_schedule.botVersion,
        "scheduleInterval":checked_schedule.scheduleInterval,
        "intervalId":checked_schedule.intervalId,
      }
      this.rest.pause_schedule(schedule).subscribe(data=>{
        let resp:any=data
        if(resp.errorMessage==undefined)
        {
          this.notifier.notify("success",resp.status)
        
          this.get_schedule();
        }
        else
        {
        
          this.notifier.notify("error",resp.errorMessage)
        }
      })
    }
  }

  resume_schedule()
  {
    let checked_schedule=this.schedule_list.find(data=>data.check==true)
    let schedule={
      botId:this.botid,
      "botVersion": checked_schedule.botVersion,
      "scheduleInterval":checked_schedule.scheduleInterval,
      "intervalId":checked_schedule.intervalId,
    }
    this.rest.resume_schedule(schedule).subscribe(data=>{
      let resp:any=data
      if(resp.errorMessage==undefined)
      {
        this.notifier.notify("success", resp.status);
        this.get_schedule();
      }
      else
      {
        this.notifier.notify("error", resp.errorMessage);
      }
    })

  }


  delete_schedule()
  {
    if(this.botid!="" && this.botid!=undefined)
    {
      let list=this.schedule_list.filter(data=>data.check==true);
      list.forEach(data=>{
        let index2=this.schedule_list.findIndex(scheduleitem=>scheduleitem.intervalId==data.intervalId);
        this.schedule_list.splice(index2,1);
      })
      this.updateflags();
      this.notifier.notify("success", "Schedules Deleted Sucessfully");
    }
  }



  
  async saveschedule()
  {
    if(this.botid !=undefined && this.botid != "" && this.botid!="not_saved")
    {
      if(this.schedule_list.length==0)
      {
        this.botdata.botMainSchedulerEntity=null;
      }
      else
      {
        let schedules:any=[]
        this.schedule_list.forEach(data=>{
          if(data.save_status=="unsaved")
          {
            delete data.intervalId
            schedules.push(data);
          }
          else if(data.save_status=="saved")
          {
            schedules.push(data)
          }
        })
        if(this.botdata.botMainSchedulerEntity==null)
        {
          this.botdata.botMainSchedulerEntity={"scheduleIntervals":schedules};
        }
        else if(schedules.length==0)
        {
          this.botdata.botMainSchedulerEntity=null;
        }
      }
      await (await this.rest.updateBot(this.botdata)).subscribe(data =>{
        let resp:any=data;
        if(resp.errorMessage){
          this.notifier.notify("error","Failed to save the scheduler")
        }
        else if(resp.botMainSchedulerEntity.scheduleIntervals.length==0)
        {
          this.notifier.notify("success","Updated successfully")
        }
        else if(resp.botMainSchedulerEntity.scheduleIntervals.length==this.schedule_list.length)
        {
        

          this.notifier.notify("success", "Schedules saved successfully");
          
        }
       
        this.get_schedule();
      })
    }
    else
    {
      let schedules:any=[]
        this.schedule_list.forEach(data=>{
          if(data.save_status=="unsaved")
          {
            delete data.intervalId
            schedules.push(data);
          }
        });
      this.notifier.notify("success","Schedule configured successfully")
      let sch:any={
        scheduleIntervals:schedules,
      }
      this.actions.saveschedule(sch,this.schedule_list);
    }
  }
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

  generateid()
  {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());

  }





  updateflags()
  {
    let length=this.schedule_list.filter(data=>data.check==true).length;
    if(length>0)
    {
      this.flags.deleteflag=true;
      if(length==1)
      {
        let schedule=this.schedule_list.find(data=>data.check==true)
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
  

}



@Pipe({name: 'Envname'})
export class EnvnameRpa implements PipeTransform {
  transform(value: any,arg:any)
  {
    let environments:any=[];
    environments=arg;
    return environments.find(item=>item.environmentId==value).environmentName;
  }
}

@Pipe({name: 'Reverse'})
export class ReverseRpa implements PipeTransform {
  transform(value: any)
  {
    let arr:any=[];
    arr=value
    return arr.reverse();
  }
}
