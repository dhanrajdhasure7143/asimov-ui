
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {RestApiService} from '../../services/rest-api.service';
import {RpaStudioComponent} from '../rpa-studio/rpa-studio.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { DataTransferService } from "../../services/data-transfer.service";
import { Rpa_Home_Hints } from "../model/rpa-home-module-hints"
import * as $ from 'jquery';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rpa-home',
  templateUrl: './rpa-home.component.html',
  styleUrls: ['./rpa-home.component.css']
})
export class RpaHomeComponent implements OnInit {

  displayedColumns: string[] = ["botName","botType","department","botStatus"];
  
  displayedColumns2: string[] = ["processName","taskName","Assign","Operations"];
  dataSource1:MatTableDataSource<any>;
  dataSource2:MatTableDataSource<any>;
  public isDataSource: boolean;  
  public userRole:any = [];
  public isButtonVisible = false;
  public bot_list:any=[];
  public process_names:any=[];
  public selectedvalue:any;
  public selectedTab:number;
  @ViewChild("paginator1",{static:false}) paginator1: MatPaginator;
  @ViewChild("paginator2",{static:false}) paginator2: MatPaginator;
  @ViewChild("sort1",{static:false}) sort1: MatSort;
  @ViewChild("sort2",{static:false}) sort2: MatSort;
 
  constructor(private route: ActivatedRoute, private rest:RestApiService, private rpa_studio:RpaStudioComponent,private http:HttpClient, private dt:DataTransferService, private datahints:Rpa_Home_Hints,)
  { }



  ngOnInit() {
    this.userRole = localStorage.getItem("userRole")
    
    if(this.userRole.includes('SuperAdmin')){
      this.isButtonVisible = true;
    }else if(this.userRole.includes('Admin')){
      this.isButtonVisible = true;
    }else if(this.userRole.includes('RPA Admin')){
      this.isButtonVisible = true;
    }else{
      this.isButtonVisible = false;
    }

    let processId=undefined;
  
    this.dt.changeParentModule({"route":"/pages/rpautomation/home", "title":"RPA Studio"});
    this.dt.changeChildModule({"route":"/pages/rpautomation/home","title":"Home"});
    
    this.dt.changeHints(this.datahints.rpahomehints );
  
    this.getallbots();
    this.route.queryParams.subscribe(params => {
      processId=params;
      console.log(processId);
      if(this.isEmpty(processId))
      {
        this.getautomatedtasks(0);
        
        this.selectedTab=0;
        console.log(this.process_names)
      }
      else
      {
        this.getautomatedtasks(processId.processid);
        this.selectedTab=1;
        console.log(this.process_names)
      }
     }
    );





 }
  
 
 
 

  ngAfterViewInit() {
   
  }


  getallbots()
  {
    let response:any=[];
    
    this.rpa_studio.spinner.show()
    //http://192.168.0.7:8080/rpa-service/get-all-bots
    
    this.rest.getAllActiveBots().subscribe(botlist =>
    {
      response=botlist;
      this.bot_list=botlist;
      this.dataSource1= new MatTableDataSource(response);
      this.isDataSource = true;
      this.dataSource1.sort=this.sort1;
      this.dataSource1.paginator=this.paginator1;
      if(this.selectedTab==0)  
      this.rpa_studio.spinner.hide()
    })

   
  }


  getautomatedtasks(process)
  {
    let response:any=[];
    
    this.rpa_studio.spinner.show();
    this.rest.getautomatedtasks(process).subscribe(automatedtasks=>{
      response=automatedtasks;
      console.log(response.automationTasks);
      this.dataSource2= new MatTableDataSource(response.automationTasks);
      this.dataSource2.sort=this.sort2;
      this.dataSource2.paginator=this.paginator2; 
      if(process==0)
      {
        
        this.getprocessnames(undefined);
      }else
      {
        
        this.getprocessnames(process);
      }
      if(this.selectedTab==1)
      this.rpa_studio.spinner.hide() 
    })
  }



  getprocessnames(processId)
  {
    console.log(processId);
    this.rest.getprocessnames().subscribe(processnames=>{
      this.process_names=processnames;
      let processnamebyid;
      if(processId != undefined)
      {
        console.log(this.process_names)
        processnamebyid=this.process_names.find(data=>processId==data.processId);
        this.selectedvalue=processnamebyid.processName;
        this.applyFilter(this.selectedvalue);
        console.log(this.selectedvalue);
      }
      else
      {
        this.selectedvalue="";
      }
    })
  }


  applyFilter(filterValue: string) {
    
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    console.log(filterValue);
    this.dataSource2.filter = filterValue;
  }

  applyFilter1(filterValue: string) {
    
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    console.log(filterValue);
    this.dataSource1.filter = filterValue;
  }


  createoverlay()
  {
   
    this.rpa_studio.onCreate(0);
    //document.getElementById("create-bot").style.display ="block";
  }

  openload()
  {
    
    document.getElementById("load-bot").style.display ="block";
  }


  close()
  {
    document.getElementById("create-bot").style.display ="none";
    
    document.getElementById("load-bot").style.display ="none";

  }

  assignbot(id)
  { 
    let botId=$("#"+id+"__select").val();
    if(botId!=0)
    this.rest.assign_bot_and_task(botId,id).subscribe(data=>{
      let response:any=data;
      if(response.status!=undefined)
      {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title:response.status,
          showConfirmButton: false,
          timer: 2000
        })
      }
    })



  }


  createtaskbotoverlay(taskId)
  {
    this.rpa_studio.onCreate(taskId);
    //document.getElementById("create-bot").style.display ="block";
  }

  


  loadbotdata(botId)
  {
    this.rpa_studio.getloadbotdata(botId);
  }


  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }

}
