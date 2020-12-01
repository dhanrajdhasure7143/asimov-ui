import {ViewChild, Component, OnInit } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {RestApiService} from '../../../services/rest-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import Swal from 'sweetalert2';
declare var $:any;

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-so-automated-tasks',
  templateUrl: './so-automated-tasks.component.html',
  styleUrls: ['./so-automated-tasks.component.css']
})
export class SoAutomatedTasksComponent implements OnInit {
  public isTableHasData = true;
  public respdata1=false;
  displayedColumns: string[] = ["processName","taskName","Assign","status","successTask","failureTask","Operations"];
  dataSource2:MatTableDataSource<any>;
  public isDataSource: boolean;
  public userRole:any = [];
  public isButtonVisible = false;
  public bot_list:any=[];
  public process_names:any=[];
  public selectedvalue:any;
  public selectedTab:number;
  public responsedata;
  public selectedEnvironment:any='';
  public environments:any=[];
  public categaoriesList:any=[];
  @ViewChild("paginator10",{static:false}) paginator10: MatPaginator;
  @ViewChild("sort10",{static:false}) sort10: MatSort;

  constructor(
    private route: ActivatedRoute,
    private rest:RestApiService,
    private router: Router,
    private spinner:NgxSpinnerService,
   )
  {}



  ngOnInit() {

    this.spinner.show();
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
    this.getenvironments();
    this.getCategoryList();
    this.getallbots();
    this.route.queryParams.subscribe(params => {
      processId=params;
      console.log(processId);
      if(this.isEmpty(processId))
      {
        this.getautomatedtasks(0);
      }
      else
      {
        this.getautomatedtasks(processId.processid);
      }
      this.spinner.show()
      setTimeout(() => {
        this.spinner.hide()
      },4000)
     }
    );
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
    this.rest.getAllActiveBots().subscribe(botlist =>
    {
      this.bot_list=botlist;
    });
  }



  getautomatedtasks(process)
  {
    let response:any=[];
   // this.rest.getautomatedtasks(process).subscribe(automatedtasks=>{

    this.rest.getautomatedtasks(process).subscribe(automatedtasks=>{
      response=automatedtasks;
      this.responsedata=response.automationTasks;
      console.log(response.automationTasks);
      this.dataSource2= new MatTableDataSource(response.automationTasks);
      this.dataSource2.sort=this.sort10;
      this.dataSource2.paginator=this.paginator10;
      if(process==0)
      {
        this.getprocessnames(undefined);

      }else
      {
        this.getprocessnames(process);
      }
      this.update_task_status();

    },(err)=>{
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
        processnamebyid=this.process_names.find(data=>data.processId==processId);
        this.selectedvalue=processnamebyid.processId;
        this.applyFilter(this.selectedvalue);
        console.log(this.selectedvalue);

      }
      else
      {
        this.selectedvalue="";
      }
    },(err)=>{
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
    this.dataSource2.filter = filterValue;
  }



  createoverlay()
  {
    //this.rpa_studio.onCreate(0);
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
    //this.rpa_studio.onCreate(taskId);
    localStorage.setItem("taskId",taskId);
    this.router.navigate(["/pages/rpautomation/home"]);
    //document.getElementById("create-bot").style.display ="block";
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
    //this.rpa_studio.spinner.show();
    this.rest.startprocess(this.selectedvalue,this.selectedEnvironment).subscribe(data=>{
      let response:any=data;
      if(response.errorMessage==undefined){
      Swal.fire({
        icon: 'success',
        title:response.status,
        showConfirmButton: true,
      });
      this.update_task_status()
    }else
    {
      Swal.fire({
        icon: 'warning',
        title:response.errorMessage,
        showConfirmButton: true,
      })

    }
      //this.rpa_studio.spinner.hide();
      this.update_task_status();
    },(err)=>{
      console.log(err)
      //this.rpa_studio.spinner.hide();
    })
  }
  }


  resettasks()
  {

    //this.rpa_studio.spinner.show();
    this.rest.getautomatedtasks(0).subscribe(response=>{
      let data:any=response;
      this.dataSource2= new MatTableDataSource(data.automationTasks);
      this.dataSource2.sort=this.sort10;
      this.dataSource2.paginator=this.paginator10;
      if(this.selectedvalue==undefined)
      {
        this.applyFilter(this.selectedvalue)
      }

    });
  }



  update_task_status()
  {
    let timer= setInterval(() => {
      this.rest.getautomatedtasks(0).subscribe(response=>{
        let responsedata:any=response;
        if(responsedata.automationTasks!=undefined)
        {
          if(responsedata.automationTasks.length==0)
          {
            clearInterval(timer);
          }else{
            responsedata.automationTasks.forEach(statusdata=>{
              let data:any;
              if(statusdata.status=="InProgress")
              {
                data="<span class='text-primary'><img src='../../../../../assets/images/RPA/processloading.svg' style='height:25px'></span>&nbsp;<span class='text-primary'>"+statusdata.status+"</span>";
              }else if(statusdata.status=="Success")
              {

                data='<span class="text-success"><i class="fa fa-check" aria-hidden="true"></i></span>&nbsp;<span class="text-success">Success</span>';
              }
              else if(statusdata.status=="Failed")
              {
                data='<span class="text-danger"><i class="fa fa-times" aria-hidden="true"></i></span>&nbsp;<span class="text-danger">Failed</span>';
              }
              else if(statusdata.status=="New")
              {
                data="<span><img src='../../../../../assets/images/RPA/newicon.png' style='height:20px' ></span>&nbsp;<span class='text-primary'>"+statusdata.status+"</span>";
              }
              else if(statusdata.status=="")
              {
                data="---";
              }
              $("#"+statusdata.taskId+"__status").html(data);

              $("#"+statusdata.taskId+"__failed").html(statusdata.failureTask)

              $("#"+statusdata.taskId+"__success").html(statusdata.successTask)
              if(responsedata.automationTasks.filter(prodata=>prodata.status=="InProgress").length>0)
              {
              }else
              {
                clearInterval(timer);
              }
            })
          }
        }else
        {
          clearInterval(timer);
        }

      })

    }, 5000);
  }

  getenvironments()
  {
    this.rest.listEnvironments().subscribe(response=>{
      let resp:any=response
      if(resp.errorCode == undefined)
      {
        this.environments=response;
      }
    })
  }

  getCategoryList()
  {
    this.rest.getCategoriesList().subscribe(data=>{
      let catResponse : any;
      catResponse=data
      this.categaoriesList=catResponse.data;
    });
  }



  openscheduler()
  {

  }








}
