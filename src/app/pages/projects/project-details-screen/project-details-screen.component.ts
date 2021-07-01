import { formatDate } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Base64 } from 'js-base64';
import { DataTransferService } from '../../services/data-transfer.service';
import { RestApiService } from '../../services/rest-api.service';

@Component({
  selector: 'app-project-details-screen',
  templateUrl: './project-details-screen.component.html',
  styleUrls: ['./project-details-screen.component.css']
})
export class ProjectDetailsScreenComponent implements OnInit {
  projects_toggle:Boolean=false;
  projectData: any;
  projectDetails: any;

  lastname: string;
  firstname: string;
  firstletter: string;
  retrievedImage: any;
  base64Data: any;
  public retrieveResonse: any;
  public profilePicture:boolean=false;
  tenantId: string;
 role: string;
  resourcetablefirstname: any;
  resourcetablelastname: any;
  process_names: any;
  selectedcategory: number;
  selectedvalue: any;
  dataSource2:MatTableDataSource<any>;
  categaoriesList: any;
  selected_process_names: any;
  displayedColumns: string[] = ["processName","taskName","processOwner","taskOwner","taskType", "category","status"];
  responsedata: any;
  bot_list: any=[];
  automatedtask: any;
  @ViewChild("sort10",{static:false}) sort10: MatSort;
  @ViewChild("paginator10",{static:false}) paginator10: MatPaginator;
  userid: any;
 
  rolelist: any=[];
  userrole: any=[];
  public rolename: any;
  roles: any;
  constructor(private dt:DataTransferService,private route:ActivatedRoute, private rpa:RestApiService) { }

  ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/projects/projects-list-screen", "title":"Projects"});
    this.dt.changeChildModule(undefined);

    this.projectdetails();

    setTimeout(() => {
      this.getImage();
      this.profileName();
        },1000);
        this.getautomatedtasks(0);
        this.getUserRole();
  }


  getUserRole(){
    this.userid=this.projectDetails.resources
    this.rpa.getRole(this.userid).subscribe(data =>{
      this.userrole=data
      for (let index = 0; index <= this.userrole.message.length; index++) {
        this.rolename =  this.userrole.message[index];

        this.rolelist.push(this.rolename.name)
        this.roles=this.rolelist.join(',')
        console.log("role", this.rolelist)
      }
      //this.rolename=this.userrole.message[0].name
     
    })
  }

  getautomatedtasks(process)
  {
    let response:any=[];
    this.rpa.getautomatedtasks(process).subscribe(automatedtasks=>{
      response=automatedtasks;

      if(response.automationTasks != undefined)
      {
        this.responsedata=response.automationTasks.map(item=>{
            if(item.sourceType=="UiPath")
              item["taskOwner"]="Karthik Peddinti";
            else if(item.sourceType=="EPSoft")
            {

              this.rpa.getAllActiveBots().subscribe(botlist =>
                {
                  this.bot_list=botlist;
                  item["taskOwner"]=this.bot_list.find(bot=>bot.botId==item.botId).createdBy;
                });
            }
            else{
              item["taskOwner"]="---"
            }
            return item;
        });
        this.automatedtask= response.automationTasks;
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
      }
     // this.spinner.hide();
    },(err)=>{
    //  this.spinner.hide();
    })
  }

  getprocessnames(processId)
  {
    this.rpa.getprocessnames().subscribe(processnames=>{
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
      //this.spinner.hide();
    },(err)=>{
     // this.spinner.hide();
    })
  }

  applyFilter(filterValue:any) {
    let processnamebyid=this.process_names.find(data=>filterValue==data.processId);
    this.selectedcategory=parseInt(processnamebyid.categoryId);
    this.selectedvalue=processnamebyid.processId;
    filterValue = processnamebyid.processName.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource2= new MatTableDataSource(this.automatedtask);
        this.dataSource2.sort=this.sort10;
        this.dataSource2.paginator=this.paginator10;
  }

  projectdetails(){

    this.route.params.subscribe(data=>{this.projectData=data

      this.projectDetails=JSON.parse(Base64.decode(this.projectData.id));

      console.log("project details",this.projectDetails)
        });
  }


  profileName(){
    setTimeout(() => {
    this.firstname=this.resourcetablefirstname;
      this.lastname=this.resourcetablelastname;
      var firstnameFirstLetter=this.firstname.charAt(0)
      var lastnameFirstLetter=this.lastname.charAt(0)
      this.firstletter=firstnameFirstLetter+lastnameFirstLetter
    }, 1000);
  }

  getImage() {
    
    const userid=this.projectDetails.resources;
        this.rpa.getUserDetails(userid).subscribe(res => {
              this.retrieveResonse = res;
              this.resourcetablefirstname=this.retrieveResonse.firstName
              this.resourcetablelastname=this.retrieveResonse.lastName
              if(this.retrieveResonse.image==null||this.retrieveResonse.image==""){
               this.profileName();
                this.profilePicture=false;
              }
              else{
                this.profilePicture=true;
              }
              this.base64Data= this.retrieveResonse.image;
             // console.log("image",this.base64Data);
             // localStorage.setItem('image', this.base64Data);
              this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
             // console.log(this.retrievedImage);
            }
          );
      }
}
