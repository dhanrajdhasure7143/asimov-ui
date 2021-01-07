import {Input,ViewChild,Output,EventEmitter, Component, OnInit } from '@angular/core';
import { RpaStudioDesignerworkspaceComponent } from '../rpa-studio-designerworkspace/rpa-studio-designerworkspace.component';
import { RestApiService } from '../../services/rest-api.service';
import { FormBuilder } from '@angular/forms';
import {  HttpClient } from '@angular/common/http';
import { RpaStudioDesignerComponent } from '../rpa-studio-designer/rpa-studio-designer.component'
import Swal from 'sweetalert2';
import { RpaStudioComponent } from '../rpa-studio/rpa-studio.component';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NotifierService } from 'angular-notifier';
import {NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-rpa-studio-actionsmenu',
  templateUrl: './rpa-studio-actionsmenu.component.html',
  styleUrls: ['./rpa-studio-actionsmenu.component.css']
})
export class RpaStudioActionsmenuComponent implements OnInit {

  @Input('bot') public botState: any;
  @Input('toolset') public toolset: any;
  public check_schedule_flag: boolean = false;
  public environment: any = [];
  public predefined: any = [];
  public optionList: boolean = true;
  public optionPredefinedbotList: boolean = false;
  public environmentValue: any = [];
  public predefinedbotValue: any = [];
  public selectedEnvironments: any = []
  public versionsList: any = [];
  public schedule_list:any=[];
  public schedule_list_scheduler:any=[];
  public schpop:Boolean=false;
  public schedule:any;
  public startbot:Boolean;
  public pausebot:Boolean;
  public resumebot:Boolean;
  public savebotrespose:any;
  public selectedenv:any=[];
  public finalenv:any=[];
  public envflag:Boolean=false;
  public schedulepopid="";
  public logflag:Boolean;
  public runid:any;
  public viewlog:Boolean;
  public botid:any;
  public botverid:any;
  public resplogbyrun:any;
  public selectedversion:any;
  public logresponse:any=[];
  displayedColumns: string[] = ['run_id','version','start_date','end_date', "bot_status"];
  Viewloglist:MatTableDataSource<any>;
  displayedColumns1: string[] = ['task_name', 'status','start_date','end_date','error_info' ];
  logbyrunid:MatTableDataSource<any>;

  @ViewChild("paginator1",{static:false}) paginator1: MatPaginator;
  @ViewChild("paginator2",{static:false}) paginator2: MatPaginator;
  @ViewChild("sort1",{static:false}) sort1: MatSort;
  @ViewChild("sort2",{static:false}) sort2: MatSort;
  @Output() closeTabEvent = new EventEmitter<void>();
  @ViewChild('t', { static: false }) ngbTabset;
  @Input('tabsArray') public tabsArray: any[];
  @ViewChild(RpaStudioDesignerworkspaceComponent, { static: false }) childBotWorkspace: RpaStudioDesignerworkspaceComponent;
  pause: any;
  resume: any;
  stop: any;
  checked: boolean;
  listEnvironmentData: any = [];
  dropdownList: any = [];
  predefinedList: any = [];
  selectedDropdown: any = [];
  predefineddropdown: any = [];
  predefinedbotsData:any =[];
  deploymachinedata:any;
  public viewlogid:any;
  public viewlogid1:any;
  public respdata1:boolean = false;
  public respdata2:boolean = false;
  public she:any;
  userRole;
  isButtonVisible: boolean;
  slider: number = 0;
  options: any = {
    floor: -8,
    ceil: 8,
    vertical: true
  };
  constructor(private fb : FormBuilder,private rest : RestApiService, private http:HttpClient,
    private rpa_tabs:RpaStudioDesignerComponent, private rpa_studio:RpaStudioComponent,
    private notifier: NotifierService, private calender:NgbCalendar,
    ) {}

