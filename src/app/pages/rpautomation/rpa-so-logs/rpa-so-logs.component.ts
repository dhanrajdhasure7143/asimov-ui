import { ChangeDetectorRef, Component, Input, OnInit, Output ,ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestApiService } from '../../services/rest-api.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-rpa-so-logs',
  templateUrl: './rpa-so-logs.component.html',
  styleUrls: ['./rpa-so-logs.component.css']
})
export class RpaSoLogsComponent implements OnInit, OnDestroy {
  @Input('logsmodalref') public logsmodal: BsModalRef;
  Viewloglist:MatTableDataSource<any>;
  @ViewChild("logsSort",{static:false}) logsSort:MatSort;
  @ViewChild("loopsort",{static:false}) loopsort:MatSort;
  @ViewChild("logsPaginator",{static:false}) logsPaginator:MatPaginator;
  displayedColumns: string[] = ['run_id','version','start_date','end_date', "bot_status"];
  displayedColumns1: string[] = ['task_name', 'status','start_date','end_date','error_info' ];
  displayedloopColumns:string[]=['taskName','iterationId','status','startTS','endTS',"errorMsg"];
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
  public logbyrunid:MatTableDataSource<any>;
  public loopbyrunid:MatTableDataSource<any>;
  public automationLogs:any=[];
  public automationLogsTable:MatTableDataSource<any>;
  public interval: any = 0;
  public timeInterval : any = 0;
  public interval2:any =0;
  public interval3:any = 0;
  public logStatus:any;
  constructor( private modalService:BsModalService,
     private rest : RestApiService,
     private changeDetector:ChangeDetectorRef,private spinner:NgxSpinnerService) { }

  ngOnInit() {
    this.AllVersionsList=this.AllVersionsList.map(item=>{return item.vId});
    this.filteredLogVersion=this.selectedversion
    this.autoRefresh()
  }
 
  viewlogdata(){
    clearInterval(this.interval) 
   let response: any;
   let log:any=[];
   this.logresponse=[];
    this.rest.getviewlogdata(this.logsbotid).subscribe(data =>{
      this.logresponse=data;
      this.logsLoading = false;
      // this.logresponse.map(item=>{
      //   if(item.version_new!=null){
      //     item["version_new"]= parseFloat(item.version_new)
      //     item["version_new"]=item.version_new.toFixed(1)
      //    }
      //  })
      if(this.logresponse.length >0)
      {
        this.respdata1 = false;
      }else
      {
        this.respdata1 = true;
      }
      if(this.logresponse.length>0)
      this.logresponse.forEach(data=>{
      response=data;
      if(response.start_time != null)
      {
       // let startdate=response.start_time.split("T");
        response["start_date"]=response.start_time;
        response.start_time=response.start_time;

       //  logbyrunidresp["start_date"]=logbyrunidresp.start_time;
       //  logbyrunidresp["end_date"]=logbyrunidresp.end_time;
       //  logbyrunidresp.start_time=logbyrunidresp.start_time;
       //  logbyrunidresp.end_time=logbyrunidresp.end_time;


      }
      if(response.end_time != null)
      {
       // let enddate=response.end_time.split("T");
        response["end_date"]=response.end_time;
        response.end_time=response.end_time;
      }
      log.push(response)
    });
    log.sort((a,b) => a.version > b.version ? -1 : 1);
    this.allLogs=log;
   //  this.filteredLogs=[...this.allLogs.filter(item=>item.version==this.filteredLogVersion)];
   this.filteredLogs=[...this.allLogs];
     this.Viewloglist = new MatTableDataSource(this.filteredLogs);

     this.changeDetector.detectChanges();
     this.Viewloglist.sort=this.logsSort;
     this.Viewloglist.paginator=this.logsPaginator;
    
  },err=>{
    this.logsLoading=false;
    Swal.fire("Error","unable to get logs","error")
  });
  }

  changeLogVersion(event){
    this.filteredLogVersion=event.target.value;
     this.filteredLogs=[...this.allLogs.filter(item=>item.version==this.filteredLogVersion)];
     let logs=[...this.filteredLogs]
     this.Viewloglist = new MatTableDataSource(logs);
     this.changeDetector.detectChanges();
  }

