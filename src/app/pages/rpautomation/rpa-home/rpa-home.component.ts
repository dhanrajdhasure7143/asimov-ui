
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
  isTableHasData = true;
  filterSelectObj = [];
  filterValues = { };
  filterValues1 = {
    botName:'',
    botType:'',
    department:''
  };
  botNameFilter = new FormControl('');
  botTypeFilter = new FormControl('');
  departmentFilter = new FormControl('');
  displayedColumns: string[] = ["botName","version","botType","department","botStatus","description"];
  
  displayedColumns2: string[] = ["processName","taskName","Assign","status","successTask","failureTask","Operations"];
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
     // Object to create Filter for
    /* this.filterSelectObj = [
      {
        name: 'Bot Name',
        columnProp: 'botName',
        options: []
      }, {
        name: 'Type',
        columnProp: 'botType',
        options: []
      }, {
        name: 'Category',
        columnProp: 'department',
        options: []
      }
    ]*/
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
      this.dataSource1= new MatTableDataSource(response);
      this.isDataSource = true;
      this.dataSource1.sort=this.sort1;
      this.dataSource1.paginator=this.paginator1;
      this.dataSource1.data = response;
      this.dataSource1.filterPredicate = this.createFilter1();
      this.botNameFilter.valueChanges
      .subscribe(
        botName => {
          this.filterValues1.botName = botName;
          this.dataSource1.filter = JSON.stringify(this.filterValues1);
          if(this.dataSource1.filteredData.length > 0){
            this.isTableHasData = true;
          } else {
            this.isTableHasData = false;
          }
        }
      )
      /*this.botTypeFilter.valueChanges
      .subscribe(
        botType => {
          this.filterValues1.botType = botType;
          this.dataSource1.filter = JSON.stringify(this.filterValues1);
          if(this.dataSource1.filteredData.length > 0){
            this.isTableHasData = true;
          } else {
            this.isTableHasData = false;
          }
        }
      )*/
      this.departmentFilter.valueChanges
      .subscribe(
        department => {
          this.filterValues1.department = department;
          this.dataSource1.filter = JSON.stringify(this.filterValues1);
          if(this.dataSource1.filteredData.length > 0){
            this.isTableHasData = true;
          } else {
            this.isTableHasData = false;
          }
        }
      )
      /*this.filterSelectObj.filter((o) => {
        response.forEach(x => 
          {
         if(x.botType == 0)
         {
           x.botType="Attended"
         }
         if(x.botType == 1)
         {
          x.botType="Unattended"
         }
        });

        response.forEach(x =>
          {
            if(x.department == 1)
            {
              x.department = "Development";
            }
            if(x.department == 2)
            {
              x.department = "Hr";
            }
            if(x.department == 3)
            {
              x.department = "QA";
            }
          })
        o.options = this.getFilterObject(response, o.columnProp);
      });*/
      if(this.selectedTab==0)  
      this.rpa_studio.spinner.hide()
    })   
  }

  createFilter1(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.botName.toLowerCase().indexOf(searchTerms.botName) !== -1      
      && data.botType.toString().toLowerCase().indexOf(searchTerms.botType) !== -1
      && data.department.toString().toLowerCase().indexOf(searchTerms.department) !== -1;
    }
    return filterFunction;
  }

  
 /*getFilterObject(fullObj, key) {
    const uniqChk = [];
    fullObj.filter((obj) => {
      if (!uniqChk.includes(obj[key])) {
        uniqChk.push(obj[key]);
      }
      return obj;
    });
    return uniqChk;
  }

   // Called on Filter change
   filterChange(filter, event) {
    //let filterValues = {}
    console.log(filter.columnProp);
    this.filterValues[filter.columnProp] = event.target.value.trim().toLowerCase()
    console.log(this.filterValues);
    this.dataSource1.filterPredicate = this.createFilter();
    this.dataSource1.filter = JSON.stringify(this.filterValues)
  }

  // Custom filter method fot Angular Material Datatable
  createFilter() {
    let filterFunction = function (data: any, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      let isFilterSet = false;
      for (const col in searchTerms) {
        if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
        }
      }

      console.log(searchTerms);

      let nameSearch = () => {
        let found = false;
        if (isFilterSet) {
          for (const col in searchTerms) {
            searchTerms[col].trim().toLowerCase().split(' ').forEach(word => {
              if (data[col].toString().toLowerCase().indexOf(word) != -1 && isFilterSet) {
                found = true
              }
            });
          }
          return found
        } else {
          return true;
        }
      }
      return nameSearch()
    }
    return filterFunction
  }

  resetFilters() {
    this.filterValues = {}
    this.filterSelectObj.forEach((value, key) => {
      value.modelValue = undefined;
    })
    this.dataSource1.filter = "";
  }*/

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
      
    this.rpa_studio.spinner.hide();
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


}
