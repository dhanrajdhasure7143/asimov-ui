import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
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
export class RpaSoLogsComponent implements OnInit {
  @Input('logsmodalref') public logsmodal: BsModalRef;
  Viewloglist:MatTableDataSource<any>;
  @ViewChild("logsSort",{static:false}) logsSort:MatSort;
  @ViewChild("logsPaginator",{static:false}) logsPaginator:MatPaginator;
  displayedColumns: string[] = ['run_id','version','start_date','end_date', "bot_status"];
  displayedColumns1: string[] = ['task_name', 'status','start_date','end_date','error_info' ];
  displayedloopColumns:string[]=['taskName','status','startTS','endTS',"errorMsg"];
  automationLogColoumns:string[]=['internaltaskName','startTS','endTS', 'status','errorMsg']
  public viewlogid1:any;
  selectedIterationTask:any=undefined;
  public logsLoading:Boolean=false;
  filteredLogs:any=[];
  iterationsList:any=[];
  public viewlogid:any;
  selectedIterationId:any=0;
  public logresponse:any=[];
  public respdata1:boolean = false;
  fileteredLoopIterations:any=[];
  public selectedLogVersion:any;
  filteredLogVersion:any;
  public selectedAutomationTask:any=undefined;
  @Input ('logsbotid') public logsbotid:any;
  @Input ('AllVersionsList') public AllVersionsList:any=[];
  @Input('selectedversion') public selectedversion:any;
  @ViewChild("paginator2",{static:false}) paginator2: MatPaginator;
  @ViewChild("sort2",{static:false}) sort2: MatSort;
  allLogs:any=[];
 public botrunid:any;
  public allRuns:any=[];
  loopIterations:any=[];
  logbyrunid:MatTableDataSource<any>;
  loopbyrunid:MatTableDataSource<any>;
  automationLogs:any=[];
  automationLogsTable:MatTableDataSource<any>;
  constructor( private modalService:BsModalService,
     private rest : RestApiService,
     private changeDetector:ChangeDetectorRef,private spinner:NgxSpinnerService) { }

  ngOnInit() {
    this.AllVersionsList=this.AllVersionsList.map(item=>{return item.vId});
    this.filteredLogVersion=this.selectedversion
    this.viewlogdata()
   
  }
 
  viewlogdata(){
  
    this.viewlogid1=undefined;
    //document.getElementById("filters").style.display = "none";
   let response: any;
   let log:any=[];
   this.logresponse=[];
   this.logsLoading=true;
    this.rest.getviewlogdata(this.logsbotid).subscribe(data =>{
      this.logresponse=data;
      console.log("res",this.logresponse)
      this.logsLoading=false;
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
     log.sort((a,b) => a.run_id > b.run_id ? -1 : 1);
     this.allLogs=log;
     console.log("filteredLogVersion",this.filteredLogVersion)
     this.filteredLogs=[...this.allLogs.filter(item=>item.version==this.filteredLogVersion)];
     console.log("filteredLogs",this.filteredLogs)
     this.Viewloglist = new MatTableDataSource(this.filteredLogs);
     this.changeDetector.detectChanges();
     this.Viewloglist.sort=this.logsSort;
     this.Viewloglist.paginator=this.logsPaginator;
  },err=>{
    this.logsLoading=false;
    Swal.fire("Error","unable to get logs","error")
  });
  }
  changeLogVersion(event)
  {
    this.filteredLogVersion=event.target.value;
     this.filteredLogs=[...this.allLogs.filter(item=>item.version==this.filteredLogVersion)];
     let logs=[...this.filteredLogs]
     this.Viewloglist = new MatTableDataSource(logs);
     this.changeDetector.detectChanges();
  }
  ViewlogByrunid(runid,version){
    this.botrunid=runid;
    this.selectedLogVersion=version
    let responsedata:any=[];
    let logbyrunidresp:any;
    let resplogbyrun:any=[];
   
    this.logsLoading=true;
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
       console.log("runs",this.allRuns)
       this.logbyrunid = new MatTableDataSource(resplogbyrun);
       this.changeDetector.detectChanges();
       this.logbyrunid.paginator=this.paginator2;
       this.logbyrunid.sort=this.sort2
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
  sortasc(event)
  {
    let sortdes:Boolean
    console.log(event)
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
        this.filteredLogs=[...this.allLogs.filter((item:any)=>item.version=this.filteredLogVersion)];
      }
      this.Viewloglist = new MatTableDataSource(this.filteredLogs);
      this.changeDetector.detectChanges();
      this.Viewloglist.sort=this.logsSort;
      this.Viewloglist.paginator=this.logsPaginator
    }
    else(this.viewlogid1!=undefined)
    {
      if(event.direction=='asc')
        sortdes=true;
      else if(event.direction=='des')
        sortdes=false;
      if(event.direction!="")
      {
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
       this.logbyrunid.paginator=this.logsPaginator
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
        // if((this.selectedIterationId==0 || this.selectedIterationId==undefined )&& this.iterationsList.length!=0)
        //   this.selectedIterationId=this.iterationsList[this.iterationsList.length-1];
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


  getAutomationLogs(taskData:any)
  {
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

  updateLog(element: any,Logtemplate: any)
   {
    
    this.logsLoading=true;
     this.rest.updateBotLog(element.bot_id,element.version,element.run_id).subscribe(data=>{
        let response:any=data;  
        this.logsLoading=false;
        if(response.status==undefined)
          this.viewlogdata();
        else
          Swal.fire("Success",response.status,"success");
          this.viewlogdata();
     });
   }

  sortAutomateSap()
  {
    
  }

}
