import { formatDate } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Base64 } from 'js-base64';
import { DataTransferService } from '../../services/data-transfer.service';
import { RestApiService } from '../../services/rest-api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Options } from '@angular-slider/ngx-slider';

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
  displayedColumns: string[] = ["taskCategory","taskName","resources","status","percentage", "createdBy","action"];
  responsedata: any;
  bot_list: any=[];
  automatedtask: any;
  createtaskmodalref: BsModalRef;
  project_id: any;
  tasks: any=[];
  public users_list:any=[];

  value: number = 15;
  options: Options = {
    floor: 0,
    ceil: 100,
    showSelectionBar: true,
    getSelectionBarColor: (value: number): string => {
      if (value <= 3) {
          return 'red';
      }
      if (value <= 6) {
          return 'orange';
      }
      if (value <= 9) {
          return 'yellow';
      }
      return '#2AE02A';
    }
  };
  @ViewChild("sort10",{static:false}) sort10: MatSort;
  @ViewChild("paginator10",{static:false}) paginator10: MatPaginator;
  userid: any;
 
  rolelist: any=[];
  userrole: any=[];
  public rolename: any;
  roles: any;
  
  useremail: any;
  processes: any;

  constructor(private dt:DataTransferService,private route:ActivatedRoute, private rpa:RestApiService,
   private modalService: BsModalService,) { }

  ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/projects/projects-list-screen", "title":"Projects"});
    this.dt.changeChildModule(undefined);

    this.projectdetails();

    
    this.getUserRole();


    this.getallusers();
    this.getallprocesses();

    setTimeout(() => {
     // this.getImage();
     // this.profileName();
    //  this.profileName();
        },1000);
       
        this.getUserRole();
        this.getallusers();
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
      this.project_id=this.projectDetails.id
      this.tasks=this.projectDetails.tasks
      this.dataSource2= new MatTableDataSource(this.tasks);
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
    
    let userid=this.projectDetails.resources;
    this.rpa.getUserDetails(userid).subscribe(res => {
      this.retrieveResonse = res;
      setTimeout(() => {
                this.resourcetablefirstname=this.retrieveResonse.firstName
                this.resourcetablelastname=this.retrieveResonse.lastName
              }, 500);
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


      getallusers()
      {
        let tenantid=localStorage.getItem("tenantName")
        this.rpa.getuserslist(tenantid).subscribe(item=>{
          let users:any=item
          this.users_list=users;

          this.useremail=this.users_list.find(item=>item.userId.id==this.projectDetails.resources);
          return this.useremail!=undefined?(this.useremail.userId.userId):this.projectDetails.resources;
        })
      }

      getallprocesses()
      {
        this.rpa.getprocessnames().subscribe(processnames=>{
          let resp:any=[]
          resp=processnames
          this.processes=resp.filter(item=>item.status=="APPROVED");
        })
      }


      createtask(createmodal){
        this.createtaskmodalref=this.modalService.show(createmodal,{class:"modal-lg"})
      }


  
}
