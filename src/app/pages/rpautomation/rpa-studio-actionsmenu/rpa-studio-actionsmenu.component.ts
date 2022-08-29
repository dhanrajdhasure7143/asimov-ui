import {Input,ViewChild,Output,EventEmitter, Component, OnInit,  ChangeDetectorRef,AfterContentChecked,  OnChanges, SimpleChanges } from '@angular/core';
import { RpaStudioDesignerworkspaceComponent } from '../rpa-studio-designerworkspace/rpa-studio-designerworkspace.component';
import { RestApiService } from '../../services/rest-api.service';
import { FormGroup,Validators,FormBuilder } from '@angular/forms';
import {  HttpClient } from '@angular/common/http';
import { RpaStudioDesignerComponent } from '../rpa-studio-designer/rpa-studio-designer.component'
import Swal from 'sweetalert2';
import { RpaStudioComponent } from '../rpa-studio/rpa-studio.component';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NotifierService } from 'angular-notifier';
import {NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { RpaToolsetComponent } from '../rpa-toolset/rpa-toolset.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-rpa-studio-actionsmenu',
  templateUrl: './rpa-studio-actionsmenu.component.html',
  styleUrls: ['./rpa-studio-actionsmenu.component.css']
})
export class RpaStudioActionsmenuComponent implements OnInit , AfterContentChecked{

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
  public AllVersionsList:any=[];
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
  public auditLogsData:any=[]
  displayedColumns: string[] = ['run_id','version','start_date','end_date', "bot_status"];
  Viewloglist:MatTableDataSource<any>;
  displayedColumns1: string[] = ['task_name', 'status','start_date','end_date','error_info' ];
  logbyrunid:MatTableDataSource<any>;
  allLogs:any=[];
  filteredLogs:any=[];
  logspopupopen:boolean=false
  @ViewChild("logsSort",{static:false}) logsSort:MatSort;
  @ViewChild("logsPaginator",{static:false}) logsPaginator:MatPaginator;
  @ViewChild("paginator2",{static:false}) paginator2: MatPaginator;
  @ViewChild("sort2",{static:false}) sort2: MatSort;
  @Output() closeTabEvent = new EventEmitter<void>();
  @ViewChild('t', { static: false }) ngbTabset;
  @Input('tabsArray') public tabsArray: any[];
  @ViewChild(RpaStudioDesignerworkspaceComponent, { static: false }) childBotWorkspace: RpaStudioDesignerworkspaceComponent;
  @ViewChild('auditLogsPopup',{static:false}) public auditLogsPopup:any;
  @ViewChild('logspopup',{static:false}) public logspopup:any;
  public auditLogsModelRef:BsModalRef;
  public logsmodalref:BsModalRef
  pause: any;
  resume: any;
  stop: any;
  checked: boolean;



  loopIterations:any=[];
  iterationsList:any=[];
  fileteredLoopIterations:any=[];
  selectedIterationId:any=0;
  selectedIterationTask:any=undefined;
  displayedloopColumns:string[]=['taskName','status','startTS','endTS',"errorMsg"];
  loopbyrunid:MatTableDataSource<any>;
  @ViewChild("looppaginator",{static:false}) looppaginator: MatPaginator;
  @ViewChild("loopsort",{static:false}) loopsort: MatSort;

  public insertForm:FormGroup;
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
 public selectedLogVersion:any;
 public logsLoading:Boolean=false;
  userRole;
  logsbotid:any;
  isButtonVisible: boolean;
  slider: number = 0;
  options: any = {
    floor: -8,
    ceil: 8,
    vertical: true
  };
  categoryList: any=[];
  constructor(
    private fb : FormBuilder,
    private rest : RestApiService,
    private http:HttpClient,
    private rpa_tabs:RpaStudioDesignerComponent,
    private rpa_toolset:RpaToolsetComponent,
    private rpa_studio:RpaStudioComponent,
    private notifier: NotifierService,
    private calender:NgbCalendar,
    private formBuilder: FormBuilder,
    private changeDetector:ChangeDetectorRef,
    private modalService:BsModalService,
    private spinner:NgxSpinnerService
    ) {}

