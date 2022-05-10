import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestApiService } from '../../services/rest-api.service';
import { RpaStudioComponent } from '../rpa-studio/rpa-studio.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-rpa-so-logs',
  templateUrl: './rpa-so-logs.component.html',
  styleUrls: ['./rpa-so-logs.component.css']
})
export class RpaSoLogsComponent implements OnInit {
  @ViewChild('logspopup' ,{static:false}) public logspopup:any;
  Viewloglist:MatTableDataSource<any>;
  @ViewChild("logsSort",{static:false}) logsSort:MatSort;
  @ViewChild("logsPaginator",{static:false}) logsPaginator:MatPaginator;
  displayedColumns: string[] = ['run_id','version','start_date','end_date', "bot_status"];
  logsmodalref:BsModalRef;
  public viewlogid1:any;
  selectedIterationTask:any=undefined;
  public logsLoading:Boolean=false;
  filteredLogs:any=[];
  iterationsList:any=[];
  public viewlogid:any;
  selectedIterationId:any=0;
  public logresponse:any=[];
  public respdata1:boolean = false;
  public selectedLogVersion:any;
  @Input ('savebotrespose') public savebotrespose:any;
  @Input ('filteredLogVersion') public filteredLogVersion:any;
  @Input ('AllVersionsList') public AllVersionsList:any=[];
  @ViewChild("paginator2",{static:false}) paginator2: MatPaginator;
  @ViewChild("sort2",{static:false}) sort2: MatSort;
  allLogs:any=[];
 public botrunid:any;
  public allRuns:any=[];
  public logflag:Boolean;
  logbyrunid:MatTableDataSource<any>;
  constructor( private modalService:BsModalService,
     private rest : RestApiService,
     private changeDetector:ChangeDetectorRef,
     private rpa_studio:RpaStudioComponent,private spinner:NgxSpinnerService) { }

  ngOnInit() {
    this.logflag=false;
    this.viewlogdata()
   
  }
 
  viewlogdata(){
    this.logsmodalref=this.modalService.show(this.logspopup, {class:"logs-modal"})
    this.viewlogid1=undefined;
    //document.getElementById("filters").style.display = "none";
   let response: any;
   let log:any=[];
   this.logresponse=[];
   this.rpa_studio.spinner.show()
   this.logsLoading=true;
  
    this.rest.getviewlogdata(this.savebotrespose.botId).subscribe(data =>{
      this.logresponse=data;
      console.log("res",this.logresponse)
      this.logsLoading=false;
      this.rpa_studio.spinner.hide()
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
     this.filteredLogs=[...this.allLogs.filter(item=>item.version==this.filteredLogVersion)];
     console.log("filteredLogs",this.filteredLogs)
     this.Viewloglist = new MatTableDataSource(this.filteredLogs);
     this.changeDetector.detectChanges();
     this.Viewloglist.sort=this.logsSort;
     this.Viewloglist.paginator=this.logsPaginator;
  },err=>{
    this.spinner.hide();
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
     // setTimeout(()=>{
     //   console.log(this.Viewloglist)
     //   console.log(this.logsPaginator)
     //   console.log(this.logsSort)
     //   this.Viewloglist.paginator=this.logsPaginator;
     //   this.Viewloglist.sort=this.logsSort;
     // },4000)
  }
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
}
