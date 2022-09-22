import {Input, Component, OnInit, QueryList,ViewChildren, OnDestroy } from '@angular/core';
import { RpaStudioComponent } from '../rpa-studio/rpa-studio.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-rpa-studio-designer',
  templateUrl: './rpa-studio-designer.component.html',
  styleUrls: ['./rpa-studio-designer.component.css']
})
export class RpaStudioDesignerComponent implements OnInit , OnDestroy{

  @Input('tabsArray') public tabsArray: any[];
  @Input('toolset') public templateNodes:any[];
  @ViewChildren("rpa_bot_instance") bot_instances:QueryList<any>;
  current_instance:any;
  toolset_instance:any;
  selected_tab_instance:any;
  userRole:any;
  checkCreate:Boolean=false; 
  freetrail: string;
  isProcessAnalyst:Boolean=false;
  version_type:any;
  comments:any;
  constructor(private rpa_studio:RpaStudioComponent, 
    private router:Router,
    private activeRoute:ActivatedRoute) { }

  ngOnInit() {
    this.userRole = localStorage.getItem("userRole")
    this.userRole = this.userRole.split(',');
    if(this.userRole.includes("User"))
      localStorage.setItem("isHeader","true");
    if(this.userRole.includes("Process Analyst"))
      this.isProcessAnalyst=true;
    this.freetrail=localStorage.getItem('freetrail')
  }

  ngAfterViewInit()
  {
    // localStorage.setItem("isHeader","true");
  }

  
  removetab(tab)
  {
    
    // localStorage.removeItem("bot_id");

    this.tabsArray.splice(this.tabsArray.indexOf(tab), 1)
  
    if(this.tabsArray.length==0)
    {
      //this.router.navigate(["pages/rpautomation/home"])  
      //this.router.navigate(["/pages/serviceOrchestration/home"])  
      this.activeRoute.queryParams.subscribe(data=>{
        let params:any=data;
        if(params.name!=undefined)
        {
          this.router.navigate(["/pages/serviceOrchestration/home"],{queryParams:{tab:3}})
        }else if(params.processId!=undefined)
        {
          this.router.navigate(["/pages/serviceOrchestration/home"],{queryParams:{processid:params.processId}})
        }else if(params.projectId!=undefined)
        {
          this.router.navigate(["/pages/rpautomation/home"])
        }
        else
        {
          this.router.navigate(["/pages/rpautomation/home"])
        }
      })
    }
    
    
  }


  change_active_bot(event)
  {
    this.current_instance=undefined;
    this.toolset_instance=undefined;
    this.rpa_studio.spinner.show();
    setTimeout(()=>{
      this.bot_instances.forEach((instance,index)=>{
        if(index==event.index)
        {
          this.toolset_instance=instance
          this.selected_tab_instance=instance;
          this.current_instance=instance.rpa_actions_menu;
          this.rpa_studio.spinner.hide();
          let url=window.location.hash;
          if(instance.botState.botId!=undefined)
            window.history.pushState("", "", url.split("botId")[0]+"botId="+instance.botState.botId);
          else
          {
            let botId=Base64.encode(JSON.stringify(this.tabsArray.find(item=>item.botName==instance.botState.botName)))
            window.history.pushState("", "", url.split("botId=")[0]+"botId="+botId);
          }
    
        }
      })
    },2000)
    
    
  }
  clear(){
    this.version_type='';
    this.comments=''
  }
  version_change(versionId)
  {
    this.current_instance.switchversion(versionId);
    let botName=this.current_instance.botState.botName
    this.selected_tab_instance=this.current_instance;
    this.rpa_studio.spinner.show();
    
    setTimeout(()=>{
      this.bot_instances.forEach((instance,index)=>{
        if(instance.botState.botName==botName)
        {
          this.toolset_instance=instance
          this.current_instance=instance.rpa_actions_menu;
          this.selected_tab_instance=instance;
          this.rpa_studio.spinner.hide();
        }
      })
    },2500)
  }

  removenodes()
  {
    localStorage.removeItem("bot_id")
    if(localStorage.getItem('project_id')!="null"){
      this.router.navigate(["/pages/projects/projectdetails"], 
     {queryParams:{"id":localStorage.getItem('project_id')}})
    
    }else{
      $(".bot-close").click();
    }
  }

  auditLogs(){
    let botId=this.current_instance.savebotrespose.botId;
    let catergoryId=this.current_instance.savebotrespose.categoryId
    this.router.navigate(["/pages/rpautomation/auditlogs"],{queryParams:{botId:botId,catergoryId:catergoryId}})
    //this.current_instance.getAuditLogs()
  }

  navigateToBack()
  {
    
    this.activeRoute.queryParams.subscribe(data=>{
      let params:any=data;
      if(params.projectId!=undefined)
      {
        this.router.navigate(["/pages/projects/projectdetails"],{queryParams:{id:params.projectId}})
      }else
      {
        this.router.navigate(["/pages/rpautomation/home"])
      }
    })
  }

  ngOnDestroy()
  {
    localStorage.removeItem("bot_id")
  }
  SaveBot(){
    this.current_instance.saveBotFunAct(this.version_type,this.comments)
  }
}
