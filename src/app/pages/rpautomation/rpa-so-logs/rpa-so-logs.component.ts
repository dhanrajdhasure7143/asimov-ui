import { ChangeDetectorRef, Component, Input, OnInit, Output ,ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestApiService } from '../../services/rest-api.service';
import moment from 'moment';
import { MessageService,ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-rpa-so-logs',
  templateUrl: './rpa-so-logs.component.html',
  styleUrls: ['./rpa-so-logs.component.css']
})
export class RpaSoLogsComponent implements OnInit {
  @Input('logsmodalref') public logsmodal: BsModalRef;
  public viewlogid1:any;
  public selectedIterationTask:any=undefined;
  public logsLoading:boolean=false;
  public filteredLogs:any=[];
  public iterationsList:any=[];
  public viewlogid:any;
  public selectedIterationId:any=0;
  public logresponse:any=[];
  public respdata1:boolean = false;
  public fileteredLoopIterations:any=[];
  public selectedLogVersion:any;
  public selectedLogVersionNew:any;
  public filteredLogVersion:any;
  public selectedAutomationTask:any=undefined;
  @Input ('logsbotid') public logsbotid:any;
  @Input ('AllVersionsList') public AllVersionsList:any=[];
  @Input('selectedversion') public selectedversion:any;
  @Output('closeEvent') public closeEvent=new EventEmitter<any>();
  public allLogs:any=[];
  public botrunid:any="";
  public allRuns:any=[];
  public loopIterations:any=[];
  public id:any
  // public logsListDataSource:MatTableDataSource<any>;
  // public loopLogsListDataSource:MatTableDataSource<any>;
  public automationLogs:any=[];
  public automationLogsTable:MatTableDataSource<any>;
  public interval: any = 0;
  public timeInterval : any = 0;
  public interval2:any =0;
  public interval3:any = 0;
  public logStatus:any;
  public logsDisplayFlag:any;
  isDataEmpty:boolean=false;
  selectedChildLog:any;
  logsData:any=[];
  columnList=[];
  traversalLogs=[];
  statusColors = {
    New: '#3CA4F3',
    Failure: '#FE665D',
    Success: '#4BD963',
    Killed:"#B91C1C",
    Stopped: '#FE665D',
    Running:"#FFA033"
  };
  errormsg: any;
  display:boolean = true;
  selectedTask:any;
  constructor( private modalService:BsModalService,
     private rest : RestApiService,
     private changeDetector:ChangeDetectorRef,
     private spinner:NgxSpinnerService,
     private messageService:MessageService,
     private confirmationService :ConfirmationService
     ) { }
  ngOnInit() {
    this.viewRunsByBotId();
  }
 
  viewRunsByBotId(){
    this.logsLoading=true;
    this.rest.getviewlogdata(this.logsbotid).subscribe((response:any) =>{
      this.traversalLogs=[]
      this.logsLoading = false;
      this.logsDisplayFlag="RUNS";
      this.botrunid="";
      if(response.errorMessage==undefined)
      {
        
       this.isDataEmpty=false;
       this.columnList=[
        {ColumnName:"run_id",DisplayName:"Run Id",ShowFilter: false,width:"flex: 0 0 7rem",filterType:"text"},
        {ColumnName:"versionNewModified",DisplayName:"Version",ShowFilter: false,width:"flex: 0 0 7rem",filterType:"text"},
        {ColumnName:"startDate",DisplayName:"Start Date",ShowFilter: false,width:"",filterType:"date"},
        {ColumnName:"endDate",DisplayName:"End Date",ShowFilter: false,width:"",filterType:"date"},
        {ColumnName:"bot_status",DisplayName:"Status",ShowFilter: false,width:"",filterType:"text"},
      ];
       this.logsData=[...response.map((item:any, index)=>{
          item["startDate"]=item.start_time!=null?moment(item.start_time).format("MMM DD, yyyy, HH:mm:ss"):item.start_time;
          item["endDate"]=item.end_time!=null?moment(item.end_time).format("MMM DD, yyyy, HH:mm:ss"):item.end_time;
          item["versionNewModified"]="V"+parseFloat(item.versionNew).toFixed(1);
          return item;
        }).sort((a,b) => a.version > b.version ? -1 : 1)];
      }
      else
      {
        this.isDataEmpty=true;
        this.errormsg= response.errorMessage;
      }
      
  },err=>{
    this.logsLoading=false;
    this.isDataEmpty=true;
    this.messageService.add({severity:'error',summary:'Error',detail:'Unable to get the logs.'})
    });
  }

