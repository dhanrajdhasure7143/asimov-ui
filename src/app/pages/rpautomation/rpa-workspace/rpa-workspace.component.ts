import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { ActivatedRoute,} from "@angular/router";
import { HttpClient } from '@angular/common/http';
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
constructor(private api:RestApiService,private http:HttpClient,private route:ActivatedRoute) {}
  
  ngOnInit() 
  {
    try{

      this.route.queryParams.subscribe(data => {
        console.log(data)
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
    {
      console.log(this.id);
      this.getallservices(0);
    }
    else
    { 
      console.log(this.id)
      this.getallservices(this.id);
    }
    
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
      if(typeof this.workspaces.others !== 'undefined')
      {
        this.workspaces.others.forEach(automation =>{ this.others.push(automation)})  
      }
      if(typeof this.workspaces.orchestration !== 'undefined')
      { 
        this.workspaces.orchestration.forEach(automation =>{ this.orchestrations.push(automation)})  
      }

    })
  }
  



}
