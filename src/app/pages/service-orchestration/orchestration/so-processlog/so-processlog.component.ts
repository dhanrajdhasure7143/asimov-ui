import { Component, OnInit,Input, ViewChild, Pipe, PipeTransform, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {RestApiService} from '../../../services/rest-api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NewSoAutomatedTasksComponent } from '../new-so-automated-tasks/new-so-automated-tasks.component';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-so-processlog',
  templateUrl: './so-processlog.component.html',
  styleUrls: ['./so-processlog.component.css']
})
export class SoProcesslogComponent implements OnInit {

  @Input('processId') public processId: any;
  public logresponse: any;
  public viewlogid1: any;
  public plogrunid:any;
  public runidresponse:any;
  public respdata2: boolean = false;
  public respdata3: boolean = false;
  public loadLogsFlag:boolean=false;
  @ViewChild("paginator1",{static:false}) paginator1: MatPaginator;
  @ViewChild("paginator2",{static:false}) paginator2: MatPaginator;
  @ViewChild("paginator3",{static:false}) paginator3: MatPaginator;
  @ViewChild("sortp1",{static:false}) sortp1: MatSort;
  @ViewChild("sortp2",{static:false}) sortp2: MatSort;
  @ViewChild("sortp3",{static:false}) sortp3: MatSort;
  public dataSourcep1: MatTableDataSource<any>;
  public dataSourcep2: MatTableDataSource<any>;
  public Environments:any;
  public dataSourcep3: MatTableDataSource<any>;
  public dataSourcep4: MatTableDataSource<any>;
  public respdata1: boolean = false;
  public interval: any = 0;
  public displayedColumnsp1: string[] = ["processRunId","Environment","processStartDate","processEndDate","runStatus"];
  public displayedColumnsp2: string[] = ['bot_name','version','run_id','start_date','end_date', "bot_status"]; //,'log_statement'
  public displayedColumnsp3: string[] = ['task_name','start_date','end_date', 'status','error_info' ];
  public displayedColoumnsp4: string[] =['taskName','iterationId','status','startTS','endTS',"errorMsg"];;
  public interval1: any = 0;
  public interval2: any = 0;
  public interval4:any;
  public selected_processRunId:any;
  public selected_runid:any;
  public logstatus:any;
  public iterationsList:any=[];
  public loopIterations:any=[];
  constructor( private rest:RestApiService, private changeDetectorRef: ChangeDetectorRef,private automated:NewSoAutomatedTasksComponent, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    document.getElementById("viewlogid1").style.display="none";
    document.getElementById("plogrunid").style.display="none";
    document.getElementById("pbotrunid").style.display="none";
    document.getElementById("loopStartLogs").style.display="none";
    this.Environments=this.automated.environments;
    //this.setProcesslog();
    this.getprocesslog()
  }

  // setProcesslog(){
  //   clearInterval(this.interval2)
  //   this.getprocesslog()
  //   this.loadLogsFlag=true;
  //   this.interval  = setInterval(()=> { 
  //     this.getprocesslog()
  //   }, 3000);
    
  // }

  getprocesslog(){
    let logbyrunidresp1:any;
    let resplogbyrun1: any = [];
    if(this.processId != '' && this.processId != undefined){
    this.logresponse=[];
    document.getElementById("viewlogid1").style.display = "block";
    this.loadLogsFlag=true
    this.rest.getProcesslogsdata(this.processId).subscribe(data =>{
        this.logresponse = data;
        this.loadLogsFlag=false
        if(this.logresponse.length >0){
          this.respdata1 = false;
        }else {
          this.respdata1 = true;
        }
        this.logresponse.forEach(rlog=>{
          logbyrunidresp1=rlog;
          logbyrunidresp1["processStartDate"]=logbyrunidresp1.processStartTime;
          logbyrunidresp1["processEndDate"]=logbyrunidresp1.processEndTime;
          logbyrunidresp1.processStartTime=logbyrunidresp1.processStartTime;
          logbyrunidresp1.processEndTime=logbyrunidresp1.processEndTime;
          resplogbyrun1.push(logbyrunidresp1)
        });
        this.runidresponse = resplogbyrun1;
        this.runidresponse.sort((a,b) => a.processRunId > b.processRunId ? -1 : 1);
        this.dataSourcep1 =  new MatTableDataSource(this.runidresponse);
        this.changeDetectorRef.detectChanges();
        this.dataSourcep1.sort=this.sortp1;
        this.dataSourcep1.paginator=this.paginator1;
    });
    }
  }

