import {Input, Component, OnInit ,Pipe, PipeTransform } from '@angular/core';
import { CronOptions } from 'src/app/shared/cron-editor/CronOptions';
import {RestApiService} from 'src/app/pages/services/rest-api.service';
import Swal from 'sweetalert2';
import { NotifierService } from 'angular-notifier';
import cronstrue from 'cronstrue';
@Component({
  selector: 'app-so-scheduler',
  templateUrl: './so-scheduler.component.html',
  styleUrls: ['./so-scheduler.component.css']
})
export class SoSchedulerComponent implements OnInit {

  @Input('data') public data: any;
  botid:any;
  processid:any;
  public Environments:any;
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
  CronOptions:any;
  processName:any;
  cronExpression = '0/1 * 1/1 * *';
  isCronDisabled = false;
  picker1;
  picker2;
  starttime:any="00:00";
  endtime:any="23:59";
  schedules:any=[];
  startdate:any= new Date();
  enddate:any;
  timezone:any="";
  schedule_list:any=[];
  botdata:any;
  selectedEnvironment:any="";
  environmentid:any;
  deletestack:any=[];
  flags={
    startflag:false,
    stopflag:false,
    pauseflag:false,
    resumeflag:false,
    deleteflag:false,
  }
  q=0;
  constructor(private rest:RestApiService, private notifier: NotifierService) { }

  ngOnInit() {
    if(this.data.processid!=undefined)
    {
      this.processid=this.data.processid
      this.environmentid=this.data.environment
      this.processName=this.data.processName
    }
    else if(this.data.botid!=undefined)
    {
      this.botid=this.data.botid;
    }
    this.get_schedule()
    this.getenvironments();
    this.enddate=this.startdate;
    this.timezone=""
    this.starttime=(new Date).getHours()+":"+(new Date).getMinutes();
  }