  clear(table:any) {
    table.clear();
  }

  // changeLogVersion(event){
  //   this.filteredLogVersion=event.target.value;
  //    this.filteredLogs=[...this.allLogs.filter(item=>item.version==this.filteredLogVersion)];
  //    let logs=[...this.filteredLogs]
  //    this.runsListDataSource = new MatTableDataSource(logs);
  //    this.changeDetector.detectChanges();
  // }

  ViewlogByrunid(runid,versionNew,version){
    this.botrunid=runid;
    this.selectedLogVersion=version 
    this.selectedLogVersionNew=versionNew 
    this.logsLoading=true;
    this.logsDisplayFlag='LOGS'
    let flag=0;
    this.rest.getViewlogbyrunid(this.logsbotid,versionNew,runid,version).subscribe((response:any)=>{ 
     
      if(response.errorMessage==undefined)
      { 
        
       this.isDataEmpty=false; 
       this.columnList=[
        {ColumnName:"task_name",DisplayName:"Task",ShowFilter: false,width:"flex: 0 0 10rem",filterType:"text"},
        {ColumnName:"bot_status",DisplayName:"Status",ShowFilter: false,width:"",filterType:"date"},
        {ColumnName:"startDate",DisplayName:"Start Date",ShowFilter: false,width:"",filterType:"text"},
        {ColumnName:"endDate",DisplayName:"End Date",ShowFilter: false,width:"",filterType:"text"},
        {ColumnName:"error_info",DisplayName:"Info",ShowFilter: false,width:"",filterType:"text"},
      ];
        this.logsData=[...response.filter((item:any)=>{

          item["startDate"]=item.start_time!=null?moment(item.start_time).format("MMM DD, yyyy, HH:mm:ss"):item.start_time;
          item["endDate"]=item.end_time!=null?moment(item.end_time).format("MMM DD, yyyy, HH:mm:ss"):item.end_time;
          item["bot_status"]=item.status;
          if(item.parent_log_id==null)
            return item;
        }).filter((item:any)=>{
          if(item.task_name=='Loop-Start')
          {
            flag=1;
            return item;
          }
          if(item.task_name=='Loop-End')
            flag=0;
          if(flag==0)
            return item;
        })]
        this.logsLoading=false;        
      //  this.logsListDataSource = new MatTableDataSource(response);
      //  setTimeout(()=>{
      //     this.logsListDataSource.sort=this.sortLogsTable
      //  },100)
     }
     else
     {
        this.isDataEmpty=true;
        this.logsLoading=false;
        this.errormsg= response.errorMessage;
     }    
     }, err=>{
       this.logsLoading=false;
       this.isDataEmpty=true;
       this.messageService.add({severity:'error',summary:'Error',detail:'Unable to get the logs.'})     
    })
   }


