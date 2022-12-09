import { ChangeDetectorRef, Component, Input, OnInit, Output ,ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestApiService } from '../../services/rest-api.service';
import moment from 'moment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-rpa-so-logs',
  templateUrl: './rpa-so-logs.component.html',
  styleUrls: ['./rpa-so-logs.component.css']
})
export class RpaSoLogsComponent implements OnInit {
  @Input('logsmodalref') public logsmodal: BsModalRef;
  runsListDataSource:MatTableDataSource<any>;
  @ViewChild("sortRunsTable",{static:false}) sortRunsTable:MatSort;
  @ViewChild("sortLogsTable",{static:false}) sortLogsTable:MatSort;
  @ViewChild("sortLoopLogsTable",{static:false}) sortLoopLogsTable:MatSort;
  @ViewChild("sortAutomationLogsTable",{static:false}) sortAutomationLogsTable:MatSort;
 // @ViewChild("logsPaginator",{static:false}) logsPaginator:MatPaginator;
  RunsTableColoumns: string[] = ['run_id','version','startDate','endDate', "bot_status"];
  LogsTableColumns: string[] = ['task_name', 'status','startDate','endDate','error_info' ];
  loopLogsTableColoumns:string[]=['taskName','iterationId','status','startDate','endDate',"errorMsg"];
  automationLogColoumns:string[]=['internaltaskName','startTS','endTS', 'status','errorMsg']
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
  public filteredLogVersion:any;
  public selectedAutomationTask:any=undefined;
  @Input ('logsbotid') public logsbotid:any;
  @Input ('AllVersionsList') public AllVersionsList:any=[];
  @Input('selectedversion') public selectedversion:any;
  @Output('close') public closeEvent=new EventEmitter<any>();
  @ViewChild("paginator2",{static:false}) paginator2: MatPaginator;
  @ViewChild("sort2",{static:false}) sort2: MatSort;
  public allLogs:any=[];
  public botrunid:any;
  public allRuns:any=[];
  public loopIterations:any=[];
  public id:any
  public logsListDataSource:MatTableDataSource<any>;
  public loopLogsListDataSource:MatTableDataSource<any>;
  public automationLogs:any=[];
  public automationLogsTable:MatTableDataSource<any>;
  public interval: any = 0;
  public timeInterval : any = 0;
  public interval2:any =0;
  public interval3:any = 0;
  public logStatus:any;
  public logsDisplayFlag:any;
  isDataEmpty:boolean=false;
  constructor( private modalService:BsModalService,
     private rest : RestApiService,
     private changeDetector:ChangeDetectorRef,private spinner:NgxSpinnerService) { }
  ngOnInit() {
    this.viewRunsByBotId();
  }
 
  viewRunsByBotId(){
    this.logsLoading=true;
    this.rest.getviewlogdata(this.logsbotid).subscribe((response:any) =>{
      this.logsLoading = false;
      this.logsDisplayFlag="RUNS"
      if(response.errorMessage==undefined)
      {
        
       this.isDataEmpty=false;
       response=[...response.map((item:any, index)=>{
          item["startDate"]=item.start_time!=null?moment(item.start_time).format("MMM, DD, yyyy, H:mm:ss"):item.start_time;
          item["endDate"]=item.end_time!=null?moment(item.end_time).format("MMM, DD, yyyy, H:mm:ss"):item.end_time;
          item["versionNew"]=parseFloat(item.versionNew).toFixed(1)
          return item;
        }).sort((a,b) => a.version > b.version ? -1 : 1)];
        this.runsListDataSource = new MatTableDataSource(response);
        setTimeout(()=>{
          this.runsListDataSource.sort=this.sortRunsTable;
          //this.runsListDataSource.paginator=this.logsPaginator;  
        },100)
      }
      else
      {
        this.isDataEmpty=true;
        Swal.fire("Error",response.errorMessage, "error")
      }
      
  },err=>{
    this.logsLoading=false;
    this.isDataEmpty=true;
    Swal.fire("Error","unable to get logs","error")
    });
  }

  // changeLogVersion(event){
  //   this.filteredLogVersion=event.target.value;
  //    this.filteredLogs=[...this.allLogs.filter(item=>item.version==this.filteredLogVersion)];
  //    let logs=[...this.filteredLogs]
  //    this.runsListDataSource = new MatTableDataSource(logs);
  //    this.changeDetector.detectChanges();
  // }

  ViewlogByrunid(runid,version){
    this.botrunid=runid;
    this.selectedLogVersion=version 
    this.logsLoading=true;
    this.logsDisplayFlag='LOGS'
    let flag=0;
    this.rest.getViewlogbyrunid(this.logsbotid,version,runid).subscribe((response:any)=>{ 
      this.logsLoading=false;
      if(response.errorMessage==undefined)
      { 
        
       this.isDataEmpty=false; 
        response=[...response.map((item:any)=>{
          item["startDate"]=item.start_time!=null?moment(item.start_time).format("MMM, DD, yyyy, H:mm:ss"):item.start_time;
          item["endDate"]=item.end_time!=null?moment(item.end_time).format("MMM, DD, yyyy, H:mm:ss"):item.end_time;
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
        
       this.logsListDataSource = new MatTableDataSource(response);
       setTimeout(()=>{
          this.logsListDataSource.sort=this.sortLogsTable
       },100)
     }
     else
     {
        this.isDataEmpty=true;
        this.logsLoading=false;
        Swal.fire("Error",response.errorMessage,"error")
     }    
     }, err=>{
       this.logsLoading=false;
       this.isDataEmpty=true;
       Swal.fire("Error","unable to get logs","error")       
    })
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
        response=[...response.sort((a,b) => b.iterationId > a.iterationId ? 1 : -1).filter((item:any)=>item.taskName != 'Loop-End')].map((item:any)=>{
          item["startDate"]=item.startTS!=null?(moment(item.startTS).format("MMM, DD, yyyy, H:mm:ss")):item.startTS;
          item["endDate"]=item.endTS!=null?(moment(item.endTS).format("MMM, DD, yyyy, H:mm:ss")):item.endTS;
          return item;
        });
        this.selectedIterationTask=e;
        if(response.length==0){
          this.isDataEmpty=true;
        }
        else{
          this.loopLogsListDataSource = new MatTableDataSource(response);
          setTimeout(()=>{
            this.loopLogsListDataSource.sort=this.sortLoopLogsTable;
          },100)
        }
      }
      else
      {
        
       this.isDataEmpty=true;
        this.logsLoading=false;
        this.selectedIterationTask=undefined;
        Swal.fire("Error",response.errorMessage,"error");
      }      
    },err=>{
      this.logsLoading=false;
      
      this.isDataEmpty=true;
      Swal.fire("Error","Unable to open loop logs","error");
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
        Swal.fire("Error",response.errorMessage,"error");
      }
    },err=>{
      this.logsLoading=false
      this.isDataEmpty==true;
      Swal.fire("Error","Unable to get automation Logs","error")
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
        Swal.fire("Error", response.errorMessage, "error");
      else
        Swal.fire("Success", response.status, "success");
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


  closeLogsOverlay()
  {
    this.selectedIterationTask==undefined;
    this.closeEvent.emit(null)
  }

// ngOnDestroy(): void {
//   clearInterval(this.interval)
//   clearInterval(this.timeInterval)
//   clearInterval(this.interval3)
//   clearInterval(this.interval2)
// }

  
}
