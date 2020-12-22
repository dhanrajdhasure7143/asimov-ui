import { Component, OnInit,Input, ViewChild, Pipe, PipeTransform } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {RestApiService} from '../../../services/rest-api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {SoAutomatedTasksComponent} from "../so-automated-tasks/so-automated-tasks.component"
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
  displayedColumnsp2: string[] = ['bot_name','version','run_id','start_date','end_date', "bot_status"];
  displayedColumnsp3: string[] = ['task_name','start_date','end_date', 'status','error_info' ];
  constructor( private rest:RestApiService, private automated:SoAutomatedTasksComponent) { }

  ngOnInit() {
    document.getElementById("viewlogid1").style.display="none";
    document.getElementById("plogrunid").style.display="none";
    document.getElementById("pbotrunid").style.display="none";
    this.Environments=this.automated.environments
    this.getprocesslog();

  }

  getprocesslog(){
    let logbyrunidresp1:any;
    let resplogbyrun1: any = [];
    if(this.processId != '')
    {
    this.logresponse=[];
    this.rest.getProcesslogsdata(this.processId).subscribe(data =>{
        this.logresponse = data;
        console.log(this.logresponse);
        if(this.logresponse.length >0)
        {
          this.respdata1 = false;
          console.log(this.respdata1)
        }else
        {
          this.respdata1 = true;
          console.log(this.respdata1);
        }
        this.logresponse.forEach(rlog=>{
          logbyrunidresp1=rlog;
          console.log(logbyrunidresp1);
          logbyrunidresp1["processStartDate"]=logbyrunidresp1.processStartTime;
          logbyrunidresp1["processEndDate"]=logbyrunidresp1.processEndTime;
          logbyrunidresp1.processStartTime=logbyrunidresp1.processStartTime;
          logbyrunidresp1.processEndTime=logbyrunidresp1.processEndTime;

          resplogbyrun1.push(logbyrunidresp1)
        });
        console.log(resplogbyrun1);
        this.runidresponse = resplogbyrun1;

        this.runidresponse.sort((a,b) => a.processRunId > b.processRunId ? -1 : 1);
        this.dataSourcep1 =  new MatTableDataSource(this.runidresponse);
        console.log(this.dataSourcep1);
        this.dataSourcep1.sort=this.sortp1;
        this.dataSourcep1.paginator=this.paginatorp1;
        document.getElementById("viewlogid1").style.display = "block";

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
  }

  backpbotrunid(){
    document.getElementById("pbotrunid").style.display = "none";
    document.getElementById("plogrunid").style.display = "block";
  }

  getprocessrunid(processRunId){
    console.log(processRunId);
    let logbyrunidresp: any;
    let resplogbyrun = [];
    let processId = this.logresponse.find(data =>data.processRunId == processRunId).processId;
    console.log(processId);
    this.rest.getprocessruniddata(processId,processRunId).subscribe(data =>{
      this.runidresponse = data;
      console.log(this.runidresponse);
      if(this.runidresponse.length >0)
        {
          this.respdata2 = false;
          console.log(this.respdata2)
        }else
        {
          this.respdata2 = true;
          console.log(this.respdata2);
        }
      this.runidresponse.forEach(rlog=>{
        logbyrunidresp=rlog;
        console.log(logbyrunidresp);
       logbyrunidresp["start_date"]=logbyrunidresp.start_time;
        logbyrunidresp["end_date"]=logbyrunidresp.end_time;
        logbyrunidresp.start_time=logbyrunidresp.start_time;
        logbyrunidresp.end_time=logbyrunidresp.end_time;

        resplogbyrun.push(logbyrunidresp)
      });
      console.log(resplogbyrun);
      this.runidresponse = resplogbyrun;
      this.dataSourcep2 = new MatTableDataSource(this.runidresponse);
      this.dataSourcep2.sort=this.sortp2;
      this.dataSourcep2.paginator=this.paginatorp2;
      document.getElementById("viewlogid1").style.display="none";
      document.getElementById("plogrunid").style.display="block";
      console.log(this.dataSourcep2);


    });
    //console.log(processRunId);
  }

  ViewlogByrunid(runid){
    console.log(runid);
    let responsedata:any=[];
    let logbyrunidresp1:any;
    let resplogbyrun1:any=[];
    let PbotId = this.runidresponse.find(data =>data.run_id == runid).bot_id;
    let pversion = this.runidresponse.find(data =>data.run_id == runid).version;
    this.rest.getViewlogbyrunid(PbotId,pversion,runid).subscribe((data)=>{
      responsedata = data;
      if(responsedata.length >0)
      {
        this.respdata2 = false;
        console.log(this.respdata3)
      }else
      {
        this.respdata2 = true;
        console.log(this.respdata3);
      }
      console.log(responsedata);
      responsedata.forEach(rlog=>{
        logbyrunidresp1=rlog;
        logbyrunidresp1["start_date"]=logbyrunidresp1.start_time;
        logbyrunidresp1["end_date"]=logbyrunidresp1.end_time;
        logbyrunidresp1.start_time=logbyrunidresp1.start_time;
        logbyrunidresp1.end_time=logbyrunidresp1.end_time;

        resplogbyrun1.push(logbyrunidresp1)
      });
      console.log(resplogbyrun1);
      //this.logflag=true;
      this.dataSourcep3 = new MatTableDataSource(resplogbyrun1);
      console.log(this.dataSourcep3);
      this.dataSourcep3.sort=this.sortp3;
      this.dataSourcep3.paginator=this.paginatorp3;
      document.getElementById("plogrunid").style.display="none";
      document.getElementById("pbotrunid").style.display="block";
        })
    }

}



