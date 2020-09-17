
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
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-rpa-home',
  templateUrl: './rpa-home.component.html',
  styleUrls: ['./rpa-home.component.css']
})
export class RpaHomeComponent implements OnInit {
  public isTableHasData = true;
  public respdata1=false;
  displayedColumns: string[] = ["botName","version","botType","department","botStatus","description"];
  displayedColumns2: string[] = ["processName","taskName","Assign","status","successTask","failureTask","Operations"];
  departmentlist :string[] = ['Development','QA','HR'];
  botNameFilter = new FormControl('');
  botTypeFilter = new FormControl('');
  departmentFilter = new FormControl('');
  filteredValues: MyFilter = { department: [], botName: ''};
  dataSource1:MatTableDataSource<any>;
  dataSource2:MatTableDataSource<any>;
  public isDataSource: boolean;  
  public userRole:any = [];
  public isButtonVisible = false;
  public bot_list:any=[];
  public process_names:any=[];
  public selectedvalue:any;
  public selectedTab:number;
  public responsedata;
  @ViewChild("paginator1",{static:false}) paginator1: MatPaginator;
  @ViewChild("paginator2",{static:false}) paginator2: MatPaginator;
  @ViewChild("sort1",{static:false}) sort1: MatSort;
  @ViewChild("sort2",{static:false}) sort2: MatSort;
 
  constructor(private route: ActivatedRoute, private rest:RestApiService, private rpa_studio:RpaStudioComponent,private http:HttpClient, private dt:DataTransferService, private datahints:Rpa_Home_Hints,)
  { 
    
  }



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
    //this.dataSource1.filterPredicate = this.createFilter();
    this.dt.changeParentModule({"route":"/pages/rpautomation/home", "title":"RPA Studio"});
    this.dt.changeChildModule({"route":"/pages/rpautomation/home","title":"RPA Home"});
    
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

  assignreset(id)
  { 
    let botId=$("#"+id+"__select").val();
    if(botId!=0)
      {
        $("#"+id+"__select").prop('selectedIndex',0);
      }
  }

  getallbots()
  {
    let response:any=[];
    
    this.rpa_studio.spinner.show()
    //http://192.168.0.7:8080/rpa-service/get-all-bots
    
    this.rest.getAllActiveBots().subscribe(botlist =>
    {
      response=botlist;
      response.forEach(data=>{
        let object:any=data;
        if(data.botType==0)
        {
          object.botType='Attended'
        }
        else if(data.botType==1)
        {
          object.botType='Unattended';
        }
        this.bot_list.push(object)  
      })
      response.forEach(data=>{
        let object:any=data;
        if(data.department==1)
        {
          object.department='Development'
        }
        else if(data.department==2)
        {
          object.department='HR';
        }
        else if(data.department==3)
        {
          object.department='QA';
        }
        this.bot_list.push(object)  
      })
      this.bot_list=botlist;
      if(this.bot_list.length >0)
      {
        this.respdata1 = false;
        console.log(this.respdata1)
      }else
      {
        this.respdata1 = true;
        console.log(this.respdata1);
      }
      this.dataSource1= new MatTableDataSource(response);
      this.isDataSource = true;
      this.dataSource1.sort=this.sort1;
      this.dataSource1.paginator=this.paginator1;
      this.dataSource1.data = response;
      this.departmentFilter.valueChanges.subscribe((departmentFilterValue) => {
        this.filteredValues['department'] = departmentFilterValue;
        this.dataSource1.filter = JSON.stringify(this.filteredValues);
        if(this.dataSource1.filteredData.length > 0){
          this.isTableHasData = true;
        } else {
          this.isTableHasData = false;
        }
        });
    
        this.botNameFilter.valueChanges.subscribe((botNameFilterValue) => {
          this.filteredValues['botName'] = botNameFilterValue;
          this.dataSource1.filter = JSON.stringify(this.filteredValues);
          if(this.dataSource1.filteredData.length > 0){
            this.isTableHasData = true;
          } else {
            this.isTableHasData = false;
          }
        });
    
      this.dataSource1.filterPredicate = this.customFilterPredicate();
      if(this.selectedTab==0)  
      this.rpa_studio.spinner.hide()
    })   
  }