  showLogsByRunId(runid,version,bot_status){
    this.viewlogid1!=undefined
    clearInterval(this.timeInterval);
    this.logsLoading=true;
    this.logStatus= bot_status
    this.ViewlogByrunid(runid,version);
    if(bot_status == "Running" || bot_status == "New" ){
   this.interval= setInterval(()=>{
      this.ViewlogByrunid(runid,version)
    },3000)
  }

  }

  ViewlogByrunid(runid,version){
   clearInterval(this.timeInterval)
   clearInterval(this.interval2)
    this.botrunid=runid;
    this.selectedLogVersion=version
    let responsedata:any=[];
    let logbyrunidresp:any;
    let resplogbyrun:any=[]; 
    this.rest.getViewlogbyrunid(this.logsbotid,version,runid).subscribe((data:any)=>{
      if(data.errorMessage==undefined)
      {
       responsedata = [...data];
       this.logsLoading=false;
      
       // if(responsedata.length >0)
       // {
       //   this.respdata2 = false;
       // }else
       // {
       //   this.respdata2 = true;
       // }
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
       this.viewlogid1=runid;
       this.allRuns=[...resplogbyrun];

       this.logbyrunid = new MatTableDataSource(resplogbyrun);
       this.changeDetector.detectChanges();
      //  this.logbyrunid.paginator=this.paginator2;
       this.logbyrunid.sort=this.sort2
        resplogbyrun = [];      
     }
     else
     {
       this.logsLoading=false;
       Swal.fire("Error",data.errorMessage,"error")
     }    
     }, err=>{
       this.logsLoading=false;
      Swal.fire("Error","unable to get logs","error")       
    })
   }

  sortasc(event){
    let sortdes:Boolean
    if(this.viewlogid1==undefined)
    {
      if(event.direction=='asc')
      sortdes=true;
      else if(event.direction=='des')
      sortdes=false;
      if(event.direction!="")
      {
        if(event.active!='version')
        this.filteredLogs=this.filteredLogs.sort(function(a,b){
          let check_a=isNaN(a[event.active])?a[event.active].toUpperCase():a[event.active];
          let check_b=isNaN(b[event.active])?b[event.active].toUpperCase():b[event.active];
          if (sortdes==true)
            return (check_a > check_b) ? 1 : -1;
          else
            return (check_a < check_b) ? 1 : -1;
        },this);
      }
      else
      {
       // this.filteredLogs=[...this.allLogs.filter((item:any)=>item.version=this.filteredLogVersion)];
       this.filteredLogs=[...this.allLogs];
      }
      this.Viewloglist = new MatTableDataSource(this.filteredLogs);
      this.changeDetector.detectChanges();
      this.Viewloglist.sort=this.logsSort;
      // this.Viewloglist.paginator=this.logsPaginator
    }
    else(this.viewlogid1!=undefined)
    {
      if(event.direction=='asc')
        sortdes=true;
      else if(event.direction=='des')
        sortdes=false;
      if(event.direction!=""){
        let allRuns=[...this.allRuns.sort(function(a,b){
          let check_a=isNaN(a[event.active])?a[event.active].toUpperCase():a[event.active];
          let check_b=isNaN(b[event.active])?b[event.active].toUpperCase():b[event.active];
          if (sortdes==true)
            return (check_a > check_b) ? 1 : -1;
          else
            return (check_a < check_b) ? 1 : -1;
        },this)];
      }
      this.logbyrunid = new MatTableDataSource(this.allRuns)
      this.changeDetector.detectChanges();
       this.logbyrunid.sort=this.logsSort;
      //  this.logbyrunid.paginator=this.logsPaginator
    }
  }

  sortLoopsIteration(event){
    this.loopIterations=this.loopIterations.sort(function(a,b){
      let check_a=isNaN(a[event.active])?a[event.active].toUpperCase():a[event.active];
      let check_b=isNaN(b[event.active])?b[event.active].toUpperCase():b[event.active];
      if (event.direction=='asc')
        return (check_a > check_b) ? 1 : -1;
      else if(event.direction=='desc')
        return (check_a < check_b) ? 1 : -1;
    },this);
    this.loopbyrunid = new MatTableDataSource(this.loopIterations);
    this.changeDetector.detectChanges();
    this.loopbyrunid.sort = this.loopsort
  }
  
  // IterationId(value){
  //  //clearInterval(this.interval2)
  //     this.fileteredLoopIterations=[...this.loopIterations.filter(item=>item.iterationId==value)];

