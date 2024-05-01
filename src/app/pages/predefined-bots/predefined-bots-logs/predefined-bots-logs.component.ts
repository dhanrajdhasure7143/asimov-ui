import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
// import {RestApiService} from '../../../services/rest-api.service';
import { MessageService } from 'primeng/api';
import { filter, map } from 'rxjs/operators';
import moment from 'moment';
import { columnList } from 'src/app/shared/model/table_columns';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ClipboardService } from 'ngx-clipboard';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { PredefinedBotsService } from '../../services/predefined-bots.service';

@Component({
  selector: 'app-predefined-bots-logs',
  templateUrl: './predefined-bots-logs.component.html',
  styleUrls: ['./predefined-bots-logs.component.css']
})
export class PredefinedBotsLogsComponent implements OnInit {
  @Input('processId') public processId: any;
  @Input('environments') public environments: any[];
  @Output("closeEvent") public closeEvent: any = new EventEmitter<any>()
  @Input() logsData: any;
  @Input() predefinedOrchestrationBotId: number;
  processRuns: any = [];
  botLogsByRunId: any = [];
  taskLogsByBot: any = [];
  childLogsByTask: any = [];
  columnList: any = [];
  logsLoading: boolean = false;
  display: boolean = true;
  errormsg = "";
  // logsData:any=[]
  statusColors = {
    New: '#3CA4F3',
    Failure: '#FE665D',
    Success: '#4BD963',
    Killed: "#B91C1C",
    Stopped: '#FE665D',
    Running: "#FFA033"
  };
  isDataEmpty: boolean = false;
  traversalLogs: any = [];
  logsDisplayFlag: any = "";
  selectedRun: any;
  selectedBot: any;
  selectedTask: any;
  selectedAutomationTask: any;
  selectedIterationTask: any;
  @ViewChild('overlayPanel') overlayPanel: OverlayPanel;
  isCopied: boolean = false;
  copyTimer = null;
  constructor(
    private rest: PredefinedBotsService,
    private changeDetectorRef: ChangeDetectorRef,
    // private messageService:MessageService,
    private columns_list: columnList,
    private clipboardService: ClipboardService,
    private toastService: ToasterService,
    private toastMessages: toastMessages
  ) { }
  ngOnInit() {
    this.getProcessRuns();
  }

  getProcessRuns() {
    this.logsLoading = true;
    this.rest.getPredefinedBotLogs(this.predefinedOrchestrationBotId).subscribe((data: any) => {
      let response = data;
      if (response.code == 4200) {
        this.logsLoading = false;
        this.columnList = this.columns_list.predefined_orchestration_process_runs_columns;
        this.logsDisplayFlag = "RUNS";
        this.logsData = response.data;
      } else {
        this.logsLoading = false;
        this.toastService.showError(response.errorMessage)
      }
    }, error => {
      this.logsLoading = false;
      this.toastService.showError(this.toastMessages.OopsErr)
    }
    );
  }

  getBotLogsByRunId(runData: any) {
    // this.logsLoading=true;
    // this.rest.getprocessruniddata(runData.processId, runData.processRunId).pipe(filter(data => Array.isArray(data)),map(data=>this.updateVersion(data)),map(data=>this.updateDateFormat(data, ["end_time", "start_time"]))).subscribe((response:any)=>{
    //   this.logsLoading=false;
    //   if(this.validateErrorMessage(response)) return (this.logsData=[]);
    //   this.selectedRun=runData;
    //   this.logsDisplayFlag="LOGS";
    //   this.columnList=this.columns_list.orchestration_process_logs_columns;
    //   this.logsData=response;
    // },err=>{
    //   this.handleException(err)
    // })
  }

  getTaskLogsByBot(botData: any) {
    // this.logsLoading=true;
    // this.rest.getViewlogbyrunid(botData.bot_id,botData.versionNew,botData.run_id,botData.version).pipe(filter(data => Array.isArray(data)),map(data=>this.updateVersion(data)),map(data=>this.updateDateFormat(data, ["end_time", "start_time"]))).subscribe((response:any)=>{
    //   this.logsLoading=false;
    //   if(this.validateErrorMessage(response)) return (this.logsData=[]);
    //   this.logsDisplayFlag="BOT-LOGS";
    //   this.selectedBot=botData;
    //   this.columnList=this.columns_list.orchestration_bot_logs_columns;
    //   let flag=0;
    //   this.logsData=[...response.filter((item:any)=>{
    //     if(item.task_name=='Loop-Start')
    //     {
    //       flag=1;
    //       return item;
    //     }
    //     if(item.task_name=='Loop-End') flag=0;
    //     if(flag==0) return item;
    //   })];

    // },err=>{
    //   this.handleException(err);
    // })
  }

  getChildLogs(logs, logId, taskId, iterationId, type) {
    // this.logsLoading=true;
    // this.rest.getChildLogs(logs, logId, taskId, iterationId,this.selectedBot.versionNew,this.selectedBot.version).pipe(filter(data => Array.isArray(data)),map(data=>this.updateDateFormat(data, ["end_time", "start_time"]))).subscribe((response:any)=>{
    //   this.logsLoading=false;
    //   this.columnList=this.columns_list.orchestration_child_logs_columns;
    //   this.logsDisplayFlag="CHILD-LOGS";
    //   if(this.validateErrorMessage(response)) return (this.logsData=[]);
    //   if(type=='FARWORD') this.traversalLogs.push(logs);
    //   this.selectedTask=logs;
    //   this.selectedTask["actual_task_id"]=taskId;
    //   this.selectedTask["actual_log_id"]=logId;
    //   this.selectedTask["actual_iteration_id"]=iterationId;
    //   this.logsData=[...response];
    // },err=>{
    //   this.handleException(err);
    // })
  }