   getChildLogs(task_details,logId,taskId,iterationId, traversalType:any){
    console.log(task_details)
    this.logsLoading=true;
    let flag=0;
    this.selectedChildLog=task_details; 
    this.rest.getChildLogs(task_details,logId,taskId,iterationId,this.selectedLogVersionNew,this.selectedLogVersion).subscribe((response:any)=>{ 
      if(traversalType=="FARWORD") this.traversalLogs.push(task_details);
      this.selectedTask=task_details;
      this.selectedTask["actual_task_id"]=taskId;
      this.selectedTask["actual_log_id"]=logId;
      this.selectedTask["actual_iteration_id"]=iterationId;   
      if(response.errorMessage==undefined){ 
       this.logsDisplayFlag="CHILD-LOGS";  
       this.isDataEmpty=false;
       this.columnList=[
        {ColumnName:"task_name",DisplayName:"Task",ShowFilter: false,width:"flex: 0 0 10rem",filterType:"text"},
        {ColumnName:"iteration_id",DisplayName:"Iteration Id",ShowFilter: false,width:"",filterType:"date"},
        {ColumnName:"bot_status",DisplayName:"Status",ShowFilter: false,width:"",filterType:"date"},
        {ColumnName:"startDate",DisplayName:"Start Date",ShowFilter: false,width:"",filterType:"text"},
        {ColumnName:"endDate",DisplayName:"End Date",ShowFilter: false,width:"",filterType:"text"},
        {ColumnName:"error_info",DisplayName:"Info",ShowFilter: false,width:"",filterType:"text"},
      ];
        this.logsData=[...response.filter((item:any)=>{
          item["startDate"]=item.start_time!=null?moment(item.start_time).format("MMM DD, yyyy, HH:mm:ss"):item.start_time;
          item["endDate"]=item.end_time!=null?moment(item.end_time).format("MMM DD, yyyy, HH:mm:ss"):item.end_time;
          item["bot_status"]=item.status;  
          return item;
        }).filter((item:any)=>{
          if(item.task_name=='Loop-Start')
          {
            flag=1;
            return item;
          }
          if(item.task_name=='Loop-End')
            flag=0;
          if(flag==0)
            return item;
        })]
        this.logsLoading=false;
     }
     else
     {
        this.isDataEmpty=true;
        this.logsLoading=false;
        this.messageService.add({severity:'error',summary:'Error',detail:response.errorMessage});
     }    
     }, err=>{
       this.logsLoading=false;
       this.isDataEmpty=true;
       this.messageService.add({severity:'error',summary:'Error',detail:'Unable to get the logs.'})     
    })
   }



   logsBackTraversal(){
      let logData:any=(this.traversalLogs.pop());
      this.traversalLogs.splice(0,this.traversalLogs.findIndex((item=>item==logData)));
      if(logData.parent_log_id!=null && logData.parent_task_id!=null)
        this.getChildLogs(logData, logData.parent_log_id,logData.parent_task_id,logData.parent_iteration_id, "BACKWARD");
      else
        this.ViewlogByrunid(logData.run_id, logData.versionNew,logData.version);
   }

  // sortasc(event){
  //   let sortdes:Boolean
  //   if(this.viewlogid1==undefined)
  //   {
  //     if(event.direction=='asc')
  //     sortdes=true;
  //     else if(event.direction=='des')
  //     sortdes=false;
  //     if(event.direction!="")
  //     {
  //       if(event.active!='version')
  //       this.filteredLogs=this.filteredLogs.sort(function(a,b){
  //         let check_a=isNaN(a[event.active])?a[event.active].toUpperCase():a[event.active];
  //         let check_b=isNaN(b[event.active])?b[event.active].toUpperCase():b[event.active];
  //         if (sortdes==true)
  //           return (check_a > check_b) ? 1 : -1;
  //         else
  //           return (check_a < check_b) ? 1 : -1;
  //       },this);
  //     }
  //     else
  //     {
  //      // this.filteredLogs=[...this.allLogs.filter((item:any)=>item.version=this.filteredLogVersion)];
  //      this.filteredLogs=[...this.allLogs];
  //     }
  //     this.runsListDataSource = new MatTableDataSource(this.filteredLogs);
  //     this.changeDetector.detectChanges();
  //     this.runsListDataSource.sort=this.logsSort;
  //     // this.Viewloglist.paginator=this.logsPaginator
  //   }
  //   else(this.viewlogid1!=undefined)
  //   {
  //     if(event.direction=='asc')
  //       sortdes=true;
  //     else if(event.direction=='des')
  //       sortdes=false;
  //     if(event.direction!=""){
  //       let allRuns=[...this.allRuns.sort(function(a,b){
  //         let check_a=isNaN(a[event.active])?a[event.active].toUpperCase():a[event.active];
  //         let check_b=isNaN(b[event.active])?b[event.active].toUpperCase():b[event.active];
  //         if (sortdes==true)
  //           return (check_a > check_b) ? 1 : -1;
  //         else
  //           return (check_a < check_b) ? 1 : -1;
  //       },this)];
  //     }
  //     this.logbyrunid = new MatTableDataSource(this.allRuns)
  //     this.changeDetector.detectChanges();
  //      this.logbyrunid.sort=this.logsSort;
  //     //  this.logbyrunid.paginator=this.logsPaginator
  //   }
  // }