  //    this.loopbyrunid = new MatTableDataSource(this.fileteredLoopIterations);

  //    this.changeDetector.detectChanges();


  // }
  
  showLoopIteration(e){
    clearInterval(this.interval)
    clearInterval(this.timeInterval)
    this.logsLoading=true;
    this.getLoopIterations(e);
    this.interval2= setInterval(()=>{
    this.getLoopIterations(e);
    },3000)
  }

  getLoopIterations(e){
    this.iterationsList=[]
    this.rest.getLooplogs(e.bot_id, e.version, e.run_id ).subscribe((response:any)=>{
      this.logsLoading= false;
      if(response.errorMessage==undefined)
      {
        this.loopIterations=[...response];
        this.loopIterations=this.loopIterations.sort((a,b) => b.iterationId > a.iterationId ? 1 : -1);
        this.loopIterations=[...this.loopIterations.filter((item:any)=>item.taskName != 'Loop-End')]
        this.selectedIterationTask=e;
        this.loopIterations.forEach(item=>{
          if(this.iterationsList.find(item2=>item2==item.iterationId)==undefined)
            this.iterationsList.push(item.iterationId)    
        })
        this.iterationsList=[...this.iterationsList.sort(function(a, b){return a - b})];
        this.selectedIterationId=this.iterationsList.length;
        // if((this.selectedIterationId==0 || this.selectedIterationId==undefined )&& this.iterationsList.length!=0)
        //   this.selectedIterationId=this.iterationsList[this.iterationsList.length-1];
        // this.fileteredLoopIterations=[...this.loopIterations.filter(item=>(item.iterationId==this.selectedIterationId))];
        this.loopbyrunid = new MatTableDataSource(this.loopIterations);
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
    })
  }

  showAutomatedLogs(taskData:any){
    this.getAutomationLogs(taskData)
    this.interval3=setInterval(()=>{
    this.getAutomationLogs(taskData)
    },3000)
  }

  getAutomationLogs(taskData:any){
    this.selectedAutomationTask=taskData;
    this.logsLoading=true;
    this.rest.getAutomationLogs(taskData.bot_id, taskData.version, taskData.run_id,taskData.task_id).subscribe((response:any)=>{
      this.logsLoading=false;
      if(response.errorMessage==undefined)
      {
        this.automationLogs=response;
        this.automationLogsTable=new MatTableDataSource([...this.automationLogs]);
      }
      else
      {
        Swal.fire("Error",response.errorMessage,"error");
      }
    },err=>{
      this.logsLoading=false
      Swal.fire("Error","Unable to get automation Logs","error")
    })
  }

  updateLog(element: any) {
    clearInterval(this.interval)
    clearInterval(this.timeInterval)
    clearInterval(this.interval3)
    clearInterval(this.interval2)
    this.logsLoading = true;
    this.rest.updateBotLog(element.bot_id, element.version, element.run_id).subscribe(data => {
      let response: any = data;
      this.logsLoading = false;
      if (response.errorMessage)
        Swal.fire("Error", response.errorMessage, "error");
      else
        Swal.fire("Success", response.status, "success");
      this.viewlogdata();
    });
  }


  autoRefresh(){
    this.viewlogid1=undefined;
    this.viewlogdata()
    this.logsLoading = true;
    this.timeInterval = setInterval(() => {
    this.viewlogdata()
      }, 3000)   
  }

  backtoPage(){
    this.viewlogid1=undefined
    clearInterval(this.interval)
    this.autoRefresh();
  }

  backtoRunid(){
    this.selectedIterationTask=undefined;
    this.selectedIterationId=0;
    clearInterval(this.interval)
    this.showLogsByRunId(this.botrunid,this.selectedLogVersion,this.logStatus)
    clearInterval(this.interval2)
  }

  backtoRunpage(){
    this.viewlogid1=undefined
    this.selectedAutomationTask=undefined;
    clearInterval(this.interval)
    this.autoRefresh();   
  }


  closeLogsOverlay()
  {
    this.selectedIterationTask==undefined;
    this.closeEvent.emit(null)
    this.logsmodal.hide()
  }

ngOnDestroy(): void {
  clearInterval(this.interval)
  clearInterval(this.timeInterval)
  clearInterval(this.interval3)
  clearInterval(this.interval2)
}

  
}
