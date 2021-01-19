import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { ActivatedRoute, Router} from "@angular/router";
import { HttpClient } from '@angular/common/http';
import {Rpa_Hints} from "../model/RPA-Hints";
import { DataTransferService } from "../../services/data-transfer.service";
@Component({
  selector: 'app-rpa-workspace',
  templateUrl: './rpa-workspace.component.html',
  styleUrls: ['./rpa-workspace.component.css']
})
export class RpaWorkspaceComponent implements OnInit {
public workspaces:any;
public manualtasks:any =[];
public automationtasks:any=[];
public others:any=[];
public orchestrations:any=[];
public dataas;
public id:any;
public startbot:Boolean;
public pausebot:Boolean;

constructor(private api:RestApiService ,private route:ActivatedRoute, private router:Router, private dt:DataTransferService, private hints:Rpa_Hints) {}
  
  ngOnInit() 
  {
    try{
      
    this.dt.changeHints(this.hints.rpaworkspacehints1 );
      this.route.queryParams.subscribe(data => {
        if(data.processid==undefined)
        {
          this.id="";
        }else
        {
          this.id=data.processid;
        }
      })
    }catch(err){
      
    }
    if(this.id=="")
    { this.getallservices(0);
    }
    else
    {
       this.getallservices(this.id);
    }
    this.getallorcservices();
    
  }

  async getallservices(processid:any)
  {
      await this.api.getAllRpaWorkSpaces(processid).subscribe(data=>{
      
      this.workspaces=data;
      if(typeof this.workspaces.manualTasks !== 'undefined')
      {
        this.workspaces.manualTasks.forEach(manual =>{this.manualtasks.push(manual);})
      }  
      if(typeof this.workspaces.automationTasks !== 'undefined')
      { 
        this.workspaces.automationTasks.forEach(automation =>{ this.automationtasks.push(automation)})
      }

    })
  }
  async getallorcservices()
  {
      await this.api.getAllOrcRpaWorkSpaces().subscribe(data=>{
        this.orchestrations=data;
    })
  }
  
  
  navigatetocreate() 
  {
    localStorage.setItem('enablecreate', "true");
    this.router.navigate(["/pages/rpautomation/home"]);
  }

}