  Processlogclose(){
    document.getElementById("viewlogid1").style.display = "none";
  }

  Processlogclose2(){
    document.getElementById("plogrunid").style.display = "none";
  }

  Processlogclose3(){
    document.getElementById("pbotrunid").style.display = "none";
  }

  backplogrid(){
    document.getElementById("plogrunid").style.display = "none";
    document.getElementById("viewlogid1").style.display = "block";
    //clearInterval(this.interval1)
    //this.setProcesslog()
    this.getprocesslog()
  }

  backpbotrunid(){
    this.getprocessrunid(this.selected_processRunId)
    document.getElementById("pbotrunid").style.display = "none";
    document.getElementById("plogrunid").style.display = "block";
    // clearInterval(this.interval1)
  }

  // setProcessByRunID(processRunId,runStatus){
  //   clearInterval(this.interval)
  //   this.getprocessrunid(processRunId)
  //   this.logstatus=runStatus
  // //   this.loadLogsFlag=true
  // //   if(runStatus == "Running" || runStatus == "New" ){
  // //   // this.interval2=setInterval(()=>{
  // //   // this.getprocessrunid(processRunId)
  // //   // },3000)
  // // }
  // }


  getprocessrunid(processRunId){
    this.selected_processRunId=processRunId;
    let logbyrunidresp: any;
    let resplogbyrun = [];
    let processId = this.logresponse.find(data =>data.processRunId == processRunId).processId;
    document.getElementById("viewlogid1").style.display="none";
    document.getElementById("plogrunid").style.display="block";
    this.loadLogsFlag=true
    this.rest.getprocessruniddata(processId,processRunId).subscribe(data =>{
      this.runidresponse = data;
      this.loadLogsFlag=false;
      if(this.runidresponse.length >0) {
          this.respdata2 = false;
        }else{
          this.respdata2 = true;
        }
      this.runidresponse.forEach(rlog=>{
        logbyrunidresp=rlog;
        logbyrunidresp["start_date"]=logbyrunidresp.start_time;
        logbyrunidresp["end_date"]=logbyrunidresp.end_time;
        logbyrunidresp.start_time=logbyrunidresp.start_time;
        logbyrunidresp.end_time=logbyrunidresp.end_time;
        resplogbyrun.push(logbyrunidresp)
      });
      this.runidresponse = resplogbyrun;
      this.changeDetectorRef.detectChanges();
      this.dataSourcep2 = new MatTableDataSource(this.runidresponse);
      this.dataSourcep2.sort=this.sortp2;
      this.dataSourcep2.paginator=this.paginator2;
      resplogbyrun = [];
    });
  }

  // setLogByRunID(runid,bot_status){
  //   clearInterval(this.interval2)
  //   this.ViewlogByrunid(runid)
  //   this.loadLogsFlag=true
  //   if(bot_status == "Running" || bot_status == "New" ){
  //   this.interval1=  setInterval(()=>{
  //     this.ViewlogByrunid(runid)
  //   },3000)
  // }
  // }