  customFilterPredicate() {
    return (data: dataSource1, filter: string): boolean => {
      let searchString = JSON.parse(filter) as MyFilter;
      let isdepartmentAvailable = false;
      
      if (searchString.department.length) {
        
        for (const d of searchString.department) {
          if (data.department.toString().trim().indexOf(d) !== -1)  {
            isdepartmentAvailable = true;
          }
        }
      } else {
        isdepartmentAvailable = true;
      }
      return isdepartmentAvailable && data.botName.toString().trim().toLowerCase().indexOf(searchString.botName.toLowerCase()) !== -1;
    }
  }

  getautomatedtasks(process)
  {
    let response:any=[];
    
    this.rpa_studio.spinner.show();
    this.rest.getautomatedtasks(process).subscribe(automatedtasks=>{
      response=automatedtasks;
      this.responsedata=response.automationTasks;
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
      this.update_task_status();
     
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
        this.selectedvalue=processnamebyid.processId;
        this.applyFilter(this.selectedvalue);
        console.log(this.selectedvalue);
      }
      else
      {
        this.selectedvalue="";
      }
    })
  }


  applyFilter(filterValue:any) {
    console.log(filterValue)
    
    let processnamebyid=this.process_names.find(data=>filterValue==data.processId);
    this.selectedvalue=filterValue;
    filterValue = processnamebyid.processName.trim(); // Remove whitespace
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

  /*openload()
  {
    
    document.getElementById("load-bot").style.display ="block";
  }*/


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



  resetbot(taskid:any)
  {
    $("#"+taskid+"__select").val((this.responsedata.find(data=>data.taskId==taskid).botId));
  }
  

  startprocess()
  {
    
    if(this.selectedvalue!=undefined)
    {
    this.rpa_studio.spinner.show();
    this.rest.startprocess(this.selectedvalue).subscribe(data=>{
      let response:any=data;
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title:response.status,
        showConfirmButton: false,
        timer: 2000
      })
      this.rpa_studio.spinner.hide();
    },(err)=>{
      console.log(err)
      this.rpa_studio.spinner.hide();
    })
  }
  }


  resettasks()
  {
    
    this.rpa_studio.spinner.show();
    this.rest.getautomatedtasks(0).subscribe(response=>{
      let data:any=response;
      this.dataSource2= new MatTableDataSource(data.automationTasks);
      this.dataSource2.sort=this.sort2;
      this.dataSource2.paginator=this.paginator2; 
      if(this.selectedvalue==undefined)
      {
        this.applyFilter(this.selectedvalue)
      }
      
      this.rpa_studio.spinner.hide();
    });
  }



  update_task_status()
  {
    let timer= setInterval(() => { 
      this.rest.getautomatedtasks(0).subscribe(response=>{
        let responsedata:any=response;
        responsedata.automationTasks.forEach(statusdata=>{
          let data:any;
          if(statusdata.status=="InProgress")
          {
            data="<span class='text-primary'><img src='../../../../assets/images/RPA/processloading.svg' style='height:25px'></span>&nbsp;<span class='text-primary'>"+statusdata.status+"</span>";
          }else if(statusdata.status=="Success")
          {
            //data="<img src='../../../../assets/images/RPA/processloading.svg' style='height:30px'>";
          
            data='<span class="text-success"><i class="fa fa-check" aria-hidden="true"></i></span>&nbsp;<span class="text-success">Success</span>';  
          }
          else if(statusdata.status=="Failed")
          {
            data='<span class="text-danger"><i class="fa fa-times" aria-hidden="true"></i></span>&nbsp;<span class="text-danger">Failed</span>';  
          }
          else if(statusdata.status=="New")
          {
            data="<span><img src='/assets/images/RPA/newicon.png' style='height:20px' ></span>&nbsp;<span class='text-primary'>"+statusdata.status+"</span>";
          }
          else if(statusdata.status=="")
          {
            data="---";
          }
          console.log(data);
          $("#"+statusdata.taskId+"__status").html(data);
          
          $("#"+statusdata.taskId+"__failed").html(statusdata.failureTask)
          
          $("#"+statusdata.taskId+"__success").html(statusdata.successTask)
        
        })
        
      })
    }, 5000);
  }


}
export interface dataSource1 {
  department: string;
  botName: string;
}

export interface MyFilter {
  department: string[],
  botName: string,
}