  // sortLoopsIteration(event){
  //   this.loopIterations=this.loopIterations.sort(function(a,b){
  //     let check_a=isNaN(a[event.active])?a[event.active].toUpperCase():a[event.active];
  //     let check_b=isNaN(b[event.active])?b[event.active].toUpperCase():b[event.active];
  //     if (event.direction=='asc')
  //       return (check_a > check_b) ? 1 : -1;
  //     else if(event.direction=='desc')
  //       return (check_a < check_b) ? 1 : -1;
  //   },this);
  //   this.loopbyrunid = new MatTableDataSource(this.loopIterations);
  //   this.changeDetector.detectChanges();
  //   this.loopbyrunid.sort = this.loopsort
  // }
  
  // IterationId(value){
  //  //clearInterval(this.interval2)
  //     this.fileteredLoopIterations=[...this.loopIterations.filter(item=>item.iterationId==value)];

  //    this.loopbyrunid = new MatTableDataSource(this.fileteredLoopIterations);

  //    this.changeDetector.detectChanges();


  // }
  
  // showLoopIteration(e){
  //   clearInterval(this.interval)
  //   clearInterval(this.timeInterval)
  //   this.logsLoading=true;
  //   this.getLoopIterations(e);
  //   this.interval2= setInterval(()=>{
  //   this.getLoopIterations(e);
  //   },3000)
  // }

  getLoopIterations(e){
    this.iterationsList=[]
    this.logsLoading=true;
    this.logsDisplayFlag='LOOP-LOGS'
    this.rest.getLooplogs(e.bot_id, e.version, e.run_id ).subscribe((response:any)=>{
      this.logsLoading= false;
      this.isDataEmpty=false;
      if(response.errorMessage==undefined)
      {
        this.logsDisplayFlag="LOOP-LOGS";
        this.columnList=[
          {ColumnName:"task_name",DisplayName:"Task",ShowFilter: false,width:"flex: 0 0 10rem",filterType:"text"},
          {ColumnName:"iteration_id",DisplayName:"Iteration Id",ShowFilter: false,width:"",filterType:"date"},
          {ColumnName:"bot_status",DisplayName:"Status",ShowFilter: false,width:"",filterType:"date"},
          {ColumnName:"startDate",DisplayName:"Start Date",ShowFilter: false,width:"",filterType:"text"},
          {ColumnName:"endDate",DisplayName:"End Date",ShowFilter: false,width:"",filterType:"text"},
          {ColumnName:"error_info",DisplayName:"Info",ShowFilter: false,width:"",filterType:"text"},
        ];
        this.logsData=[...response.sort((a,b) => b.iterationId > a.iterationId ? 1 : -1).filter((item:any)=>item.taskName != 'Loop-End')].map((item:any)=>{
          item["task_name"]=item.taskName;
          item["iteration_id"]=item.iterationId;
          item["error_info"]=item.errorMsg
          item["startDate"]=item.startTS!=null?(moment(item.startTS).format("MMM DD, yyyy, HH:mm:ss")):item.startTS;
          item["endDate"]=item.endTS!=null?(moment(item.endTS).format("MMM DD, yyyy, HH:mm:ss")):item.endTS;
          if(item.status==1)
          item["bot_status"]="New";
          if(item.status==2)
          item["bot_status"]="Running";
          if(item.status==3)
          item["bot_status"]="Paused";
          if(item.status==4)
          item["bot_status"]="Stopped";
          if(item.status==5)
          item["bot_status"]="Success";
          if(item.status==6)
          item["bot_status"]="Failed";
          item["child_logs_exist"]=false;
          return item;
        });
        this.selectedIterationTask=e;
      }
      else
      {
        
       this.isDataEmpty=true;
        this.logsLoading=false;
        this.selectedIterationTask=undefined;
        this.errormsg= response.errorMessage;
      }      
    },err=>{
      this.logsLoading=false;
      
      this.isDataEmpty=true;
      this.messageService.add({severity:'error',summary:'Error',detail:'Unable to open the loop logs.'})
    })
  }