  ngOnInit() {
    this.userRole = localStorage.getItem("userRole")
    this.userRole = this.userRole.split(',');
    this.isButtonVisible = this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('RPA Admin');
    this.startbot=false;
    this.pausebot=false;
    this.resumebot=false;
    this.logflag=false;
    this.getEnvironmentlist();
    this.getpredefinedbotlist();
    this.viewlogid="viewlog-"+this.botState.botName;
    if(this.botState.botId!=undefined)
    {
      this.selectedversion=this.botState.version;
      this.savebotrespose=this.botState;
      this.getVersionlist();
    }

  }



  // deploybot() {

  //   this.rest.deployremotemachine(this.savebotrespose.botId).subscribe(data => {
  //     this.deploymachinedata = data;
  //     Swal.fire({
  //       position: 'top-end',
  //       icon: 'success',
  //       title:this.deploymachinedata.status,
  //       showConfirmButton: false,
  //       timer: 2000
  //     })

  //   })

  // }


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
                Swal.fire(response.status,"","success");
              else
                Swal.fire(response.errorMessage,"","error")
          })
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
        Swal.fire("Please check connections","","warning");
      }
      else
      {
        checkbotres.subscribe(data=>{
        this.savebotrespose=data;
        this.rpa_studio.spinner.hide();
        if(this.savebotrespose.botId!=undefined)
        {
          Swal.fire("Bot saved successfully !!","","success");
          this.startbot=true;
          this.pausebot=false;
          this.resumebot=false;
          this.childBotWorkspace.disable=true;
          let bottask:any=this.botState;
          this.getVersionlist();
          this.childBotWorkspace.uploadfile(this.finalenv);
          if(bottask.taskId!=0)
          {
            this.rpa_assignbot(this.savebotrespose.botId, bottask.taskId);
          }
        }
        else
        {
          Swal.fire("Bot failed to save","","error");
          this.childBotWorkspace.disable=false;
        }
      });
      }
    }
    else
    {
       let checkbot:any=await this.childBotWorkspace.updateBotFun(this.savebotrespose,this.finalenv)
       if(checkbot==false)
       {
        this.rpa_studio.spinner.hide();
        Swal.fire("Please check connections","","warning");
       }else
       {
         await checkbot.subscribe(data=>{
          let response:any=data
          if(response.errorMessage== undefined)
          {
            //this.childBotWorkspace.successCallBack(data);
            this.savebotrespose=data;
            this.rpa_studio.spinner.hide();
            this.getVersionlist();
            Swal.fire("Bot updated successfully","","success")
            this.childBotWorkspace.uploadfile(this.finalenv);
          }
          else
          {
            this.rpa_studio.spinner.hide();
            Swal.fire(response.errorMessage,"","warning");
          }
        });
      }
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
          this.startbot=false;
          this.pausebot=true;
          this.resumebot=false;
          Swal.fire(response.status,"","success")
        }else
        {
          Swal.fire(response.errorMessage,"","success");
        }
      })
    }
  }

  pauseBot()
  {
    if(this.savebotrespose!=undefined)
    {
      this.rest.getUserPause(this.savebotrespose.botId).subscribe(data => {
        let response:any = data;
        if(response.status!=undefined)
        {
          this.pausebot=false;
          this.startbot=false;
          this.resumebot=true;
          Swal.fire(response.status,"","success")
        }else
        {
          Swal.fire(response.errorMessage,"","warning");
        }
      });
    }
  }

  resumeBot() {
    if(this.savebotrespose!=undefined)
    {
      this.rest.getUserResume(this.savebotrespose.botId).subscribe(data => {
        let response:any = data;
        if(response.status!=undefined)
        {
          this.pausebot=true;
          this.startbot=false;
          this.resumebot=false;
          Swal.fire(response.status,"","success");
        }
      })
    }
  }

  stopBot() {
    if(this.savebotrespose!=undefined)
    {
        let data:any=""
        this.rest.stopbot(this.savebotrespose.botId,data).subscribe(res=>{
          let response:any=res;
          if(response.status!=undefined)
          {
            this.startbot=true;
            this.pausebot=false;
            this.resumebot=false;
            Swal.fire(response.status,"","success");
          }
          else
          {
            Swal.fire(response.errorMessage,"","warning");
          }
        })
    }
  }


  getEnvironmentlist() {
    this.rest.listEnvironments().subscribe(data => {
      let response:any=data
      if(response.errorMessaage==undefined)
      {
        let environments:any=[];
        environments=response;
        if(environments.length!=0)
        {
          this.environment=response.map((item)=>{
            item["checked"]=false;
            return item;
          })
          if(this.botState.botId!=undefined)
             this.botState.envIds.forEach(envdata=>{
                this.environment.find(data=>data.environmentId==envdata).checked=true;
              })
          let length:any=this.environment.filter(data=>data.checked==true).length
          if(length>0)
          {
            this.envflag=true;
          }
          else
          {
            this.envflag=false;
          }
        }
      }
      else
      {
        Swal.fire(response.errorMessage,"","error");
      }
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
    let length:any=this.environment.filter(data=>data.checked==true).length
    if(length>0)
    {
      this.envflag=true;
    }else
    {
      this.envflag=false;
    }
  }

  modify(){
    this.childBotWorkspace.modifyEnableDisable();
  }

  getVersionlist() {
    this.rest.getBotVersion(this.savebotrespose.botId).subscribe(data => {
      this.versionsList=data;
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
      this.rest.getbotversiondata(this.savebotrespose.botId,vid).subscribe(data =>{
        response=data;
        let index=this.rpa_studio.tabsArray.findIndex(data=>data.botName==response.botName);
        this.rpa_studio.tabsArray[index]=response;
        this.rpa_studio.spinner.hide();
      })
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
     log.sort((a,b) => a.run_id > b.run_id ? -1 : 1);
     this.Viewloglist = new MatTableDataSource(log);
     console.log(this.Viewloglist);

     this.Viewloglist.paginator=this.paginator1;
     this.Viewloglist.sort=this.sort1;

     document.getElementById(this.viewlogid).style.display="block";

   });
 }


 public botrunid:any;
 ViewlogByrunid(runid){
   this.botrunid=runid
   console.log(this.botrunid);
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
     resplogbyrun.sort((a,b) => a.task_id > b.task_id ? 1 : -1);
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



  rpa_assignbot(botId,taskId)
  {
    this.rest.assign_bot_and_task(botId,taskId, "Automated").subscribe(data=>{
      let response:any=data;
      if(response.status!=undefined)
      {
        this.notifier.notify("info",response.status);
      }
    });
  }



 openschedule()
  {
    if(this.savebotrespose==undefined)
    {

      this.schedule={
        botid:"not_saved",
        schedule_list:this.schedule_list_scheduler,
      }
    }
    else
    {
      this.schedule={
        botid:this.savebotrespose.botId
      }

    }
    this.schpop=true;
  }

  closesch()
  {
    this.schpop=false;
  }


  saveschedule(schedule,schedule_list)
  {
    //this.scheduleLists=schedule;
    this.schedule_list_scheduler=schedule_list;
    this.childBotWorkspace.saveCron(schedule);
  }


  updatesavedschedules(schedules)
  {
    this.childBotWorkspace.saveCron(schedules)
  }

  displayenv()
  {
    document.getElementById("environemts").style.display="block";
  }


  public tempslider:any=0
  sliderEvent()
  {
    if(this.tempslider>this.slider)
    {
      for(let i=this.slider;i<=this.tempslider;i++)
      {

        this.childBotWorkspace.zoomout("");
      }
      this.tempslider=this.slider;
    }


    if(this.tempslider<this.slider)
    {
      for(let i=this.tempslider;i<=this.slider;i++)
      {
        this.childBotWorkspace.zoomin("");
      }
      this.tempslider=this.slider;
    }

  }


}