  ViewlogByrunid(runid){
    this.selected_runid=runid;
    let responsedata:any=[];
    let logbyrunidresp1:any;
    let resplogbyrun1:any=[];
    let PbotId = this.runidresponse.find(data =>data.run_id == runid).bot_id;
    let pversion = this.runidresponse.find(data =>data.run_id == runid).version;
    document.getElementById("plogrunid").style.display="none";
    document.getElementById("pbotrunid").style.display="block";
    
    this.loadLogsFlag=true
    this.rest.getViewlogbyrunid(PbotId,pversion,runid).subscribe((data)=>{
      responsedata = data;
      this.loadLogsFlag=false;
      if(responsedata.length >0){
        this.respdata2 = false;
      }else{
        this.respdata2 = true;
      }
      let flag=0;
      let updatedTaskList:any=[...responsedata.map(rlog=>{
        logbyrunidresp1=rlog;
        logbyrunidresp1["start_date"]=logbyrunidresp1.start_time;
        logbyrunidresp1["end_date"]=logbyrunidresp1.end_time;
        logbyrunidresp1.start_time=logbyrunidresp1.start_time;
        logbyrunidresp1.end_time=logbyrunidresp1.end_time;
        return logbyrunidresp1;
        //resplogbyrun1.push(logbyrunidresp1)
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
      })];
      this.dataSourcep3 = new MatTableDataSource(updatedTaskList);
      this.changeDetectorRef.detectChanges();
      this.dataSourcep3.sort=this.sortp3;
      this.dataSourcep3.paginator=this.paginator3;
      resplogbyrun1 = [];
        })
    }

    kill_bot_run(bot)
    {
      this.rest.updateBotLog(bot.bot_id,bot.version,bot.run_id).subscribe((res)=>{
        this.getprocessrunid(this.selected_processRunId);
      })
    }


    kill_process_run(processid,envid,runid)
    {
      this.rest.kill_process_log(processid,envid,runid).subscribe(data=>{
        this.getprocesslog();
      })
    }

    // ngOnDestroy(): void {
    //   clearInterval(this.interval)
    //   clearInterval(this.interval1)
    //   clearInterval(this.interval2)
    //   clearInterval(this.interval4)
    // }


    // setLoopLogs(element){
    //   this.loadLogsFlag=true
    //   this.interval4=setInterval(()=>{
    //     this.getLoopLogs(element);
    //   },3000)
    // }


    selectedLoopTask:any;
    getLoopLogs(element){
      this.iterationsList=[]
      this.loadLogsFlag=true
      this.rest.getLooplogs(element.bot_id, element.version, element.run_id ).subscribe((response:any)=>{
        this.loadLogsFlag=false;
        this.selectedLoopTask=element;
        if(response.errorMessage==undefined)
        {
          this.loopIterations=[...response];
          this.loopIterations=this.loopIterations.sort((a,b) => b.iterationId > a.iterationId ? 1 : -1);
          this.loopIterations=[...this.loopIterations.filter((item:any)=>item.taskName != 'Loop-End')]
          //this.selectedIterationTask=e;
          this.loopIterations.forEach(item=>{
            if(this.iterationsList.find(item2=>item2==item.iterationId)==undefined)
              this.iterationsList.push(item.iterationId)    
          })
          this.iterationsList=[...this.iterationsList.sort(function(a, b){return a - b})];
          
          // if((this.selectedIterationId==0 || this.selectedIterationId==undefined )&& this.iterationsList.length!=0)
          //   this.selectedIterationId=this.iterationsList[this.iterationsList.length-1];
          // this.fileteredLoopIterations=[...this.loopIterations.filter(item=>(item.iterationId==this.selectedIterationId))];
          this.dataSourcep4 = new MatTableDataSource(this.loopIterations);
          document.getElementById('pbotrunid').style.display='none';
          document.getElementById('loopStartLogs').style.display='block';
        }
        else
        {
          Swal.fire("Error",response.errorMessage,"error");
        }      
      },err=>{
        this.loadLogsFlag=false;
        Swal.fire("Error","Unable to open loop logs","error");
      })
    }

    backtasktable()
    {
      // clearInterval(this.interval4)
      document.getElementById("loopStartLogs").style.display = "none";
      document.getElementById("pbotrunid").style.display = "block";
    }
}



