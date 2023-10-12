import { Component, OnInit,Input, ChangeDetectorRef, OnDestroy, Output, EventEmitter} from '@angular/core';
import {RestApiService} from '../../../services/rest-api.service';
import { MessageService } from 'primeng/api';
import { filter, map } from 'rxjs/operators';
import moment from 'moment';
import {columnList}  from '../../../../shared/model/table_columns'
@Component({
  selector: 'app-so-processlog',
  templateUrl: './so-processlog.component.html',
  styleUrls: ['./so-processlog.component.css'],
  providers:[columnList]
})
export class SoProcesslogComponent implements OnInit {

  @Input('processId') public processId: any;
  @Input('environments') public environments:any[];
  @Output("closeEvent") public closeEvent:any=new EventEmitter<any>()
  processRuns:any=[];
  botLogsByRunId:any=[];
  taskLogsByBot:any=[];
  childLogsByTask:any=[];
  columnList:any=[];
  logsLoading:boolean=false;
  display:boolean=true;
  errormsg="";
  logsData:any=[]
  statusColors = {
    New: '#3CA4F3',
    Failure: '#FE665D',
    Success: '#4BD963',
    Killed:"#B91C1C",
    Stopped: '#FE665D',
    Running:"#FFA033"
  };
  isDataEmpty:boolean=false;
  traversalLogs:any=[];
  logsDisplayFlag:any="";
  selectedRun:any;
  selectedBot:any;
  selectedTask:any;
  selectedAutomationTask:any;
  selectedIterationTask:any;
  constructor( private rest:RestApiService, 
    private changeDetectorRef: ChangeDetectorRef,
    private messageService:MessageService,
    private columns_list:columnList
    ) { }
  ngOnInit() {
    this.getProcessRuns();
  }

    getProcessRuns(){
      this.logsLoading=true;
      this.rest.getProcesslogsdata(this.processId).pipe(filter(data => Array.isArray(data)),map(runs=>this.assignEnvironmentNamesToProcessRuns(runs))).subscribe((response:any) =>{
        this.logsLoading=false;
        if(this.validateErrorMessage(response)) return (this.logsData=[]);
        this.columnList=this.columns_list.orchestration_process_runs_columns;
        this.logsDisplayFlag="RUNS";
        this.processRuns=response;
        this.logsData=response;
       },(err=>{
        this.handleException(err);
       }));
    }

    getBotLogsByRunId(runData:any){
      this.logsLoading=true;
      this.rest.getprocessruniddata(runData.processId, runData.processRunId).pipe(filter(data => Array.isArray(data)),map(data=>this.updateVersion(data)),map(data=>this.updateDateFormat(data, ["end_time", "start_time"]))).subscribe((response:any)=>{
        this.logsLoading=false;
        if(this.validateErrorMessage(response)) return (this.logsData=[]);
        this.selectedRun=runData;
        this.logsDisplayFlag="LOGS";
        this.columnList=this.columns_list.orchestration_process_logs_columns;
        this.logsData=response;
      },err=>{
        this.handleException(err)
      })
    }
    
    getTaskLogsByBot(botData:any){
      this.logsLoading=true;
      this.rest.getViewlogbyrunid(botData.bot_id,botData.version,botData.run_id).pipe(filter(data => Array.isArray(data)),map(data=>this.updateVersion(data)),map(data=>this.updateDateFormat(data, ["end_time", "start_time"]))).subscribe((response:any)=>{
        this.logsLoading=false;
        if(this.validateErrorMessage(response)) return (this.logsData=[]);
        this.logsDisplayFlag="BOT-LOGS";
        this.selectedBot=botData;
        this.columnList=this.columns_list.orchestration_bot_logs_columns;
        let flag=0;
        this.logsData=[...response.filter((item:any)=>{
          if(item.task_name=='Loop-Start')
          {
            flag=1;
            return item;
          }
          if(item.task_name=='Loop-End') flag=0;
          if(flag==0) return item;
        })];
        
      },err=>{
        this.handleException(err);
      })
    }

    getChildLogs(logs,logId, taskId, iterationId, type){
      this.logsLoading=true;
      this.rest.getChildLogs(logs, logId, taskId, iterationId).pipe(filter(data => Array.isArray(data)),map(data=>this.updateDateFormat(data, ["end_time", "start_time"]))).subscribe((response:any)=>{
        this.logsLoading=false;
        this.columnList=this.columns_list.orchestration_child_logs_columns;
        this.logsDisplayFlag="CHILD-LOGS";
        if(this.validateErrorMessage(response)) return (this.logsData=[]);
        if(type=='FARWORD') this.traversalLogs.push(logs);
        this.selectedTask=logs;
        this.selectedTask["actual_task_id"]=taskId;
        this.selectedTask["actual_log_id"]=logId;
        this.selectedTask["actual_iteration_id"]=iterationId;
        this.logsData=[...response];
      },err=>{
        this.handleException(err);
      })
    }