  get_schedule()
  {
    this.schedule_list=[];
    // for bot
    if(this.botid!="" && this.botid!=undefined)
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
        }
      })
    }
    //for process
    else if(this.processid!='' && this.processid!=undefined)
    {
      this.rest.getprocessschedule(this.processid).subscribe(resp=>{
        this.schedule_list=resp;
        this.schedule_list.forEach((sch,index)=>{
          this.schedule_list[index].intervalId=this.generateid();
          this.schedule_list[index].check=false;
          this.schedule_list[index].save_status="saved";
          this.schedule_list[index].run_status="not_started";
        })
      })
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



  add_sch()
  {
    // Scheduler
    if(this.startdate !="" && this.enddate!=""  && this.cronExpression != "" && this.starttime!=undefined && this.endtime!=undefined && this.timezone!="" && this.timezone!=undefined)
    {
      let starttime=this.starttime.split(":")
     let starttimeparse=parseInt(starttime[0])
      let endtime=this.endtime.split(":")
      let endtimeparse=parseInt(endtime[0]);
       let startdate=this.startdate.split("-");
       let enddate=this.enddate.split("-");
        let data:any;
      // console.log("-----------------check------------",this.startdate);
      // console.log("----------------check-----------------",this.enddate);
      // this.startdate= new Date(Date.parse(this.startdate));
      // this.enddate=new Date(Date.parse(this.enddate));
      // console.log("-----------------check------------",this.startdate);
      // console.log("----------------check-----------------",this.enddate);
      if(this.botid!="" && this.botid!=undefined)
      {
        data={
          intervalId:this.generateid(),
          scheduleInterval:this.cronExpression,
          startDate:parseInt(startdate[0])+","+parseInt(startdate[1])+","+parseInt(startdate[2])+","+starttimeparse+","+starttime[1],
          endDate:parseInt(enddate[0])+","+parseInt(enddate[1])+","+parseInt(enddate[2])+","+ endtimeparse+","+ endtime[1],
          // startDate:this.startdate.getFullYear()+","+(this.startdate.getMonth()+1)+","+this.startdate.getDate()+","+starttime[0]+","+starttime[1],
          // endDate:this.enddate.getFullYear()+","+(this.enddate.getMonth()+1)+","+this.enddate.getDate()+","+ endtime[0]+","+ endtime[1],
        
          timeZone:this.timezone,
          save_status:"unsaved",
          check:false,
        }
        this.schedule_list.push(data);
      }
      // Process
      else if(this.processid!='' && this.processid!=undefined)
      {
        if(this.selectedEnvironment!="" && this.selectedEnvironment !=  undefined)
        {
          data={
            intervalId:this.generateid(),
            scheduleInterval:this.cronExpression,
            startDate:parseInt(startdate[0])+","+parseInt(startdate[1])+","+parseInt(startdate[2])+","+starttimeparse+","+starttime[1],
            endDate:parseInt(enddate[0])+","+parseInt(enddate[1])+","+parseInt(enddate[2])+","+ endtimeparse+","+ endtime[1],  
            // startDate:this.startdate.getFullYear()+","+(this.startdate.getMonth()+1)+","+this.startdate.getDate()+","+starttime[0]+","+starttime[1],
            // endDate:this.enddate.getFullYear()+","+(this.enddate.getMonth()+1)+","+this.enddate.getDate()+","+ endtime[0]+","+ endtime[1],
            timezone:this.timezone,
            save_status:"unsaved",
            processId:this.processid,
            processName:this.processName,
            envId:this.selectedEnvironment,
            check:false,
          }
          this.schedule_list.push(data);
        }
        else
        {
          
          this.notifier.notify("error","Please give all inputs")
          //Swal.fire("Please give all inputs","","warning")
        }
      }
    }
    else
    {
      //Swal.fire("Please fill all details","","warning");
      
      this.notifier.notify("error","Please give all inputs")
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
      console.log("schedule",schedule)
      this.rest.start_schedule(schedule).subscribe(data=>{
        let resp:any=data
        if(resp.errorMessage!=undefined)
        {
          //(resp.errorMessage,"","warning");
        
          this.notifier.notify("error",resp.errorMessage)
        }
        else
        {
         // Swal.fire(resp.status,"","success")
          
          this.notifier.notify("success",resp.status)
          //this.schedule_list.find(data=>data.check==true).run_status="started";
          this.get_schedule();
          this.updateflags();
        }

      })
    }
    else if(this.processid!="" && this.processid != undefined)
    {
      let schedule:any=[];
      schedule.push(checked_schedule);
      this.rest.startprocessschedule(schedule).subscribe(data=>{
        let response:any=data;
        if(response.errorMessage==undefined)
        {

        
          //Swal.fire("Process started sucessfully","","success");
          
          this.notifier.notify("success",response.status)
          // this.schedule_list.find(data=>data.check==true).run_status="started";
          this.get_schedule();
          this.updateflags();
        }
        else
        {  
          this.notifier.notify("error",response.errorMessage)
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
        if(resp.errorMessage!=undefined)
        {
          
          this.notifier.notify("error",resp.errorMessage)
          //Swal.fire(resp.errorMessage,"","warning");
        }
        else
        {
          this.notifier.notify("success",resp.status)
          this.get_schedule();
          //this.schedule_list.find(data=>data.check==true).run_status="pause";
          this.updateflags();
        }
      })
    }
    else if(this.processid!=undefined && this.processid!="")
    {
      this.rest.pauseprocessschedule([checked_schedule]).subscribe(resp=>{
        let response:any=resp;
        //Swal.fire(response[0][checked_schedule.scheduleprocessid],"","success")
        //this.schedule_list.find(data=>data.check==true).run_status="pause";
        if(response.errorMessage==undefined)
        {
          this.notifier.notify("success",response.status)
          this.get_schedule();
          this.updateflags();
        }
        else
        {
          this.notifier.notify("error",response.errorMessage)
        }
      })
    }

  }

  resume_schedule()
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
      this.rest.resume_schedule(schedule).subscribe(data=>{
        let resp:any=data
        if(resp.errorMessage!=undefined)
        {
          //Swal.fire(resp.errorMessage,"","warning");
          this.notifier.notify("error",resp.errorMessage)
        }
        else
        {
          this.notifier.notify("success",resp.status)
          this.get_schedule();
          this.updateflags();
        }
      })
    }
    else if(this.processid!=undefined && this.processid!="")
    {
      this.rest.resumeprocessschedule([checked_schedule]).subscribe(data=>{
        let resp:any=data;
        if(resp.errorMessage!=undefined)
        {
          this.notifier.notify("error",resp.errorMessage)
        } 
        else
        {
          //Swal.fire(resp.status,"","success")
          this.notifier.notify("success",resp.status)
          this.get_schedule();
          this.updateflags();
        }
      })


    }

  }

  stop_schedule()
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
      this.rest.stop_schedule(schedule).subscribe(data=>{
        let resp:any=data
        if(resp.errorMessage!=undefined)
        {
          Swal.fire(resp.errorMessage,"","warning");
          
        }
        else
        {
          Swal.fire(resp.status,"","success")
          this.schedule_list.find(data=>data.check==true).run_status="not_started";
          this.updateflags();
        }
      })
    }
    else if(this.processid!="" && this.processid != undefined)
    {
        this.rest.stopprocessschedule(checked_schedule).subscribe(data=>{})
    }
  }

  async delete_schedule()
  {
    if(this.botid!="" && this.botid!=undefined)
    {
      let list=this.schedule_list.filter(data=>data.check==true);
      
      let saved_schedules:any=this.schedule_list.filter(data=>data.check==true && data.save_status=="saved");
      let unsaved_schedules:any=this.schedule_list.filter(data=>data.check==true && data.save_status=="unsaved")
      list.forEach(data=>{
        let index2=this.schedule_list.findIndex(scheduleitem=>scheduleitem.intervalId==data.intervalId);
        this.schedule_list.splice(index2,1);
      });
      if(saved_schedules.length>0)
      {
        let schedules:any=[]
        schedules=this.schedule_list.filter(item=>item.save_status=="saved");
        
        if(this.botdata.botMainSchedulerEntity==null)
          this.botdata.botMainSchedulerEntity={"scheduleIntervals":schedules};
        else
          this.botdata.botMainSchedulerEntity.scheduleIntervals=schedules;
        (await this.rest.updateBot(this.botdata)).subscribe(res=>{
          let response:any=res
          if(response.errorMessage==undefined)
          {
            this.notifier.notify("success","Schedule deleted successfully")
          }
          else
            this.notifier.notify("error","Schedule not deleted successfully")
        })
      }else if(unsaved_schedules.length>0)
      {
          this.notifier.notify("success","Schedule deleted successfully") 
      }
      else if(saved_schedules.length==0 && unsaved_schedules.length==0)
      {
        this.botdata.botMainSchedulerEntity=null;
        (await this.rest.updateBot(this.botdata)).subscribe(res=>{
          let response:any=res
          if(response.errorMessage==undefined)
          {
            this.notifier.notify("success","Schedule deleted successfully")
          }
          else
            this.notifier.notify("error","Schedule not deleted successfully")
        })
      }
      else
      {
        this.notifier.notify("error","No schedule selected to delete");
      }
    }
    else if(this.processid!="" && this.processid != undefined)
    {
      let list=this.schedule_list.filter(data=>data.check==true);
      list.forEach(data=>{
        let index2=this.schedule_list.findIndex(scheduleitem=>scheduleitem.intervalId==data.intervalId);
        let del_sch=this.schedule_list.find(scheduleitem=>scheduleitem.intervalId==data.intervalId);
        if(del_sch.save_status=="saved")
          this.deletestack.push(del_sch); 
        this.schedule_list.splice(index2,1);
      })
      if(this.deletestack.lenght!=0)
      {
        this.rest.deleteprocessschedule(this.deletestack).subscribe(data=>{
          let response:any=data;
          if(response.errorMessage==undefined)
          {
            this.notifier.notify("success","Schedules deleted sucessfully");
            this.deletestack=[];
            this.updateflags();
          }else{
            this.notifier.notify("error","Unable to delete shcedule")
          }
          
        })
      }else
      {
        this.notifier.notify("success","Schedule deleted successfully")
      }
    }

  }



  async saveschedule()
  {
    if(this.botid !=undefined && this.botid != "")
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
        else
        {
          this.botdata.botMainSchedulerEntity.scheduleIntervals=schedules;
        }
      }
      await (await this.rest.updateBot(this.botdata)).subscribe(data =>{
          let resp:any=data;
          if(resp.errorMessage==undefined)
          {
            this.notifier.notify("success","Schedule added successfully")

            /*if(resp.botMainSchedulerEntity==null){
            }
            else if(resp.botMainSchedulerEntity.scheduleIntervals.length==this.schedule_list.length){
              Swal.fire("Schedules saved successfully","","success");
            }*/
            this.get_schedule();
            this.updateflags();

          }
          else
          {
            
            this.notifier.notify("error","Schedule failed to add")
          }
         
    })
    }
    else if(this.processid!=undefined && this.processid!="")
    {
      let save_schedule_list:any=[];
      save_schedule_list=this.schedule_list.filter(item=>item.save_status=='unsaved')
      if(save_schedule_list.length!=0)
      this.rest.saveprocessschedule(save_schedule_list).subscribe(data=>{
        let resp:any=data
        if(resp.errorMessage==undefined)
        {
          this.notifier.notify("success",resp.response);
          this.get_schedule();
          this.updateflags();
        }
        else
        {
          this.notifier.notify("error",resp.errorMessage);
        }
      })
      // if(this.deletestack.length!=0)
      // {
      //   this.rest.deleteprocessschedule(this.deletestack).subscribe(data=>{
      //     this.notifier.notify("success","Schedules deleted sucessfully");
      //     this.updateflags();
      //   })
      // }
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
          else if(status=='Started' ||status=='Running' || status=="Resumed"   )
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
export class Envname implements PipeTransform {
  transform(value: any,arg:any)
  {
    let environments:any=[];
    environments=arg;
    return environments.find(item=>item.environmentId==value).environmentName;
  }
}



@Pipe({name: 'Reverse'})
export class Reverse implements PipeTransform {
  transform(value: any)
  {
    let arr:any=[];
    arr=value
    return arr.reverse();
  }
}
