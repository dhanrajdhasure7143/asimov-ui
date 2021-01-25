import {ViewChild,Input, Component, OnInit,Pipe, PipeTransform } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {RestApiService} from '../../../services/rest-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/filter';
import Swal from 'sweetalert2';
import {sohints} from '../model/so-hints';
import { DataTransferService } from '../../../services/data-transfer.service';
declare var $:any;
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-so-automated-tasks',
  templateUrl: './so-automated-tasks.component.html',
  styleUrls: ['./so-automated-tasks.component.css']
})
export class SoAutomatedTasksComponent implements OnInit {
  schdata:any;
  public processId1:any;
  public popup:any;
  public schedulepopup:Boolean=false;
  public queryparam:any='';
  public isTableHasData = true;
  public respdata1=false;
  displayedColumns: string[] = ["processName","taskName","taskType", "category","Assign","status","successTask","failureTask","Operations"];
  dataSource2:MatTableDataSource<any>;
  public isDataSource: boolean;
  public userRole:any = [];
  public isButtonVisible = false;
  public bot_list:any=[];
  public humans_list:any=[];
  public process_names:any=[];
  public selected_process_names:any=[];
  public selectedvalue:any;
  public selectedTab:number;
  public responsedata;
  public selectedEnvironment:any='';
  public environments:any=[];
  public selectedcategory:any="";
  public categaoriesList:any=[];
  @ViewChild("paginator10",{static:false}) paginator10: MatPaginator;
  @ViewChild("sort10",{static:false}) sort10: MatSort;
  @Input('processid') public processId: any;
  constructor(
    private route: ActivatedRoute,
    private rest:RestApiService,
    private router: Router,
    private spinner:NgxSpinnerService,
    private http:HttpClient,
    private hints: sohints,
    private dt : DataTransferService,
   )
  {
  }



  ngOnInit() {
    this.dt.changeHints(this.hints.soochestartionhints);
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
    this.getenvironments();
    this.getCategoryList(this.processId);
    this.getallbots();
    this.gethumanslist();
 }

