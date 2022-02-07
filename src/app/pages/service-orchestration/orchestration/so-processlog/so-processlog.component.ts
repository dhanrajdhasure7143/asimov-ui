import { Component, OnInit,Input, ViewChild, Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {RestApiService} from '../../../services/rest-api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NewSoAutomatedTasksComponent } from '../new-so-automated-tasks/new-so-automated-tasks.component';
import { NgxSpinnerService } from 'ngx-spinner';
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
  public loadLogsFlag:Boolean=false;
  @ViewChild("paginatorp1",{static:false}) paginatorp1: MatPaginator;
  @ViewChild("paginatorp2",{static:false}) paginatorp2: MatPaginator;
  @ViewChild("paginatorp3",{static:false}) paginatorp3: MatPaginator;
  @ViewChild("sortp1",{static:false}) sortp1: MatSort;
  @ViewChild("sortp2",{static:false}) sortp2: MatSort;
  @ViewChild("sortp3",{static:false}) sortp3: MatSort;
  public dataSourcep1: MatTableDataSource<any>;
  public dataSourcep2: MatTableDataSource<any>;
  public Environments:any;
  public dataSourcep3: MatTableDataSource<any>;
  public respdata1: boolean = false;
  displayedColumnsp1: string[] = ["processRunId","Environment","processStartDate","processEndDate","runStatus"];
  displayedColumnsp2: string[] = ['bot_name','version','run_id','start_date','end_date', "bot_status"]; //,'log_statement'
  displayedColumnsp3: string[] = ['task_name','start_date','end_date', 'status','error_info' ];
  constructor( private rest:RestApiService, private changeDetectorRef: ChangeDetectorRef,private automated:NewSoAutomatedTasksComponent, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    document.getElementById("viewlogid1").style.display="none";
    document.getElementById("plogrunid").style.display="none";
    document.getElementById("pbotrunid").style.display="none";
    this.Environments=this.automated.environments;
    this.getprocesslog();

  }

  getprocesslog(){
    
    let logbyrunidresp1:any;
    let resplogbyrun1: any = [];

    if(this.processId != '' && this.processId != undefined)
    {
    this.logresponse=[];
    this.spinner.show()
    
    document.getElementById("viewlogid1").style.display = "block";
    this.loadLogsFlag=true;
    this.rest.getProcesslogsdata(this.processId).subscribe(data =>{
      this.spinner.hide();
      this.loadLogsFlag=false
        this.logresponse = data;
        if(this.logresponse.length >0)
        {
          this.respdata1 = false;
        }else
        {
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
       
        this.dataSourcep1.paginator=this.paginatorp1;

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
    this.getprocesslog()
    document.getElementById("plogrunid").style.display = "none";
    document.getElementById("viewlogid1").style.display = "block";
  }

  backpbotrunid(){
    
    this.getprocessrunid(this.selected_processRunId)
    document.getElementById("pbotrunid").style.display = "none";
    document.getElementById("plogrunid").style.display = "block";
  }
  public selected_processRunId:any;
  getprocessrunid(processRunId){
    this.selected_processRunId=processRunId;
    let logbyrunidresp: any;
    let resplogbyrun = [];
    let processId = this.logresponse.find(data =>data.processRunId == processRunId).processId;
    this.spinner.show();
    
    document.getElementById("viewlogid1").style.display="none";
    document.getElementById("plogrunid").style.display="block";
    this.loadLogsFlag=true

    this.rest.getprocessruniddata(processId,processRunId).subscribe(data =>{
      this.spinner.hide();
      this.loadLogsFlag=false;
      this.runidresponse = data;
      if(this.runidresponse.length >0)
        {
          this.respdata2 = false;
        }else
        {
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
      this.dataSourcep2.paginator=this.paginatorp2;
    });
    //console.log(processRunId);
  }

  public selected_runid:any;
  ViewlogByrunid(runid){
    
    this.selected_runid=runid;
    let responsedata:any=[];
    let logbyrunidresp1:any;
    let resplogbyrun1:any=[];
    let PbotId = this.runidresponse.find(data =>data.run_id == runid).bot_id;
    let pversion = this.runidresponse.find(data =>data.run_id == runid).version;
    this.spinner.show()
    document.getElementById("plogrunid").style.display="none";
    document.getElementById("pbotrunid").style.display="block";
    this.loadLogsFlag=true
    this.rest.getViewlogbyrunid(PbotId,pversion,runid).subscribe((data)=>{
      this.spinner.hide();
      this.loadLogsFlag=false;
      responsedata = data;
      if(responsedata.length >0)
      {
        this.respdata2 = false;
      }else
      {
        this.respdata2 = true;
      }
      responsedata.forEach(rlog=>{
        logbyrunidresp1=rlog;
        logbyrunidresp1["start_date"]=logbyrunidresp1.start_time;
        logbyrunidresp1["end_date"]=logbyrunidresp1.end_time;
        logbyrunidresp1.start_time=logbyrunidresp1.start_time;
        logbyrunidresp1.end_time=logbyrunidresp1.end_time;

        resplogbyrun1.push(logbyrunidresp1)
      });
      //this.logflag=true;
      this.dataSourcep3 = new MatTableDataSource(resplogbyrun1);
      this.changeDetectorRef.detectChanges();
      this.dataSourcep3.sort=this.sortp3;
      this.dataSourcep3.paginator=this.paginatorp3;

        })
    }

    kill_bot_run(bot)
    {
      this.rest.updateBotLog(bot.bot_id,bot.version,bot.run_id).subscribe((res)=>{
        this.getprocessrunid(this.selected_processRunId);
      })
    }


    kill_process_run(processid, runid)
    {
      this.rest.kill_process_log(processid, runid).subscribe(data=>{
        this.getprocesslog();
      })
    }
}



