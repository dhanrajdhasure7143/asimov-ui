import {Component, OnInit, QueryList,ViewChildren, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';
@Component({
  selector: 'app-rpa-studio-designer',
  templateUrl: './rpa-studio-designer.component.html',
  styleUrls: ['./rpa-studio-designer.component.css']
})
export class RpaStudioDesignerComponent implements OnInit , OnDestroy{
  @ViewChildren("designerInstances") designerInstances:QueryList<any>;
  current_instance:any;
  toolset_instance:any;
  selected_tab_instance:any;
  userRole:any;
  checkCreate:Boolean=false; 
  freetrail: string;
  isProcessAnalyst:Boolean=false;
  version_type:any;
  comments:any;
  toolsetItems:any=[];
  botsList:any=[];
  filteredBotsList:any=[];
  categoriesList:any=[];
  environmentsList:any=[];
  loadedBotsList:any=[];
  tabActiveId:any="";
  loadBotForm:FormGroup;
  toolsetSideNav:Boolean=false;
  predefinedBotsList:any=[];
  constructor(
    private router:Router,
    private activeRoute:ActivatedRoute,
    private rest:RestApiService,
    private spinner:NgxSpinnerService,
    private formGroup:FormBuilder,
    private activatedRoute:ActivatedRoute
    ) { }

  ngOnInit() {
    this.loadBotForm=this.formGroup.group({
      //botType:["",Validators.required],
      botDepartment:["",Validators.required],
      bot:["",Validators.required],
    })
    this.userRole = localStorage.getItem("userRole")
    this.userRole = this.userRole.split(',');
    if(this.userRole.includes("User"))
      localStorage.setItem("isHeader","true");
    if(this.userRole.includes("Process Analyst"))
      this.isProcessAnalyst=true;
    this.freetrail=localStorage.getItem('freetrail')
    this.getToolsetItems();
    this.getAllBots();
    this.getAllEnvironments();
    this.getAllCategories();
    this.getPredefinedBots();
  }

  ngAfterViewInit()
  {
    // localStorage.setItem("isHeader","true");
  }

  getToolsetItems()
  {
    this.spinner.show();
    this.rest.toolSet().subscribe((response:any)=>{
      //this.spinner.hide();
      if(response.errorMessage==undefined)
      {
          response.General.forEach(element => {
            let temp:any = {
              name : element.name,
              path : 'data:' + 'image/png' + ';base64,' + element.icon,
              tasks: element.taskList,
            };
              this.toolsetItems.push(temp)
          })
          if(!this.userRole.includes('User'))
          {
            response.Advanced.forEach(element => {
              let temp:any = {
                name : element.name,
                path : 'data:' + 'image/png' + ';base64,' + element.icon,
                tasks: element.taskList
              };
              this.toolsetItems.push(temp)
            });
          }


          this.activatedRoute.queryParams.subscribe(data=>{
            let params:any=data;
            if(params==undefined)
            {
              this.router.navigate(["home"])
            }
            else
            {
              let botId=params.botId;
              this.loadBotByBotId(botId);
            }
          })
      }
      else
      {
        this.spinner.hide();
        Swal.fire("Error",response.errorMessage, "error");
      }
    },err=>{
      this.spinner.hide();
      Swal.fire("Error","Unable to get toolset","error");
    })
  }

  getAllBots()
  {
    this.rest.getAllActiveBots().subscribe((response:any)=>{
      if(response.errorMessage==undefined)
        this.botsList=response
      else  
        Swal.fire("Error",response.errorMessage, "error")
    },err=>{
      Swal.fire("Error","Unable to load data","error");
    })
  }


  getAllEnvironments()
  {
      this.rest.listEnvironments().subscribe((response:any)=>{
        if(response.errorMessage==undefined)
        {
          this.environmentsList=response;
        }
        else
        {
          
          Swal.fire("Error",response.errorMessage,"error");
        }
      })
  }


  getAllCategories()
  {
    this.rest.getCategoriesList().subscribe((response:any)=>{
      if(response.errorMessage==undefined)
      {
        this.categoriesList=response.data;
      }
      else
      {
        Swal.fire("Error",response.errorMessage,"error");
      }
    })
  }


  loadBotByBotId(botId:any)
  {
    this.spinner.show()
    this.rest.getbotdata(botId).subscribe((response:any)=>{
      //this.spinner.hide();
      if(response.errorMessge==undefined)
      {
        if(this.loadedBotsList.find(data=>data.botName==response.botName)==undefined)
        {
          this.loadedBotsList.push(response);
          this.tabActiveId=response.botName;
          this.closeLoadBotFormOverlay();
          //this.spinner.hide();
          this.change_active_bot({index:0});
        }
        else
        {
          
          this.spinner.hide();
          if(localStorage.getItem('bot_id')=="null")
          Swal.fire("Warning","Selected Bot is already loaded","warning");
        }
      }
      else
      {
        Swal.fire("Error",response.errorMessage, "error");
      }
    },(err)=>{
      this.spinner.hide();
      Swal.fire("Error","Unable to load bot","error");
      //this.router.navigate(["/home"])
    })

  }

  resetLoadBotForm()
  {
    this.loadBotForm.reset();
    this.loadBotForm.get("bot").setValue("");
    this.loadBotForm.get("botDepartment").setValue("");
  }
  

  
  removetab(tab)
  {
    
    this.loadedBotsList.splice(this.loadedBotsList.indexOf(tab), 1)
    if(this.loadedBotsList.length==0)
    {
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
    
    this.toolsetSideNav=false;
    this.spinner.show();
    setTimeout(()=>{
      this.designerInstances.forEach((instance,index)=>{
        if(index==event.index)
        {
          this.current_instance=instance;
          this.spinner.hide();
          let url=window.location.hash;
          if(instance.finalbot!=undefined)
            window.history.pushState("", "", url.split("botId")[0]+"botId="+instance.finalbot.botId);
          // else
          // {
            // let botId=Base64.encode(JSON.stringify(this.loadedBotsList.find(item=>item.botName==instance.botState.botName)))
            // window.history.pushState("", "", url.split("botId=")[0]+"botId="+botId);
          //}
    
        }
      })
    },1500)
    
    
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
   // this.rpa_studio.spinner.show();
    
    setTimeout(()=>{
      this.designerInstances.forEach((instance,index)=>{
        if(instance.botState.botName==botName)
        {
          //this.toolset_instance=instance
          //this.current_instance=instance.rpa_actions_menu;
          this.selected_tab_instance=instance;
        //  this.rpa_studio.spinner.hide();
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
    let botId=this.current_instance.finalbot.botId;
    let catergoryId=this.current_instance.finalbot.categoryId
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
    this.current_instance.updateBotFun(this.version_type,this.comments)
  }

  onCreate()
  {

  }

  loadBotFormOverlay()
  {
    document.getElementById("load-bot").style.display='block';
  }

  closeLoadBotFormOverlay()
  {
    this.resetLoadBotForm();
    document.getElementById("load-bot").style.display="none";
  }

  onSubmitLoadBotFrom()
  {
    let botId=this.loadBotForm.get("bot").value;
    this.loadBotByBotId(botId)
  }

  filterBotListByCategory()
  {
    let botDepartment:any=this.loadBotForm.get("botDepartment").value;
    this.filteredBotsList=[...this.botsList.filter((item:any)=>item.department==botDepartment)];
  }


  getSelectedEnvironments()
  {
    return this.current_instance.filteredEnvironments.filter((item:any)=>item.check==true);
  }



  getPredefinedBots()
  {
    this.spinner.show()
    this.rest.getpredefinedbots().subscribe((response:any)=>{
      this.spinner.hide()
      if(response.errorMessage==undefined)
        this.predefinedBotsList=response
      else
        Swal.fire("Error",response.errorMessage,"error");
    },(err:any)=>{
      this.spinner.hide();
      Swal.fire("Error","Unable to get predefined bots","error")
    })
  }



}