  ngOnInit() {
    this.userRole = localStorage.getItem("userRole")
    this.userRole = this.userRole.split(',');
    this.isButtonVisible = this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('RPA Admin');
    this.startbot=false;
    this.pausebot=false;
    this.resumebot=false;
    this.logflag=false;
    this.getCategories();
    setTimeout(() => {
      this.getEnvironmentlist();
    }, 2000);
    this.getpredefinedbotlist();
    this.viewlogid="viewlog-"+this.botState.botName;
    if(this.botState.botId!=undefined)
    {
      this.selectedversion=this.botState.version;
      this.savebotrespose=this.botState;
      this.logsbotid=this.savebotrespose.botId
      this.getVersionlist();
    }

    const ipPattern =
    "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
      this.insertForm=this.formBuilder.group({
        environmentName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        environmentType: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        agentPath: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        hostAddress: ["", Validators.compose([Validators.required, Validators.pattern(ipPattern), Validators.maxLength(50)])],
        categoryId:["0", Validators.compose([Validators.required])],
        username: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        password: ["", Validators.compose([Validators.required , Validators.maxLength(50)])],
        connectionType: ["SSH",Validators.compose([Validators.required,, Validators.maxLength(50), Validators.pattern("[A-Za-z]*")])],
        portNumber: ["22",  Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern("[0-9]*")])],
        activeStatus: [true]
      })

  }

  ngAfterContentChecked() : void {
    this.changeDetector.detectChanges();
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
      confirmButtonText: 'Yes, reset designer!'
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
          this.spinner.show();
          this.rest.getDeleteBot(this.savebotrespose.botId).subscribe(data=>{
            let response:any=data;
            this.spinner.hide()
            if(response.status!=undefined)
            {
                Swal.fire("Success",response.status,"success");
                $("#close_bot_"+this.botState.botName).click();
            }
            else
            {
                Swal.fire("Error",response.errorMessage,"error")
            }
          },err=>{
            console.log(err)
            this.spinner.hide();
            Swal.fire("Error","Unable to delete bot","error")
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
        Swal.fire("Warning","Please check connections","warning");
      }
      else
      {
        checkbotres.subscribe(data=>{
        this.savebotrespose=data;

        this.rpa_studio.spinner.hide();
        if(this.savebotrespose.botId!=undefined)
        {
          let url=window.location.hash;
          window.history.pushState("", "", url.split("botId=")[0]+"botId="+this.savebotrespose.botId);
          this.botState=data;
          Swal.fire("Success","Bot saved successfully !!","success");
          this.startbot=true;
          this.pausebot=false;
          this.resumebot=false;
          this.childBotWorkspace.disable=true;
          let bottask:any=this.botState;
          this.getVersionlist();
          let changedBy=`${localStorage.getItem("firstName")} ${localStorage.getItem("lastName")}`
          let auditLogs:any=[{
            "botId": this.savebotrespose.botId,
            "botName": `${this.botState.botName}|BotCreated` ,
            "changeActivity":this.botState.botName,
            "changedBy":  changedBy,
           // "changedDate":(new Date().toLocaleDateString()+", "+new Date().toLocaleTimeString()),
            "newValue":'-',
            "previousValue":'-',
            "taskName":this.botState.botName,
            "version": 1
          }]
          
          this.rest.addAuditLogs(auditLogs).subscribe((data:any)=>{
            this.childBotWorkspace.actualTaskValue=[...this.savebotrespose.tasks.filter(item=>item.version==this.savebotrespose.version)];
            if(data.errorMessage!=undefined)
            {
               Swal.fire("Error",data.errorMessage,"error")
            }
          },err=>{
            console.log(err)
            this.rpa_studio.spinner.hide();
            Swal.fire("Error","Unable to add audit logs","error")
          })
        }
        else
        {
          
          Swal.fire("Error","Bot failed to save","error");
          this.childBotWorkspace.disable=false;
          let coordinates=(this.childBotWorkspace.finaldataobjects[0].x.split("|")!=undefined)?this.childBotWorkspace.finaldataobjects[0].nodeId.split("|"):undefined;
          if(coordinates!=undefined)
          {
            this.childBotWorkspace.finaldataobjects[0].nodeId=coordinates[0];
          }
        }
      },err=>{
        this.spinner.hide();
        Swal.fire("Error","Unable to save bot","error")
      });
      }
    }
    else
    {
       let checkbot:any=await this.childBotWorkspace.updateBotFun(this.savebotrespose,this.finalenv)
       if(checkbot==false)
       {
        this.rpa_studio.spinner.hide();
        Swal.fire("Warning","Please check connections","warning");
       }else
       {
         await checkbot.subscribe(data=>{
          let response:any=data
          if(response.errorMessage== undefined)
          {
            //this.childBotWorkspace.successCallBack(data);
            this.savebotrespose=data;
            this.botState=data;
            this.selectedversion=response.version;
            this.rpa_studio.spinner.hide();
            this.getVersionlist();
            //Swal.fire("Success","Bot updated successfully","success")
            Swal.fire({
              title: 'Success',
              text: "Bot Updated Successfully",
              icon: 'success',
              heightAuto: false,
            })
            let auditLogs=[...this.childBotWorkspace.auditLogs];
            if(auditLogs.length!=0)
            this.rest.addAuditLogs(auditLogs).subscribe((data:any)=>{
              this.childBotWorkspace.actualTaskValue=[...this.savebotrespose.tasks.filter(item=>item.version==this.savebotrespose.version)];
              this.childBotWorkspace.actualEnv=[...this.savebotrespose.envIds]
              if(data.errorMessage!=undefined)
              {
                 Swal.fire("Error",data.errorMessage,"error")
              }
            },err=>{
              console.log(err)
              this.rpa_studio.spinner.hide();
              Swal.fire("Error","Unable to add audit logs","error")
            })
              this.childBotWorkspace.uploadfile(this.finalenv);
          
          }
          else
          {
            this.rpa_studio.spinner.hide();
            Swal.fire("Error",response.errorMessage,"error");
            let coordinates=(this.childBotWorkspace.finaldataobjects[0].x.split("|")!=undefined)?this.childBotWorkspace.finaldataobjects[0].nodeId.split("|"):undefined;
            if(coordinates!=undefined)
            {
              this.childBotWorkspace.finaldataobjects[0].nodeId=coordinates[0];
            }
           
          }
        },err=>{
          console.log(err)
          this.spinner.hide()
          Swal.fire("Error","Unable to update bot","error")
        });
      }
    }
  }



  executionAct() {
    let response:any;
    if(this.savebotrespose!=undefined)
    {
      this.rpa_studio.spinner.show();
      this.rest.execution(this.savebotrespose.botId).subscribe(res =>{
        response = res;
        this.rpa_studio.spinner.hide();
        if(response.errorMessage==undefined && response.errorCode==undefined)
        {
          this.startbot=false;
          this.pausebot=true;
          this.resumebot=false;
          Swal.fire("Success",response.status,"success")
        }else
        {
          Swal.fire("Error",response.errorMessage,"error");
        }
      },err=>{
        this.spinner.hide();
        Swal.fire("Error","Unable to initiate bot execution")
      })
    }
  }

  pauseBot()
  {
    if(this.savebotrespose!=undefined)
    {
      this.rpa_studio.spinner.show();
      this.rest.getUserPause(this.savebotrespose.botId).subscribe(data => {
        let response:any = data;
        this.rpa_studio.spinner.hide();
        if(response.status!=undefined)
        {
          this.pausebot=false;
          this.startbot=false;
          this.resumebot=true;
          Swal.fire("Success",response.status,"success")
        }else
        {
          Swal.fire("Error",response.errorMessage,"error");
        }
      },
      err=>{
        this.spinner.hide();
        Swal.fire("Error","Unable to pause bot")
      });
    }
  }

  resumeBot() {
    if(this.savebotrespose!=undefined)
    {
      this.rpa_studio.spinner.show();
      this.rest.getUserResume(this.savebotrespose.botId).subscribe(data => {
        let response:any = data;
        this.rpa_studio.spinner.hide();
        if(response.status!=undefined)
        {
          this.pausebot=true;
          this.startbot=false;
          this.resumebot=false;
          Swal.fire("Success",response.status,"success");
        }
      },err=>{
        this.spinner.hide()
        Swal.fire("Error","Unable to resume bot")
   
      })
    }
  }

  stopBot() {
    if(this.savebotrespose!=undefined)
    {
        let data:any=""
        this.rpa_studio.spinner.show();
        this.rest.stopbot(this.savebotrespose.botId,data).subscribe(res=>{
          let response:any=res;
          this.rpa_studio.spinner.hide();
          if(response.status!=undefined)
          {
            this.startbot=true;
            this.pausebot=false;
            this.resumebot=false;
            Swal.fire("Success",response.status,"success");
          }
          else
          {
            Swal.fire("Error",response.errorMessage,"error");
          }
        },err=>{
          this.spinner.hide();
          Swal.fire("Error","Unable to stop bot")
   
        })
    }
  }


  getEnvironmentlist() {
    let id=this.botState.categoryId;
    if(id==undefined){                                        
      id=this.botState.botDepartment
    }
    this.rest.getFilteredEnvironment(id).subscribe(data => {
      let response:any=data
      if(response.errorMessage==undefined)
      {
        let environments:any=[];
        environments=response.filter(item=>item.activeStatus==7);
        if(environments.length!=0)
        {
          this.environment=response.map((item)=>{
            item["checked"]=false;
            return item;
          })
          if(this.botState.botId!=undefined)
             this.botState.envIds.forEach(envdata=>{            
               let data= this.environment.find(data=>data.environmentId==envdata)
               if(data!=undefined){
                this.environment.find(data=>data.environmentId==envdata).checked=true
               }           
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
          
        this.selectedEnvironments=this.environment.filter(item=>item.checked==true);
        }
      }
      else
      {
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
    this.selectedEnvironments=this.environment.filter(item=>item.checked==true);
  }

  modify(){
    this.childBotWorkspace.modifyEnableDisable();
  }

  getVersionlist() {
    this.rest.getBotVersion(this.savebotrespose.botId).subscribe(data => {
      let response:any=[];
      response=data;
      let versions=[]
      let sortedversions:any[]=response.sort((a, b) => (a.vId > b.vId) ? 1 : -1)
      sortedversions.reverse().forEach((item ,index)=>{
        if(index<3)
          versions.push(item)
      })
      this.versionsList=versions;
      this.AllVersionsList=sortedversions;
    })
  }

  getpredefinedbotlist() {
    this.spinner.hide();
    this.rest.getpredefinedbots().subscribe((data:any) => {
      this.spinner.hide();
      if(data.errorMessage==undefined)
      {
        this.predefinedbotsData=data;
      }
      else
      {
        Swal.fire("Error",data.errorMessage,"error")
      }
    },err=>{
      console.log(err);
      this.spinner.hide();
      Swal.fire("Error","Unable to get predefined bots","error")
    });
   }

   switchversion(vid)
   {
     this.rpa_studio.spinner.show();
      let response:any;
      this.rest.getbotversiondata(this.savebotrespose.botId,vid).subscribe(data =>{
        response=data;
        this.rpa_studio.spinner.hide();
        if(response.errorMessage==undefined)
        {
          let index=this.rpa_studio.tabsArray.findIndex(data=>data.botName==response.botName);
          this.rpa_studio.tabsArray[index]=response;
        }
        else
        {
          this.rpa_studio.spinner.hide()
          Swal.fire("Error",response.errorMessage,"error")
        }
      },err=>{
        console.log(err)
        this.rpa_studio.spinner.hide();
        Swal.fire("Error","Unable to get version bot","error")
      })
   }




   getAuditLogs()
   {
     this.rpa_studio.spinner.show();
     let botId:number=this.savebotrespose.botId
     this.rest.getAuditLogs(botId).subscribe((data:any)=>{
        this.spinner.hide();
        if(data.errorMessage==undefined)
        {
          this.auditLogsData=[...data.Status.map((item:any)=>{
            if(item.botName.split("|")[1]!=undefined)
            {
              item["Status"]=item.botName.split("|")[1];
              if(item["Status"]=='AddedEnv'|| item['Status']=='RemovedEnv')
              {
                let envId=parseInt(item.taskName);
                item["taskName"]=this.environment.find((envItem:any)=>envItem.environmentId==envId)==undefined?'Deleted Environment':this.environment.find((envItem:any)=>envItem.environmentId==envId).environmentName;
              }
            }
            else
            {
              item["Status"]="UpdatedConfig"
            }
            return item;
          })].reverse();
          this.auditLogsModelRef=this.modalService.show(this.auditLogsPopup, {class:"logs-modal"});
        }
        else{
          Swal.fire("Error",data.errorMessage,"error")
        }
     },err=>{
       this.rpa_studio.spinner.hide();
       Swal.fire("Error","Unable to get audit logs","error")
     })
   }


   updateLog(logid,Logtemplate)
   {
    
      this.spinner.show();
     this.rest.updateBotLog(this.savebotrespose.botId,this.savebotrespose.version,logid).subscribe(data=>{
        let response:any=data;  
        this.spinner.hide();
        if(response.errorMessage==undefined)
          this.viewlogdata(this.logspopup,'update');
        else
          Swal.fire("Error",response.errorMessage,"error");
     });
   }



   
   viewlogdata(log_popup_template,action){
    this.childBotWorkspace.addsquences();
    this.logsbotid = this.savebotrespose.botId;
    // this.modalService.show(log_popup_template, {class:"logs-modal"})
      this.logsmodalref=this.modalService.show(log_popup_template, {class:"logs-modal"})
 }



 


 
 public botrunid:any;
 public allRuns:any=[];
 ViewlogByrunid(runid,version){
  this.botrunid=runid;
  this.selectedLogVersion=version
  let responsedata:any=[];
  let logbyrunidresp:any;
  let resplogbyrun:any=[];
  this.rpa_studio.spinner.show();
  this.logsLoading=true;
  this.rest.getViewlogbyrunid(this.savebotrespose.botId,version,runid).subscribe((data:any)=>{
    if(data.errorMessage==undefined)
    {
     responsedata = [...data];
     this.logsLoading=false;
     this.rpa_studio.spinner.hide();
     
     var flag=0;
     var loopInsideArray:any=[]
     responsedata=responsedata.sort((a,b) => a.task_id > b.task_id ? 1 : -1);
     for(let i=0;i<responsedata.length;i++)
     {
       if(responsedata[i].task_name=='Loop-Start')
         flag=1;
       if(responsedata[i].task_name=='Loop-End')
         flag=0;
       if(flag==1)
         loopInsideArray.push(responsedata[i])
     }
     responsedata.forEach(rlog=>{
       logbyrunidresp=rlog;
       logbyrunidresp["start_date"]=logbyrunidresp.start_time;
       logbyrunidresp["end_date"]=logbyrunidresp.end_time;
       logbyrunidresp.start_time=logbyrunidresp.start_time;
       logbyrunidresp.end_time=logbyrunidresp.end_time;
       if(loopInsideArray.find(item3=>item3.task_id==rlog.task_id)==undefined)
         resplogbyrun.push(logbyrunidresp)
       else if(loopInsideArray.find(item3=>item3.task_id==rlog.task_id).task_name=="Loop-Start")
         resplogbyrun.push(logbyrunidresp)
     });
     this.logflag=true;
     this.viewlogid1=runid;
     this.allRuns=[...resplogbyrun];
     this.logbyrunid = new MatTableDataSource(resplogbyrun);
     this.changeDetector.detectChanges();
     this.logbyrunid.paginator=this.paginator2;
     this.logbyrunid.sort=this.sort2
   }
   else
   {
     
     this.spinner.hide();
     this.logsLoading=false;
     Swal.fire("Error",data.errorMessage,"error")
   }
    
   }, err=>{
     this.spinner.hide();
     this.logsLoading=false;
     
    this.spinner.hide();
    Swal.fire("Error","unable to get logs","error")
   })
 }


 






loadpredefinedbot(botId, dropCoordinates)
{

  console.log(dropCoordinates)
  let droppedXcoordinate=dropCoordinates.x.split("px")[0]
  
  let droppedYcoordinate=dropCoordinates.y.split("px")[0]
  this.rpa_studio.spinner.show();
  let responsedata:any=[]
  this.rest.getpredefinedotdata(botId).subscribe(data=>{
    responsedata=data;
    if(responsedata.errorMessage==undefined)
    {
      let j=0;
      responsedata.tasks.forEach(element=>
      {
        //this.childBotWorkspace.finaldataobjects.push(element)
        let nodename=  element.nodeId.split("__")[0];
        let nodeid=(element.nodeId.split("__")[1]).split("|")[0];
       
        let node={
          id:this.childBotWorkspace.idGenerator(),
          name:nodename,
          selectedNodeTask:element.taskName,
          path:this.rpa_toolset.templateNodes.find(data=>data.name==nodename).path,
          selectedNodeId: element.tMetaId,
          tasks:this.rpa_toolset.templateNodes.find(data=>data.name==nodename).tasks,
          x:j+parseInt(droppedXcoordinate)+'px',
          y:j+parseInt(droppedYcoordinate)+"px",
      }
      j=j+100;
      if(responsedata.sequences.find(item=>item.sourceTaskId==nodeid)!=undefined)
      {
        responsedata.sequences.find(item=>item.sourceTaskId==nodeid).sourceTaskId=node.id
      }

      if(responsedata.sequences.find(item=>item.targetTaskId==nodeid)!=undefined)
      {
        responsedata.sequences.find(item=>item.targetTaskId==nodeid).targetTaskId=node.id
      }



      element.nodeId=nodename+"__"+node.id;
      this.childBotWorkspace.nodes.push(node);
     // this.childBotWorkspace.finaldataobjects.push(element);
      setTimeout(() => {
        this.childBotWorkspace.populateNodes(node);
      }, 240);


      })
     
      responsedata.sequences.splice((responsedata.sequences.length-1),1)
      responsedata.sequences.splice(0,1)
     
        this.childBotWorkspace.addconnections(responsedata.sequences);
        this.rpa_studio.spinner.hide();
    }else
    {
      this.rpa_studio.spinner.hide();
      Swal.fire(responsedata.errorMessage,"","warning");
    }
  })
}



  rpa_assignbot(botId,taskId)
  {
    
   this.rpa_studio.spinner.show();
    this.rest.assign_bot_and_task(botId,taskId, "EPSoft","Automated").subscribe(data=>{
      
      this.rpa_studio.spinner.hide();
      let response:any=data;
      if(response.status!=undefined)
      {
        this.notifier.notify("info",response.status);
      }
    });
  }



  openschedule()
  {
    this.schedule={
      botid:this.savebotrespose.botId,
      version:this.savebotrespose.version,
      botName:this.savebotrespose.botName
    }
    this.schpop=true;
  }
  closesch()
  {
    this.schpop=false;
    document.getElementById("filters").style.display = "block";
  }


  // saveschedule(schedule,schedule_list)
  // {
  //   //this.scheduleLists=schedule;
  //   this.schedule_list_scheduler=schedule_list;
  //   this.childBotWorkspace.saveCron(schedule);
  // }


  // updatesavedschedules(schedules)
  // {
  //   this.childBotWorkspace.saveCron(schedules)
  // }

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

  exportbot(bot)
  {
    this.rpa_studio.spinner.show();
    this.rest.bot_export(bot.botId).subscribe((data)=>{
      
        this.rpa_studio.spinner.hide();
      
        const linkSource = `data:application/txt;base64,${data}`;
        const downloadLink = document.createElement('a');
        document.body.appendChild(downloadLink);

        downloadLink.href = linkSource;
        downloadLink.target = '_self';
        downloadLink.download = bot.botName+"-V"+bot.version+".sql";
        downloadLink.click(); 
        Swal.fire("Success","Bot Exported Successfully","success");
    })
  }



  create_env()
  {
        document.getElementById("rpa_createenvironment"+"_"+this.botState.botName).style.display="block";
        this.insertForm.get("categoryId").setValue(this.categoryList.length==1?this.categoryList[0].categoryId:"0")
        document.getElementById("filters").style.display = "none";
  }

  async saveEnvironment()
  {

   if(this.insertForm.valid)
   {
     this.rpa_studio.spinner.show();
     if(this.insertForm.value.activeStatus==true)
      {
        this.insertForm.value.activeStatus=7
      }else{
        this.insertForm.value.activeStatus=8
      }
      this.insertForm.value.createdBy="admin";
      let environment=this.insertForm.value;
      await this.rest.addenvironment(environment).subscribe( res =>
      {
        let resp:any=res;
        this.rpa_studio.spinner.hide();
        if(resp.status !=undefined)
        {
            
            Swal.fire("Success","Environment Added Successfully!!","success");
            //document.getElementById("rpa_createenvironment"+"_"+this.botState.botName).style.display='none';
            this.insertForm.reset();
            this.insertForm.get("portNumber").setValue("22");
            this.insertForm.get("connectionType").setValue("SSH");
            this.getEnvironmentlist()
            this.close_c_env();
        }else if(resp.errorMessage!=undefined)
        {
          Swal.fire("Error",resp.errorMessage,"error");
        }
      },()=>{
        this.rpa_studio.spinner.hide();
        Swal.fire("Error","Something went wrong","error");
      });
    }
    else
    {
    }
  }


  async testConnection(data){
    this.rpa_studio.spinner.show();
    let formdata:any;
    formdata=this.insertForm;
   if(formdata.valid)
   {
    if(formdata.value.activeStatus==true)
    {
      formdata.value.activeStatus=7
    }else{
      formdata.value.activeStatus=8
    }
     await this.rest.testenvironment(formdata.value).subscribe( res =>
      {
        this.rpa_studio.spinner.hide();
        if(res.errorCode==undefined){
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Successfully Connected",
          showConfirmButton: false,
          timer: 2000
        })
        }else{
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Connection Failed',
            showConfirmButton: false,
            timer: 2000
          })
        }
    });
    this.activestatus();
  }
  else
  {
    this.rpa_studio.spinner.hide();
     Swal.fire("Invalid Form","","success");
     this.activestatus();
  }

  }


  activestatus(){
    if(this.insertForm.value.activeStatus == 7)
    {
      this.insertForm.value.activeStatus = true;
    }else{
      this.insertForm.value.activeStatus = false;
    }
  }

    close_c_env()
    {
      document.getElementById("rpa_createenvironment"+"_"+this.botState.botName).style.display="none";
      document.getElementById("filters").style.display = "block";
    }

    getCategories()
    {
      this.rest.getCategoriesList().subscribe(data=>{
        let response:any=data;
        if(response.errorMessage==undefined)
        {
          this.categoryList=response.data;
          this.getEnvironmentlist();
      
        }
      })
    }

    EnvType1(){
      if(this.insertForm.value.environmentType == "Windows"){
        //this.updateForm.value.portNumber="44";
        this.insertForm.get("portNumber").setValue("44");
      }else if(this.insertForm.value.environmentType == "Linux"){
        this.insertForm.get("portNumber").setValue("22");
      }
    }



    sortLoopsIteration(event){

      this.fileteredLoopIterations=this.fileteredLoopIterations.sort(function(a,b){
  
        let check_a=isNaN(a[event.active])?a[event.active].toUpperCase():a[event.active];
  
        let check_b=isNaN(b[event.active])?b[event.active].toUpperCase():b[event.active];
  
        if (event.direction=='asc')
  
          return (check_a > check_b) ? 1 : -1;
  
        else if(event.direction=='desc')
  
          return (check_a < check_b) ? 1 : -1;
  
      },this);
  
      this.loopbyrunid = new MatTableDataSource(this.fileteredLoopIterations);
  
      this.changeDetector.detectChanges();
  
    }
    
    IterationId(event){
  
       this.fileteredLoopIterations=[...this.loopIterations.filter(item=>item.iterationId==event.target.value)];
  
       this.loopbyrunid = new MatTableDataSource(this.fileteredLoopIterations);
  
       this.changeDetector.detectChanges();
  
    }
    
    getLoopIterations(e, iterationId){
      this.iterationsList=[]
      this.logsLoading=true;
      this.rest.getLooplogs(e.bot_id, e.version, e.run_id ).subscribe((response:any)=>{
        this.logsLoading=false;
        if(response.errorMessage==undefined)
        {
          this.loopIterations=[...response];
          this.loopIterations=[...this.loopIterations.filter((item:any)=>item.taskName != 'Loop-End')]
          this.selectedIterationTask=e;
          this.loopIterations.forEach(item=>{
            if(this.iterationsList.find(item2=>item2==item.iterationId)==undefined)
              this.iterationsList.push(item.iterationId)    
          })
          this.iterationsList=[...this.iterationsList.sort(function(a, b){return a - b})];
          this.selectedIterationId=this.iterationsList.length;
          this.fileteredLoopIterations=[...this.loopIterations.filter(item=>(item.iterationId==this.selectedIterationId))];
          this.loopbyrunid = new MatTableDataSource(this.fileteredLoopIterations);
          this.changeDetector.detectChanges();
        }
        else
        {
          this.logsLoading=false;
          this.selectedIterationTask=undefined;
          Swal.fire("Error",response.errorMessage,"error");
        }
         
      },err=>{
        this.logsLoading=false;
        Swal.fire("Error","Unable to open loop logs","error");
        console.log(err)
      })
    }
  
}