  getAutomationLogs(taskData:any){
    this.selectedAutomationTask=taskData;
    this.logsLoading=true;
    this.rest.getAutomationLogs(taskData.bot_id, taskData.version, taskData.run_id,taskData.task_id).subscribe((response:any)=>{
      this.logsLoading=false;
      
      this.isDataEmpty==false;
      if(response.errorMessage==undefined)
      {
        this.automationLogs=response;
        this.automationLogsTable=new MatTableDataSource([...this.automationLogs]);
      }
      else
      {
        
       this.isDataEmpty==true;
       this.errormsg= response.errorMessage;
      }
    },err=>{
      this.logsLoading=false
      this.isDataEmpty==true;
      this.messageService.add({severity:'error',summary:'Error',detail:'Unable to get the automation logs.'})
    })
  }

  updateLog(element: any) {
    // clearInterval(this.interval)
    // clearInterval(this.timeInterval)
    // clearInterval(this.interval3)
    // clearInterval(this.interval2)
    this.logsLoading = true;
    this.rest.updateBotLog(element.bot_id, element.version, element.run_id).subscribe(data => {
      let response: any = data;
      this.logsLoading = false;
      if (response.errorMessage)
      this.errormsg= response.errorMessage;
      else
        this.messageService.add({severity:'success',summary:'Success',detail:response.status});
      this.viewRunsByBotId();
    });
  }


  // autoRefresh(){
  //   this.viewlogid1=undefined;
  //   this.viewRunsByBotId()
  //   this.logsLoading = true;
  //   this.timeInterval = setInterval(() => {
  //   this.viewRunsByBotId()
  //     }, 3000)   
  // }

  // backtoPage(){
  //   this.viewlogid1=undefined
  //   clearInterval(this.interval)
  //   this.autoRefresh();
  // }

  // backtoRunid(){
  //   this.selectedIterationTask=undefined;
  //   this.selectedIterationId=0;
  //   clearInterval(this.interval)
  //   //this.showLogsByRunId(this.botrunid,this.selectedLogVersion,this.logStatus)
  //   clearInterval(this.interval2)
  // }

  // backtoRunpage(){
  //   this.viewlogid1=undefined
  //   this.selectedAutomationTask=undefined;
  //   clearInterval(this.interval)
  //   this.autoRefresh();   
  // }


  closeLogsOverlay(){
    this.closeEvent.emit(false)
    this.selectedIterationTask==undefined;
  }

  showAutomatedLogs(element){

  }

// ngOnDestroy(): void {
//   clearInterval(this.interval)
//   clearInterval(this.timeInterval)
//   clearInterval(this.interval3)
//   clearInterval(this.interval2)
// }
getColor(status) {
  return this.statusColors[status]?this.statusColors[status]:'';
}
  
}