    getLoopLogs(element){
      this.logsLoading=true;
      this.rest.getLooplogs(element.bot_id, element.version, element.run_id ).pipe(filter(data => Array.isArray(data)),map(data=>this.updateDateFormat(data, ["endTs", "startTs"]), map(data=>this.updateStatus(data,"status")))).subscribe((response:any)=>{
        this.logsLoading=false;

        this.logsDisplayFlag="LOOP-LOGS";    
        this.columnList=[
          {ColumnName:"taskName",DisplayName:"Task Name",ShowFilter: false,width:"flex: 0 0 7rem",filterType:"text"},
          {ColumnName:"iterationId",DisplayName:"Iteration Id",ShowFilter: false,width:"",filterType:"text"},
          {ColumnName:"startTs",DisplayName:"Start Date",ShowFilter: false,width:"",filterType:"date"},
          {ColumnName:"endTs",DisplayName:"End Date",ShowFilter: false,width:"",filterType:"date"},
          {ColumnName:"status",DisplayName:"Status",ShowFilter: false,width:"",filterType:"text"},
          {ColumnName:"errorMsg",DisplayName:"Error Info",ShowFilter: false,width:"",filterType:"text"}
        ];
        if(this.validateErrorMessage(response)) return (this.logsData=[]);
        this.logsData=response;
      },err=>{
        this.handleException(err);
      })
    }


    getAutomationLogs(logData:any){
    }

    killRun(log){
      this.rest.kill_process_log(log.processId, log.envId, log.runId).subscribe(data=>{
        this.getProcessRuns();
      },err=>{
        console.log(err)
      })
    }

    getColor(status) {
      return this.statusColors[status]?this.statusColors[status]:'';
    }

    closeLogsOverlay(){
      this.display=false;
      this.closeEvent.emit({close:true});
    }

    backTraversalLogs(){
      let logData:any=(this.traversalLogs.pop());
      this.traversalLogs.splice(0,this.traversalLogs.findIndex((item=>item==logData)));
      if(logData.parent_log_id!=null && logData.parent_task_id!=null)
        this.getChildLogs(logData, logData.parent_log_id,logData.parent_task_id,logData.parent_iteration_id, "BACKWARD");
      else
        this.getTaskLogsByBot(this.selectedBot);
    }

    assignEnvironmentNamesToProcessRuns=(runs:any)=>{
      runs=runs.map((item:any)=>{
        for(let i=0;i<this.environments.length;i++)
          if(this.environments[i]["environmentId"]==item.envId)
            item["environmentName"]=this.environments[i]["environmentName"];
        item["processStartTime"]=item.processStartTime!=null?(moment(item.processStartTime).format("MMM DD, yyyy, HH:mm:ss")):item.processStartTime;
        item["versionNew"]="V"+item["versionNew"];
        return item;
      })
      return runs;
    }

    updateDateFormat=(logs , columnArray)=>{
      logs=logs.map((item:any)=>{
        columnArray.forEach((dateItem:any)=>{
          item[dateItem]=item[dateItem]!=null?(moment(item[dateItem]).format("MMM DD, yyyy, HH:mm:ss")):item[dateItem];
        })
        return item;
      })
      return logs;
    }

    updateVersion=(logs:any)=>{
      logs=logs.map((item:any)=>{
        item["versionNew"]="V"+item["versionNew"];
        return item;
      })
      return logs
    }
    updateStatus=(logs, column)=>{
      logs=logs.map((item:any)=>{
          if(item[column]==1)
          item[column]="New";
          if(item[column]==2)
          item[column]="Running";
          if(item[column]==3)
          item[column]="Paused";
          if(item[column]==4)
          item[column]="Stopped";
          if(item[column]==5)
          item[column]="Success";
          if(item[column]==6)
          item[column]="Failed";
          return item;
      })
      return logs;
    }

    validateErrorMessage(response:any){
      return (response.errorMessage)?(this.isDataEmpty=true,this.messageService.add({severity:'error',summary:'Error',detail:response.errorMessage})):false;    
    }

    handleException=(err)=>{
     return (this.isDataEmpty=true,this.messageService.add({severity:'error',summary:'Error',detail:err?.error?.message??"Unable to fetch data"}),this.logsLoading=false);
    }
  
}




