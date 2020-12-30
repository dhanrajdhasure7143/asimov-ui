import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import {RestApiService} from '../../../services/rest-api.service';
import {sohints} from '../model/so-hints';
import { DataTransferService } from '../../../services/data-transfer.service';

declare var $:any;
@Component({
  selector: 'app-so-bot-management',
  templateUrl: './so-bot-management.component.html',
  styleUrls: ['./so-bot-management.component.css']
})
export class SoBotManagementComponent implements OnInit {
    public botid:any;
    public isTableHasData = true;
    public respdata1=false;
    schdata:any;
    displayedColumns: string[] = ["botName","botType", "department","description","version","botStatus", "Action","Schedule","Logs"];
    departmentlist :string[] = ['Development','QA','HR'];
    botNameFilter = new FormControl('');
    botTypeFilter = new FormControl('');
    departmentFilter = new FormControl('');
    dataSource1:MatTableDataSource<any>;
    dataSource4:MatTableDataSource<any>;
    dataSource5:MatTableDataSource<any>;
    viewlogid="check123";
    processnames:any=[]
    viewlogid1="check456";
    logflag:Boolean;
    respdata2:Boolean;
    selectedcat:any;
    search:any;
    public isDataSource: boolean;
    public userRole:any = [];
    public isButtonVisible = false;
    public bot_list:any=[];
    public process_names:any=[];
    public selectedvalue:any;
    public selectedTab:number;
    public responsedata;
    form: FormGroup;
    public selectedEnvironment:any='';
    public environments:any=[];
    public categaoriesList:any=[];
    automatedtasks:any=[];
    log_botid:any;
    log_version:any;
    logresponse:any=[];
    @ViewChild("paginator1",{static:false}) paginator1: MatPaginator;
    @ViewChild("sort1",{static:false}) sort1: MatSort;

    @ViewChild("paginator4",{static:false}) paginator4: MatPaginator;
    @ViewChild("paginator5",{static:false}) paginator5: MatPaginator;
    @ViewChild("sort4",{static:false}) sort4: MatSort;
    @ViewChild("sort5",{static:false}) sort5: MatSort;
    displayedColumns4: string[] = ['run_id','version','start_date','end_date' , "bot_status"];
    Viewloglist:MatTableDataSource<any>;
    displayedColumns5: string[] = ['task_name','start_date','end_date','status','error_info' ];
    logbyrunid:MatTableDataSource<any>;
    popup:Boolean=false;
    constructor(private route: ActivatedRoute,
      private rest:RestApiService,
      private router: Router,
      private hints: sohints,
      private dt : DataTransferService,
      )
    {}

  ngOnInit() {
    this.dt.changeHints(this.hints.sobotMhints);
    this.getCategoryList();
    this.getallbots();
    this.getautomatedtasks();
    this.getprocessnames();
    this.popup=false;
  }

  loadbotdatadesign(botId)
  {
    console.log(botId);
    localStorage.setItem("botId",botId);
    this.router.navigate(["/pages/rpautomation/home"]);
  }

  getallbots()
  {
    let response:any=[];

    //this.rpa_studio.spinner.show()
    //http://192.168.0.7:8080/rpa-service/get-all-bots

    this.rest.getAllActiveBots().subscribe(botlist =>
    {
      response=botlist;
      if(response.length==0)
      {
        //this.rpa_studio.spinner.hide();
      }
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
      if(this.categaoriesList.find(resp => resp.categoryId==data.department)!=undefined)
      {
        object.department=this.categaoriesList.find(resp => resp.categoryId==data.department).categoryName;
      }
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
      response.sort((a,b) => a.createdAt > b.createdAt ? -1 : 1);
      this.bot_list=this.bot_list.reverse();
      this.dataSource1= new MatTableDataSource(this.bot_list);
      this.isDataSource = true;
      this.dataSource1.sort=this.sort1;
      this.dataSource1.paginator=this.paginator1;
      this.dataSource1.data = response;
      /*this.departmentFilter.valueChanges.subscribe((departmentFilterValue) => {
        //this.filteredValues['department'] = departmentFilterValue;
        //this.dataSource1.filter = JSON.stringify(this.filteredValues);
        if(this.dataSource1.filteredData.length > 0){
          this.isTableHasData = true;
        } else {
          this.isTableHasData = false;
        }
        },(err)=>{

          ///this.rpa_studio.spinner.hide();
        });

        this.botNameFilter.valueChanges.subscribe((botNameFilterValue) => {
          //this.filteredValues['botName'] = botNameFilterValue;
          this.dataSource1.filter = JSON.stringify(this.filteredValues);
          if(this.dataSource1.filteredData.length > 0){
            this.isTableHasData = true;
          } else {
            this.isTableHasData = false;
          }
        });

      //this.dataSource1.filterPredicate = this.customFilterPredicate();
      //this.rpa_studio.spinner.hide()*/
    },(err)=>{
      //this.rpa_studio.spinner.hide();
    })
  }