  getLoopLogs(element) {
    // this.logsLoading=true;
    // this.rest.getLooplogs(element.bot_id, element.version, element.run_id ).pipe(filter(data => Array.isArray(data)),map(data=>this.updateDateFormat(data, ["endTs", "startTs"]), map(data=>this.updateStatus(data,"status")))).subscribe((response:any)=>{
    //   this.logsLoading=false;

    //   this.logsDisplayFlag="LOOP-LOGS";    
    //   this.columnList=[
    //     {ColumnName:"taskName",DisplayName:"Task Name",ShowFilter: false,width:"flex: 0 0 7rem",filterType:"text"},
    //     {ColumnName:"iterationId",DisplayName:"Iteration Id",ShowFilter: false,width:"",filterType:"text"},
    //     {ColumnName:"startTs",DisplayName:"Start Date",ShowFilter: false,width:"",filterType:"date"},
    //     {ColumnName:"endTs",DisplayName:"End Date",ShowFilter: false,width:"",filterType:"date"},
    //     {ColumnName:"status",DisplayName:"Status",ShowFilter: false,width:"",filterType:"text"},
    //     {ColumnName:"errorMsg",DisplayName:"Error Info",ShowFilter: false,width:"",filterType:"text"}
    //   ];
    //   if(this.validateErrorMessage(response)) return (this.logsData=[]);
    //   this.logsData=response;
    // },err=>{
    //   this.handleException(err);
    // })
  }


  getAutomationLogs(logData: any) {
  }

  killRun(log) {
    // this.logsLoading=true;
    // this.rest.kill_process_log(log.processId, log.envId, log.processRunId).subscribe(response=>{
    //   if(this.validateErrorMessage(response))return;
    //   this.getProcessRuns();

    // },err=>{
    //   this.logsLoading=false;
    //   // this.messageService.add({severity:'error',summary:'Error',detail:err?.error?.message??"Unable to kill run"})
    //   this.toastService.showError(err?.error?.message??"Unable to kill run");
    //   console.log(err);
    // })
  }

  getColor(status) {
    return this.statusColors[status] ? this.statusColors[status] : '';
  }

  closeLogsOverlay() {
    this.display = false;
    this.closeEvent.emit({ close: true });
  }

  backTraversalLogs() {
    let logData: any = (this.traversalLogs.pop());
    this.traversalLogs.splice(0, this.traversalLogs.findIndex((item => item == logData)));
    if (logData.parent_log_id != null && logData.parent_task_id != null)
      this.getChildLogs(logData, logData.parent_log_id, logData.parent_task_id, logData.parent_iteration_id, "BACKWARD");
    else
      this.getTaskLogsByBot(this.selectedBot);
  }

  assignEnvironmentNamesToProcessRuns = (runs: any) => {
    runs = runs.map((item: any) => {
      for (let i = 0; i < this.environments.length; i++)
        if (this.environments[i]["environmentId"] == item.envId)
          item["environmentName"] = this.environments[i]["environmentName"];
      item["processStartTime"] = item.processStartTime != null ? (moment(item.processStartTime).format("MMM DD, yyyy, HH:mm:ss")) : item.processStartTime;
      return item;
    })
    return runs;
  }

  updateDateFormat = (logs, columnArray) => {
    logs = logs.map((item: any) => {
      columnArray.forEach((dateItem: any) => {
        item[dateItem] = item[dateItem] != null ? (moment(item[dateItem]).format("MMM DD, yyyy, HH:mm:ss")) : item[dateItem];
      })
      return item;
    })
    return logs;
  }

  updateVersion = (logs: any) => {
    logs = logs.map((item: any) => {
      item["modifiedVersionNew"] = "V" + parseFloat(item["versionNew"]).toFixed(1);
      return item;
    })
    return logs
  }
  updateStatus = (logs, column) => {
    logs = logs.map((item: any) => {
      if (item[column] == 1)
        item[column] = "New";
      if (item[column] == 2)
        item[column] = "Running";
      if (item[column] == 3)
        item[column] = "Paused";
      if (item[column] == 4)
        item[column] = "Stopped";
      if (item[column] == 5)
        item[column] = "Success";
      if (item[column] == 6)
        item[column] = "Failed";
      return item;
    })
    return logs;
  }

  validateErrorMessage(response: any) {
    // return (response.errorMessage)?(this.isDataEmpty=true,this.messageService.add({severity:'error',summary:'Error',detail:response.errorMessage})):false;    
    return (response.errorMessage) ? (this.isDataEmpty = true, this.toastService.showError(response.errorMessage)) : false;
  }

  handleException = (err) => {
    //  return (this.isDataEmpty=true,this.messageService.add({severity:'error',summary:'Error',detail:err?.error?.message??"Unable to fetch data"}),this.logsLoading=false);
    return (this.isDataEmpty = true, this.toastService.showError(err?.error?.message ?? "Unable to fetch data"), this.logsLoading = false);
  }
  copyToClipboard(value, event) {
    if (this.copyTimer !== null) {
      // If a timer is active, clear it to cancel the previous setTimeout
      clearTimeout(this.copyTimer);
      this.copyTimer = null;
    }

    this.clipboardService.copy(value);
    this.overlayPanel.show(event);

    // Set a new setTimeout and store the timer ID in the this.copyTimer variable
    this.copyTimer = setTimeout(() => {
      this.overlayPanel.hide();
      this.copyTimer = null; // Reset the timer variable when the setTimeout completes
    }, 2000);
  }

}