 loadbotdatadesign(botId)
  {
    this.spinner.show();
     localStorage.setItem("botId",botId);
    this.router.navigate(["/pages/rpautomation/home"]);
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
      this.spinner.hide();
    },(err)=>{
      this.spinner.hide();
    })
  }



  getprocessnames(processId)
  {
    this.rest.getprocessnames().subscribe(processnames=>{
      let resp:any=[]
      resp=processnames
      this.process_names=resp.filter(item=>item.status=="APPROVED");
      this.selected_process_names=resp.filter(item=>item.status=="APPROVED");
      let processnamebyid;
      if(processId != undefined)
      {
        processnamebyid=this.process_names.find(data=>data.processId==processId);
        this.applyFilter(processnamebyid.processId);
      }
      else
      {
        this.selectedvalue="";
      }
      this.spinner.hide();
    },(err)=>{
      this.spinner.hide();
    })
  }


  applyFilter(filterValue:any) {
    let processnamebyid=this.process_names.find(data=>filterValue==data.processId);
    this.selectedcategory=parseInt(processnamebyid.categoryId);
    this.applyFilter1(this.selectedcategory);
    this.selectedvalue=processnamebyid.processId;
    filterValue = processnamebyid.processName.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource2.filter = filterValue;
  }

  applyFilter1(value) {
    this.selectedcategory=parseInt(value);
    this.dataSource2.filter = this.categaoriesList.find(data=>this.selectedcategory==data.categoryId).categoryName.toLowerCase();
    this.selected_process_names=this.process_names.filter(item=>item.categoryId==this.selectedcategory)
    this.selectedvalue="";
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
    this.rest.assign_bot_and_task(botId,id,"Automated").subscribe(data=>{
      let response:any=data;
      if(response.status!=undefined)
      {
        Swal.fire("Task  assigned to resource successfully !!","","success");
      }else
      {
        Swal.fire("Failed to Assign Resource !!","","warning");
      }
    })
  }


  assignhuman(taskid)
  {
    let botId=$("#"+taskid+"__select").val();
    if(botId!=0)
    this.rest.assign_bot_and_task(botId,taskid,"Human").subscribe(data=>{
      let response:any=data;
      if(response.status!=undefined)
      {
        Swal.fire(response.status,"","success");
      }else
      {
        Swal.fire(response.errorMessage,"","warning");
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
      this.rest.getautomatedtasks(0).subscribe(response => {
        let responsedata:any=response;
        if(responsedata.automationTasks!=undefined)
        {
          if(responsedata.automationTasks.length==0)
          {
            clearInterval(timer);
          }else{
            responsedata.automationTasks.forEach(statusdata=>{
              let data:any;

              if(statusdata.status=="InProgress" || statusdata.status=="Running")
              {
                data="<span class='text-primary'><img src='../../../../../assets/images/RPA/processloading.svg' style='height:25px'></span>&nbsp;<span class='text-primary'>"+statusdata.status+"</span>";
              }else if(statusdata.status=="Success")
              {

                data='<span class="text-success"><i class="fa fa-check-circle" aria-hidden="true"></i></span>&nbsp;<span class="text-success">Success</span>';
              }
              else if(statusdata.status=="Failed")
              {
                data='<span class="text-danger"><i class="fa fa-times-circle" aria-hidden="true"></i></span>&nbsp;<span class="text-danger">Failed</span>';
              }
              else if(statusdata.status=="New")
              {
                data="<span><img src='../../../../../assets/images/RPA/newicon.png' style='height:20px' ></span>&nbsp;<span class='text-primary'>"+statusdata.status+"</span>";
              }
              else if(statusdata.status=="Pending")
              {
                data="<span class='text-warning' style='font-size:18px'><i class='fa fa-clock' aria-hidden='true'></i></span>&nbsp;<span class='text-warning'>"+statusdata.status+"</span>";
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

  getCategoryList(processid)
  {
    this.rest.getCategoriesList().subscribe(data=>{
      let catResponse : any;
      catResponse=data
      this.categaoriesList=catResponse.data;
      this.getautomatedtasks(processid);
    });
  }

  gethumanslist()
  {
    let tenant=localStorage.getItem("tenantName");
    this.rest.getuserslist(tenant).subscribe(data=>
    {
        this.humans_list=data;
    })
  }

  getprocesslogs(){
    this.processId1 = this.selectedvalue;
    document.getElementById("filters").style.display = "none";
    this.popup=true;
  }

  closepop()
  {
    this.popup=false;
    document.getElementById("filters").style.display = "block";
  }
  reset_all()
  {
    this.selectedEnvironment="";
    this.selectedvalue="";
    this.selectedcategory="";
    this.getautomatedtasks(0)

  }


  startscheduler()
  {
    this.schdata={
      processid:this.selectedvalue,
      environment:this.selectedEnvironment,
      processName:this.process_names.find(item=>item.processId==this.selectedvalue).processName,
    }
    document.getElementById("filters").style.display = "none";
    this.schedulepopup=true;
  }

  closescheduler()
  {
    this.schedulepopup=false;
    document.getElementById("filters").style.display = "block";
  }


}




@Pipe({
  name: 'Checkbotslist'
})
export class Checkbotslist implements PipeTransform {

  transform(value: any,arg1: any,categories:any) {
    let users:any=[],usersbycat:any=[];
    users=value;
    usersbycat=users.filter(item=>item.userId.department==arg1);
    return usersbycat;
  }

}
@Pipe({
  name: 'Checkhumanslist'
})
export class Checkhumanslist implements PipeTransform {

  transform(value: any,arg1: any,categories:any) {
    let users:any=[],usersbycat:any=[];
    users=value;
    usersbycat=users.filter(item=>item.userId.department==arg1);
    return usersbycat;
  }

}