  viewlogdata(botid ,version){
  let response: any;
   let log:any=[];
   this.logresponse=[];
   this.log_botid=botid;
   this.log_version=version
   this.rest.getviewlogdata(botid,version).subscribe(data =>{
       this.logresponse=data;
       if(this.logresponse.length >0)
       {
         this.respdata1 = false;
         console.log(this.respdata1)
       }else
       {
         this.respdata1 = true;
         console.log(this.respdata1);
       }
       console.log(this.logresponse)
       if(this.logresponse.length>0)
       this.logresponse.forEach(data=>{
       response=data;
       if(response.start_time != null)
       {
         let startdate=response.start_time.split("T");
         response["start_date"]=startdate[0];
         response.start_time=startdate[1].slice(0,8);


       }else
       {
         response["start_date"]="-";
         response.start_time="-";
       }
       if(response.end_time != null)
       {
         let enddate=response.end_time.split("T");
         response["end_date"]=enddate[0];
         response.end_time=enddate[1].slice(0,8);
       }else
       {
         response["end_date"]="---";
         response.end_time="---";

       }
       log.push(response)
     });
     console.log(log);
     log.sort((a,b) => a.run_id < b.run_id ? -1 : 1);
     this.Viewloglist = new MatTableDataSource(log);
     console.log(this.Viewloglist);

     this.Viewloglist.paginator=this.paginator4;
     this.Viewloglist.sort=this.sort4;

     document.getElementById(this.viewlogid).style.display="block";

   });
 }

 public botrunid
 ViewlogByrunid(runid){
   console.log(runid);
   this.botrunid=runid;
   let responsedata:any=[];
   let logbyrunidresp:any;
   let resplogbyrun:any=[];
   this.rest.getViewlogbyrunid(this.log_botid,this.log_version,runid).subscribe((data)=>{
     responsedata = data;
     if(responsedata.length >0)
     {
       this.respdata2 = false;
       console.log(this.respdata2)
     }else
     {
       this.respdata2 = true;
       console.log(this.respdata2);
     }
     console.log(responsedata);
     responsedata.forEach(rlog=>{
       logbyrunidresp=rlog;
       logbyrunidresp["start_date"]=logbyrunidresp.start_time;
       logbyrunidresp["end_date"]=logbyrunidresp.end_time;
       logbyrunidresp.start_time=logbyrunidresp.start_time;
       logbyrunidresp.end_time=logbyrunidresp.end_time;

       resplogbyrun.push(logbyrunidresp)
     });
     console.log(resplogbyrun);
     this.logflag=true;
     this.logbyrunid = new MatTableDataSource(resplogbyrun);
     console.log(this.logbyrunid);
     this.logbyrunid.paginator=this.paginator5;
     this.logbyrunid.sort=this.sort5;
     document.getElementById(this.viewlogid).style.display="none";
     document.getElementById(this.viewlogid1).style.display="block";
       })
   }

   back(){
     //document.getElementById("ViewLog").style.display="none";
     document.getElementById(this.viewlogid1).style.display="none";
     document.getElementById(this.viewlogid).style.display="block";
   }

   viewlogclose(){
     document.getElementById(this.viewlogid).style.display="none";
   }

   viewlogclose1(){
     document.getElementById(this.viewlogid1).style.display="none";
     document.getElementById(this.viewlogid).style.display="none";
   }



   getschecdules(botId)
   {

    // this.rest.scheduleList(botId).subscribe((data)=> this.scheduleResponse(data))
   }



   executionAct(botid) {

      Swal.fire({
        icon: 'success',
        title: "Bot Initiated Sucessfully !!",
        showConfirmButton: true,
      })

      this.rest.execution(botid).subscribe(res =>{
      })
    }


    pauseBot(botId) {
        Swal.fire({
          icon: 'success',
          title: "Bot Paused Sucessfully !!",
          showConfirmButton: true,
        })

        this.rest.getUserPause(botId).subscribe(data => {
        });
    }

    resumeBot(botid) {
        Swal.fire({
          icon: 'success',
          title: "Bot Resumed Sucessfully !!",
          showConfirmButton: true,
        })
        this.rest.getUserResume(botid).subscribe(data => {
        })
    }

    stopBot(botid) {
        Swal.fire({
          icon: 'success',
          title: "Bot Execution Stopped !!",
          showConfirmButton: true,
          })

          this.rest.stopbot(botid,"").subscribe(data=>{
            console.log(data)

          })
    }



    applyFilter(filterValue:any) {
      console.log(filterValue)
      let category=this.categaoriesList.find(val=>filterValue==val.categoryId);
      //this.selectedvalue=filterValue;
      filterValue = category.categoryName.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      console.log(filterValue);
      this.dataSource1.filter = filterValue;
    }


    applyFilter2(filterValue: string) {

      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      this.dataSource1.filter = filterValue;
    }
  getCategoryList(){
    this.rest.getCategoriesList().subscribe(data=>{
      let catResponse : any;
      catResponse=data
      this.categaoriesList=catResponse.data;
    });
  }



  getautomatedtasks()
  {
    this.rest.getautomatedtasks(0).subscribe(tasks=>{
      this.automatedtasks=tasks;
    })
  }

    getprocessnames()
    {
      this.rest.getprocessnames().subscribe(processnames=>{
        this.processnames=processnames;
      })
    }



    openscheduler(botid)
    {
      this.botid=botid;
      this.schdata={
        botid:botid
      }
      this.popup=true;
    }


    close()
    {
      this.popup=false;
    }

    reset()
    {
      this.selectedcat="";
      this.search=""
      this.getallbots()
    }


}
