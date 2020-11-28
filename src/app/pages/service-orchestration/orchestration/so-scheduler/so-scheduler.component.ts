import {Input, Component, OnInit } from '@angular/core';
import { CronOptions } from 'src/app/shared/cron-editor/CronOptions';
import {RestApiService} from 'src/app/pages/services/rest-api.service';
import Swal from 'sweetalert2';
import cronstrue from 'cronstrue';
@Component({
  selector: 'app-so-scheduler',
  templateUrl: './so-scheduler.component.html',
  styleUrls: ['./so-scheduler.component.css']
})
export class SoSchedulerComponent implements OnInit {

  @Input('botid') public botid: any;
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

  cronExpression = '0/1 * 1/1 * *';
  isCronDisabled = false;
  picker1;
  picker2;
  starttime:any="00:00";
  endtime:any="23:59";
  schedules:any=[];
  startdate:any= new Date();
  enddate:any;
  timezone:any;
  schedule_list:any=[];
  botdata:any;

  flags={
    startflag:false,
    stopflag:false,
    pauseflag:false,
    resumeflag:false,
    deleteflag:false,
  }
  constructor(private rest:RestApiService) { }

  ngOnInit() {

    this.get_schedule()
    this.enddate=this.startdate;
  }

  get_schedule()
  {
    this.schedule_list=[];
    if(this.botid!=""|| this.botid!=undefined)
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
  }

  close()
  {
    document.getElementById("sch").style.display="none";
  }




  add_sch()
  {
    if(this.startdate !="" && this.enddate!=""  && this.cronExpression != "" && this.starttime!=undefined && this.endtime!=undefined && this.timezone!="" && this.timezone!=undefined)
    {
      let starttime=this.starttime.split(":")
      let endtime=this.endtime.split(":")
      let data={
        intervalId:this.generateid,
        scheduleInterval:this.cronExpression,
        startDate:this.startdate.getFullYear()+","+(this.startdate.getMonth()+1)+","+this.startdate.getDate()+","+starttime[0]+","+starttime[1],
        endDate:this.enddate.getDate()+","+(this.enddate.getMonth()+1)+","+this.enddate.getFullYear()+","+ endtime[0]+","+ endtime[1],
        timeZone:this.timezone,
        save_status:"unsaved",
        check:false,
      }
      this.schedule_list.push(data);
    }
    else
    {
      Swal.fire("Please fill all details","","warning");
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
    let schedule={
      botId:this.botid,
      "scheduleInterval":checked_schedule.scheduleInterval,
      "intervalId":checked_schedule.intervalId,
    }
    this.rest.start_schedule(schedule).subscribe(data=>{
      let resp:any=data
      if(resp.errorMessage!=undefined)
      {
        Swal.fire(resp.errorMessage,"","warning");
      }
      else
      {
        Swal.fire(resp.status,"","success")
        this.schedule_list.find(data=>data.check==true).run_status="started";
        this.updateflags();
      }

    })
  }

  pause_schedule()
  {
    let checked_schedule=this.schedule_list.find(data=>data.check==true)
    let schedule={
      botId:this.botid,
      "scheduleInterval":checked_schedule.scheduleInterval,
      "intervalId":checked_schedule.intervalId,
    }
    this.rest.pause_schedule(schedule).subscribe(data=>{
      let resp:any=data
      if(resp.errorMessage!=undefined)
      {
        Swal.fire(resp.errorMessage,"","warning");
      }
      else
      {
        Swal.fire(resp.status,"","success")
        this.schedule_list.find(data=>data.check==true).run_status="pause";
        this.updateflags();
      }
    })

  }

  resume_schedule()
  {
    let checked_schedule=this.schedule_list.find(data=>data.check==true)
    let schedule={
      botId:this.botid,
      "scheduleInterval":checked_schedule.scheduleInterval,
      "intervalId":checked_schedule.intervalId,
    }
    this.rest.resume_schedule(schedule).subscribe(data=>{
      let resp:any=data
      if(resp.errorMessage!=undefined)
      {
        Swal.fire(resp.errorMessage,"","warning");
      }
      else
      {
        Swal.fire(resp.status,"","success")
        this.schedule_list.find(data=>data.check==true).run_status="resume";
        this.updateflags();
      }
    })

  }

  stop_schedule()
  {
    let checked_schedule=this.schedule_list.find(data=>data.check==true)
    let schedule={
      botId:this.botid,
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

  delete_schedule()
  {
    let list=this.schedule_list.filter(data=>data.check==true);
    list.forEach(data=>{
      let index2=this.schedule_list.findIndex(scheduleitem=>scheduleitem.intervalId==data.intervalId);
      this.schedule_list.splice(index2,1);
    })

  }



  async saveschedule()
  {
    if(this.schedule_list.length==0)
    {
      this.botdata.botMainSchedulerEntity=null;
    }
    else
    {
      if(this.botdata.botMainSchedulerEntity==null)
      {
        this.botdata.botMainSchedulerEntity={"scheduleIntervals":this.schedule_list};
      }
      else
      {
        this.botdata.botMainSchedulerEntity.scheduleIntervals=this.schedule_list;
      }
    }

    await (await this.rest.updateBot(this.botdata)).subscribe(data =>{
      let resp:any=data;
      if(resp.botMainSchedulerEntity.scheduleIntervals.length==0){
        Swal.fire("Updated successfully","","success")
      }
      else if(resp.botMainSchedulerEntity.scheduleIntervals.length==this.schedule_list.length){
        Swal.fire("Schedules saved successfully","","success");
      }

      this.get_schedule();
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
        if(schedule.run_status!=undefined)
        {
          if(schedule.run_status=='not_started')
          {

            this.flags.startflag=true;
            this.flags.pauseflag=false;
            this.flags.resumeflag=false;
            this.flags.stopflag=false;
          }
          else if(schedule.run_status=='started' ||schedule.run_status=='resume' )
          {
            this.flags.startflag=false;
            this.flags.pauseflag=true;
            this.flags.resumeflag=false;
            this.flags.stopflag=true;
          }
          else if(schedule.run_status=='pause')
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


}
