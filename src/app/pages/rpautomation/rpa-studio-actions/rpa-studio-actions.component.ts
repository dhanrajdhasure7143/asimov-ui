import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { RpaStudioWorkspaceComponent } from '../rpa-studio-workspace/rpa-studio-workspace.component';
import { RestApiService } from '../../services/rest-api.service';

class BotStatistics{
  New:string;
  Pause:string;
  Stop:string;
  Running:string;
  Success:string;
  Failure:string;
}

@Component({
  selector: 'app-rpa-studio-actions',
  templateUrl: './rpa-studio-actions.component.html',
  styleUrls: ['./rpa-studio-actions.component.css']
})
export class RpaStudioActionsComponent implements OnInit {
  public environment:any = [];
  public optionList : boolean = true;
  public playToggle : boolean = true;
  public playToggle1 : boolean = true;
  public environmentValue:any = []
  @Input('tabsArrayLength') public tabsArrayLength: number;
  @Input('botState') public botState: any;
  @Output() closeTabEvent = new EventEmitter<void>();
  @ViewChild('t',{static: false}) ngbTabset;
  @Input('tabsArray') public tabsArray: any[];
  @Input('tabActiveId') public tabActiveId: string;
  @ViewChild(RpaStudioWorkspaceComponent,{static: false}) childBotWorkspace: RpaStudioWorkspaceComponent;
  pause :any;
  resume :any;
  stop:any;
  listEnvironmentData:any =[];
  dropdownList: any = [];
  botStatisticsData: BotStatistics = new BotStatistics();
  constructor(private rest:RestApiService) { }

  ngOnInit() {
    this.rest.botStatistics().subscribe((Status:BotStatistics) =>{
      this.botStatisticsData =Status;
      console.log(this.botStatisticsData);
    })
    this.rest.listEnvironments().subscribe(data =>{  
      this.listEnvironmentData = data; 
    
    })
  }
  saveBotFunAct(){
    this.childBotWorkspace.saveBotFun();
  }
  executionAct(){
    this.childBotWorkspace.execution()
  }
  pauseBot(botId){
    this.rest.getUserPause(botId).subscribe(data =>{
      this.pause = data;
    })
  }
    resumeBot(botId){
      this.rest.getUserResume(botId).subscribe(data =>{
        this.resume = data;
      })
    }
    stopBot(botId){
     return this.stop;
    }
    }

