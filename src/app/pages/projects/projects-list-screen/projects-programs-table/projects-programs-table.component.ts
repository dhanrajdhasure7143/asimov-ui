import { Component, OnInit, TemplateRef,Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import {MatTableDataSource} from '@angular/material/table';
import { RestApiService } from '../../../services/rest-api.service';
import Swal from 'sweetalert2';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Base64 } from 'js-base64';
import { Router } from '@angular/router';
import {ProjectsListScreenComponent} from '../projects-list-screen.component'
import moment from 'moment';

@Component({
  selector: 'app-projects-programs-table',
  templateUrl: './projects-programs-table.component.html',
  styleUrls: ['./projects-programs-table.component.css']
})
export class ProjectsProgramsTableComponent implements OnInit {


  public updateForm:FormGroup;
  displayedColumns1: string[] = ["id","type","initiatives","process","projectName","owner","priority","status","createdBy","action"];
  @ViewChild("paginator2",{static:false}) paginator2: MatPaginator;
  @ViewChild("sort2",{static:false}) sort2: MatSort;
  
  @Input('status') public status_data: any;
  @Input('projects_list') public projects_list: any=[];
  
  @Input('users_list') public users_list: any=[];
  
  @Input('processes') public processes: any=[];
  // public selectedTab=0;
  // public check_tab=0;
  dataSource2:MatTableDataSource<any>;
  selected_process_names:any;
  project_id:any;
  //public updatemodalRef
  // public prjupdatedata:any;
  // public checkeddisabled:boolean =false;
  // public Prjcheckeddisabled:boolean =false;
  // projectsdata: any=[];
  // dbupdateid: any;
   updatemodalref: BsModalRef;
   projectdetailsbyid: any;
   projectresources:any= [];
   userslist:any;
   updateprogramForm: FormGroup;
   mindate: any;
   customUserRole: any;
  viewallprojects: boolean = false;
  public userRoles: any;
  public name: any;
  email: any;
  userName: string;
  initiatives: any;
  @Output() projectslistdata = new EventEmitter<any[]>();
  //   public createprogram:FormGroup;
  // updateddata: any;
  // public updateflag: boolean;
  // public Credupdateflag:Boolean;
  //   public Creddeleteflag:Boolean;
  //   public Credcheckflag:boolean = false;
  // selectedprojectid: string;
  // selectedprojecttype: any;
  // projectmodifybody: any;
  // submitted: boolean;
  // insertForm: FormGroup;
  // insertForm2:FormGroup;
  // projDetials: {};
  // myprojDetials:any;
  // tablelist:any=[]
  // prog_projectArray: any=[];
  // myProgrambody: any;
  // public selected_process_names:any=[];
  // userslist:any;
  // projectdetailsEncode: any;
  // project: { id: any; };
  constructor( 
      private api:RestApiService,
      private formBuilder: FormBuilder,
      private spinner: NgxSpinnerService, 
     private router: Router, 
     private modalService: BsModalService,
     private project_main:ProjectsListScreenComponent
    ) { 

      this.updateForm=this.formBuilder.group({
        type: ["", Validators.compose([Validators.required , Validators.maxLength(50)])],
        initiatives: ["", Validators.compose([Validators.required , Validators.maxLength(50)])],
        process: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        projectName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        owner: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        priority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        access: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        resources: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        mapValueChain: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        measurableMetrics: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        status:["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        endDate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
       startDate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    })



    this.updateprogramForm=this.formBuilder.group({
      type: ["", Validators.compose([Validators.required , Validators.maxLength(50)])],
      initiatives: ["", Validators.compose([Validators.required , Validators.maxLength(50)])],
      process: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      projectName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      owner: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      priority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      access: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      measurableMetrics: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      purpose: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      status:["", Validators.compose([Validators.required, Validators.maxLength(50)])],
  })
//   this.createprogram=this.formBuilder.group({
//     programname: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
//     initiatives: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
//     programpurpose: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
//     programpriority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
//     measurablemetrics: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
//     description: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
//     })

//     this.insertForm=this.formBuilder.group({
//       projectname: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
//       initiatives: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
//       addresources: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
//       addprojectpurpose: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
//       enddate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
//       startdate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
//       programpriority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
//       measurablemetrics: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
//       description: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],

//   })
//   this.insertForm2=this.formBuilder.group({
//     projectName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
//     initiatives: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
//     resources: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    
//     owner: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    
//     mapchainvalue: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
//     enddate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
//     startdate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
//     projectpriority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
//     measurablemetrics: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
//     description: ["", Validators.compose([Validators.maxLength(200)])],

// })
//   this.Credupdateflag=false;
//       this.Creddeleteflag=false;
  }

  ngOnInit() {
    this.api.getCustomUserRole(2).subscribe(role=>{
      this.customUserRole=role;
      let element=[]
     for (let index = 0; index < this.customUserRole.message.length; index++) {
      element = this.customUserRole.message[index].permission;
       element.forEach(element1 => {
      if(element1.permissionName=='View_All_Projects') {
      this.viewallprojects=true
    }
  });
}

   })
   this.userName=localStorage.getItem("firstName")+" "+localStorage.getItem("lastName");
    setTimeout(()=>{
      this.getallProjects();
    },500)
    this.userRoles = localStorage.getItem("userRole")
    this.userRoles = this.userRoles.split(',');
    this.name=localStorage.getItem("firstName")+" "+localStorage.getItem("lastName")
    this.email=localStorage.getItem('ProfileuserId');

    this.mindate= moment().format("YYYY-MM-DD");
    this.getInitiatives();
  }

  
  
  programDetailsbyId(program){
    this.router.navigate(['/pages/projects/programdetails'],{queryParams:{ id: program.id } })
    }



  projectDetailsbyId(project){
   
    this.router.navigate(['/pages/projects/projectdetails'],{queryParams:{ id: project.id }})
  }
  
  // CredcheckAllCheckBox(ev) {
  //   this.tablelist.forEach(x =>
  //      x.checked = ev.target.checked);
  //   this.Credchecktoupdate();
  //   this.checktodelete();
  // }

  // Updatecredntials(){
  //   document.getElementById("filters").style.display='none';
  //   document.getElementById("UpdateProjects").style.display='block';
  // }

 
   
    getallProjects(){
      this.projects_list.sort((a,b) => a.id > b.id ? -1 : 1);
      if(this.status_data=="New")
      this.projects_list = this.projects_list.filter(item=>item.status=="New")
      else if(this.status_data=="In Progress") 
      this.projects_list = this.projects_list.filter(item=>item.status=="In Progress")
      else if(this.status_data=="In Review")
      this.projects_list = this.projects_list.filter(item=>item.status=="In Review")
      else if(this.status_data=="Pipeline")
      this.projects_list = this.projects_list.filter(item=>item.status=="Pipeline")
      else if(this.status_data=="Approved")
      this.projects_list = this.projects_list.filter(item=>item.status=="Approved")
      else if(this.status_data=="Rejected")
        this.projects_list = this.projects_list.filter(item=>item.status=="Rejected")
      else if(this.status_data=="Deployed")
        this.projects_list = this.projects_list.filter(item=>item.status=="Deployed")
      else if(this.status_data=="On Hold")
        this.projects_list = this.projects_list.filter(item=>item.status=="On Hold")
      else if(this.status_data=="Closed")
        this.projects_list = this.projects_list.filter(item=>item.status=="Closed")

      var projects_or_programs=this.projects_list.map((item:any)=>{
          if(item.type=="Program")
            return {
              "id":item.id,
              "programName": item.programName,
              "initiatives": item.initiatives,
              "priority": item.priority,
              "process":item.process,
              "owner": item.owner,
              "status": item.status,
              "createdBy": item.createdBy,
              "lastModifiedBy": item.lastModifiedBy,
              "type": item.type
            }
          else if(item.type=="Project")
            return {
            
                "id":item.id,
                "projectName": item.projectName,
                "initiatives": item.initiatives,
                "priority": item.priority,
                "process":item.process,
                "owner": item.owner,
                "status": item.status,
                "createdBy": item.createdBy,
                "lastModifiedBy": item.lastModifiedBy,
                "type": item.type

            }
        
      })
      this.dataSource2 = new MatTableDataSource(projects_or_programs);
      console.log("data",this.dataSource2)
      this.dataSource2.paginator=this.paginator2;
      this.dataSource2.sort = this.sort2;    
  }


  applyfilter(event)
  {
    let value1 = event.target.value.toLowerCase();
    this.dataSource2.filter = value1;
    this.dataSource2.sort=this.sort2;
    this.dataSource2.paginator=this.paginator2;
    this.dataSource2.filter
  }
  deleteproject(project)
  {
    var projectdata:any=project;
    let delete_data=[{
      id:project.id,
      type:project.type
    }]  
    Swal.fire({
      title: 'Enter '+projectdata.type+' Name',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      let value:any=result.value
      if(value!=undefined)
      if(projectdata.projectName.trim()==value.trim())
      {
        this.spinner.show();
        this.api.delete_Project(delete_data).subscribe( res =>{ 
          this.spinner.hide();
          this.getallProjects();
          let response:any=res
          if(response.errorMessage==undefined && response.warningMessage==undefined)
          {
            this.projects_list=[];
            Swal.fire("Success","Project Deleted Successfully !!","success")
            this.getallProjectsdata(this.userRoles,this.name,this.email);
          }
          else if(response.errorMessage==undefined && response.message==undefined)
          {
            Swal.fire("Error",response.warningMessage,"error")
          }else{
            Swal.fire("Error",response.errorMessage,"error")
          }
        })
      }else
      {
        Swal.fire("Error","Entered "+projectdata.type+" Name is Invalid","error")
      }
    })
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: "You won't be able to revert this!",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Yes, delete it!'
    // }).then((result) => {
    //   if (result.value) {
    //     this.spinner.show();
    //     this.api.delete_Project(delete_data).subscribe( res =>{ 
    //       this.spinner.hide();
    //       let response:any=res
    //       if(response.errorMessage==undefined)
    //       {
    //         this.projects_list=[];
    //         Swal.fire("Success",response.message,"success")
    //         this.getallProjectsdata();
    //       }
    //       else
    //       {
    //         Swal.fire("Error",response.errorMessage,"error")
    //       }
    //     })
    //   }
    //   })
  }
  


  getallProjectsdata(roles,name,email){
    this.spinner.show();
    this.api.getAllProjects(roles,name,email).subscribe(res=>{
      let response:any=res;
      this.projectslistdata.emit(response)
      this.projects_list=[];
      this.projects_list=[...response[0].map(data=>{
      return {
        id:data.id,
        projectName:data.programName,
        access:data.access,
        initiatives:data.initiatives,
        process:data.process,
        type:"Program",
        owner:data.owner,
        priority:data.priority,
        createdBy:data.createdBy,
        status:data.status==null?"New":data.status,
        resources:data.resources,
        mapValueChain:data.mapValueChain,
        measurableMetrics:data.measurableMetrics,
        purpose:data.purpose
      }
    }),...response[1].map(data=>{
        return {
          id:data.id,
          projectName:data.projectName,
          access:data.access,
          initiatives:data.initiatives,
          process:data.process,
          type:"Project",
          owner:data.owner,
          priority:data.priority,
          createdBy:data.createdBy,
          status:data.status==null?"New":data.status,
          resources:data.resources,
          mapValueChain:data.mapValueChain,
          measurableMetrics:data.measurableMetrics,
          startDate:data.startDate,
          endDate:data.endDate
        }
    })];
    console.log("data",this.projects_list)
    this.project_main.projects_list=this.projects_list;
    this.project_main.count.New=this.projects_list.filter(item=>item.status=="New").length
    this.project_main.count.Inprogress=this.projects_list.filter(item=>item.status=="In Progress").length
    this.project_main.count.Rejected=this.projects_list.filter(item=>item.status=="Rejected").length
    this.project_main.count.Approved=this.projects_list.filter(item=>item.status=="Approved").length
    this.project_main.count.Inreview=this.projects_list.filter(item=>item.status=="In Review").length
    this.project_main.count.Deployed=this.projects_list.filter(item=>item.status=="Deployed").length
    this.project_main.count.Closed=this.projects_list.filter(item=>item.status=="Closed").length
   
    this.spinner.hide();
    this.getallProjects();

    });
    
    //document.getElementById("filters").style.display='block'; 
}





  // closeproject()
  // {     
  //   document.getElementById("filters").style.display='block';
  //   document.getElementById('UpdateProjects').style.display='none';
  //   this.resetupdateForm();
  // }

  // closeprogram(){
  //   document.getElementById("filters").style.display='block';
  //   document.getElementById('prog-proj-tab').style.display='none';
  //   this.resetcreateprogramForm();
  //   this.resetcreateproject();
  // }

  // resetcreateprogramForm(){
  //     this.createprogram.reset();
  // }

  // resetProjForm(){
  // this.insertForm.reset();
  // }

  // resetupdateForm(){
  //   this.updateForm.reset();
  // }
  // onTabChanged(event)
  // {
  //   this.check_tab=event.index;
  // }
  
  updatedata(updatemodal,project)
  {    
    if(project.type=="Project"){
      let data:any=this.projects_list.find(item=>item.id==project.id);
      this.project_id=data.id;
        if(data.id!=undefined)
        {
          this.updateForm.get("type").setValue(data["type"]);
          this.updateForm.get("initiatives").setValue(data["initiatives"]);
          this.updateForm.get("process").setValue(data["process"]);
          this.updateForm.get("projectName").setValue(data["projectName"]);
           this.updateForm.get("owner").setValue(parseInt(data["owner"]));
          this.updateForm.get("access").setValue(data["access"]);
          this.updateForm.get("priority").setValue(data["priority"]);
          this.updateForm.get("resources").setValue(data["resources"]);
          this.updateForm.get("mapValueChain").setValue(data["mapValueChain"]);
          this.updateForm.get("status").setValue(data["status"]);
          this.updateForm.get("measurableMetrics").setValue(data["measurableMetrics"]);
          this.updateForm.get("endDate").setValue(moment(data["endDate"]).format("YYYY-MM-DD"));
          this.updateForm.get("startDate").setValue(moment(data["startDate"]).format("YYYY-MM-DD"));
          this.updatemodalref=this.modalService.show(updatemodal,{class:"modal-lg"})
        }
      }
      else if(project.type=="Program"){
        let data:any=this.projects_list.find(item=>item.id==project.id);
        this.project_id=data.id;
          if(data.id!=undefined)
          {
            this.updateprogramForm.get("type").setValue(data["type"]);
            this.updateprogramForm.get("initiatives").setValue(data["initiatives"]);
            this.updateprogramForm.get("process").setValue(data["process"]);
            this.updateprogramForm.get("projectName").setValue(data["projectName"]);
            this.updateprogramForm.get("owner").setValue(data["owner"]);
            this.updateprogramForm.get("access").setValue(data["access"]);
            this.updateprogramForm.get("priority").setValue(data["priority"]);
            this.updateprogramForm.get("measurableMetrics").setValue(data["measurableMetrics"]);
            this.updateprogramForm.get("purpose").setValue(data["purpose"]);
            this.updateprogramForm.get("status").setValue(data["status"]);
            this.updatemodalref=this.modalService.show(updatemodal,{class:"modal-lg"})
          }
      }
    }


  
//   saveProgram(){​​​​​​​​
//     if(this.createprogram.valid)
//        {​​​​​​​​
//     this.spinner.show();
//     this.submitted=true;
//     let program = this.createprogram.value;
//     console.log("my prog",program)
//  this.myProgrambody=   
// {"programName":program.programname,
// "initiatives":program.initiatives,
// "purpose":program.programpurpose,
// "priority":program.programpriority,
// "measurablemetrics":program.measurablemetrics,
// "description":program.description,
// "project":this.prog_projectArray
// }

//     this.api.saveProgram(this.myProgrambody).subscribe( res=>{​​​​​​​​
//     this.spinner.hide();
//     Swal.fire({​​​​​​​​
//     position:'center',
//     icon:'success',
//     title:"saved",
//     showConfirmButton:false,
//     timer:2000
//               }​​​​​​​​)
//     this.submitted=false; 
//     this.tablelist=[];
//     document.getElementById('prog-proj-tab').style.display='none';   
//     this.getallProjects();
    
//     this.spinner.hide();
//         }​​​​​​​​);
    
//       }​​​​​​​​
//     else{​​​​​​​​
//     alert("Invalid Form");
//       }​​​​​​​​
//        }​​​​​​​​

//   createprojects(){
//     document.getElementById("filters").style.display='none';
//     document.getElementById('prog-proj-tab').style.display='block';
//   }

//   addProject()
//   {
//     //this.modalRef = this.modalService.show(template);
//     document.getElementById('addproj').style.display='block'

//    }
  
//    back(){
//     document.getElementById("addproj").style.display="none";
//     this.resetCredForm();
//   }

//   resetCredForm(){
//     this.insertForm.reset();
//   }
  
  projectupdate(){
    if(this.updateForm.valid)
    {
      this.spinner.show();
      this.updatemodalref.hide();
      let credupdatFormValue =  this.updateForm.value;
      credupdatFormValue["id"]=this.project_id;
      this.api.update_project(credupdatFormValue).subscribe( res =>{
        let status: any= res;
        if(status.errorMessage==undefined)
        {
          Swal.fire("Success","Project Updated Successfully !!","success");
          this.getallProjectsdata(this.userRoles,this.name,this.email);
          this.spinner.hide();
        }
        else
        {
          Swal.fire("Error",status.errorMessage,"error");
        }
        
      },err => {
        Swal.fire("Error","Something Went Wrong","error");
      });
}
else
{
  alert("please fill all details");
}
  
}

programupdate(){
  if(this.updateprogramForm.valid)
  {
    this.spinner.show();
    this.updatemodalref.hide();
    let credupdatFormValue =  this.updateprogramForm.value;
    credupdatFormValue["id"]=this.project_id;
    this.api.update_project(credupdatFormValue).subscribe( res =>{
      let status: any= res;
      if(status.errorMessage==undefined)
      {
        //this.projects_list=[];
        Swal.fire("Success","Project Updated Successfully !!","success");
        this.getallProjectsdata(this.userRoles,this.name,this.email);
        this.spinner.hide();
      }
      else
      {
        Swal.fire("Error",status.errorMessage,"error");
      }
      
    },err => {
      Swal.fire("Error","Something Went Wrong","error");
    });
}
else
{
alert("please fill all details");
}

}

getprocessnames()
{
  this.api.getprocessnames().subscribe(processnames=>{
    let resp:any=[]
    resp=processnames
    this.selected_process_names=resp.filter(item=>item.status=="APPROVED");
  })
  }

// delete(){
//   let selectedproject = this.tablelist.filter(product => product.checked==true).map(p =>{
//     return{
//       id:p.id,
//       type:p.type
//     }
//   });
//   // let selectedprojecttype = this.tablelist.filter(product => product.checked==true).map(p => p.type);
 
  
// //   this.projectmodifybody = [{
// //     "id":selectedprojectid[0],
// //     "type": selectedprojecttype[0],
    
// // }]
  
//   Swal.fire({
//     title: 'Are you sure?',
//     text: "You won't be able to revert this!",
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Yes, delete it!'
//   }).then((result) => {
//     if (result.value) {
//       this.spinner.show();
//       this.api.delete_Project(selectedproject).subscribe( res =>{ 
//         let status:any = res;
//         Swal.fire({
//           title: 'Success',
//           text: ""+status.message,
//           position: 'center',
//           icon: 'success',
//           showCancelButton: false,
//           confirmButtonColor: '#007bff',
//           cancelButtonColor: '#d33',
//           confirmButtonText: 'Ok'
//         }) 
//         this.tablelist=[]
//         this.removeallchecks();
//         this.getallProjects();
//         this.spinner.hide();
//         this.Credchecktoupdate();  
//         this.checktodelete(); 
//         },err => {
//           Swal.fire({
//             icon: 'error',
//             title: 'Oops...',
//             text: 'Something went wrong!',
//           })
                       
//         })
//     }
//   });

// }


// Credchecktoupdate()
//   {
//     const selectedprojectdetails = this.tablelist.filter(product => product.checked==true);
//     if(selectedprojectdetails.length==1)
//     {
//       this.Credupdateflag=true;
//       this.dbupdateid=selectedprojectdetails[0].id;
//     }else
//     {
//       this.Credupdateflag=false;
//     }
//   }

//   CredcheckEnableDisableBtn(id, event)
//   {
//     this.tablelist.find(data=>data.id==id).checked=event.target.checked;
//     if(this.tablelist.filter(data=>data.checked==true).length==this.tablelist.length)

//     {
//       this.updateflag=true;
//     }else
//     {
//       this.updateflag=false;  
//     }
//     this.Credchecktoupdate();
//     this.checktodelete();
//   }

//   checktodelete()
//   {
//     const selectedprojectdata = this.tablelist.filter(product => product.checked).map(p => p.id);
//     if(selectedprojectdata.length>0)
//     {
//       this.Creddeleteflag=true;
//     }else
//     {
//       this.Creddeleteflag=false;
//     }
//   }

//   applyFilter1(filterValue: string) {
    
//     filterValue = filterValue.trim(); // Remove whitespace
//     filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
//     this.dataSource2.filter = filterValue;
//   }

//   removeallchecks()
//   {
//     for(let i=0;i<this.tablelist.length;i++)
//     {
//       this.tablelist[i].checked= false;
//     }
//     this.Credcheckflag=false;
//   }


//   createproject()
//   {
//     this.spinner.show();
//     this.api.createProject(this.insertForm2.value).subscribe(data=>{
//       let response:any=data;
//       this.spinner.hide();
//       if(response.errormessage==undefined)
//       {
//         Swal.fire("Success",response.message,"success");
//         this.insertForm2.reset();
//         document.getElementById("prog-proj-tab").style.display="none"
//         this.getallProjects()
//         this.insertForm2.get("mapchainvalue").setValue("");
//         this.insertForm2.get("resources").setValue("");
//         this.insertForm2.get("owner").setValue("");
//         this.insertForm2.get("initiatives").setValue("");
//         this.insertForm2.get("projectpriority").setValue("");
        
//       }
//       else
//         Swal.fire(response.errormessage,"","error");
      
//     })
//   }

//   resetcreateproject()
//   {
//         this.insertForm2.reset();
        
//         this.insertForm2.get("resources").setValue("");
//         this.insertForm2.get("mapchainvalue").setValue("");
//         this.insertForm2.get("owner").setValue("");
//         this.insertForm2.get("initiatives").setValue("");
//         this.insertForm2.get("projectpriority").setValue("");
        
//   }


resetupdateproject(){
  this.updateForm.reset();
  this.updateForm.get("owner").setValue("");
  this.updateForm.get("resources").setValue("");
  this.updateForm.get("mapValueChain").setValue("");
  this.updateForm.get("type").setValue("");
  this.updateForm.get("initiatives").setValue("");
  this.updateForm.get("process").setValue("");
  this.updateForm.get("access").setValue("");
  this.updateForm.get("status").setValue("");
  this.updateForm.get("priority").setValue("");
}

resetupdateprogram(){
  this.updateprogramForm.reset();
  this.updateprogramForm.get("owner").setValue("");
  this.updateprogramForm.get("access").setValue("");
  this.updateprogramForm.get("priority").setValue("");
  this.updateprogramForm.get("measurableMetrics").setValue("");
  this.updateprogramForm.get("type").setValue("");
  this.updateprogramForm.get("initiatives").setValue("");
  this.updateprogramForm.get("process").setValue("");
  this.updateprogramForm.get("status").setValue("");
}
getreducedValue(value) {​​​​​​​​
  if (value.length > 15)
  return value.substring(0,16) + '...';
  else
  return value;
}​​​​​​​​

getInitiatives(){
  this.api.getProjectIntitiatives().subscribe(res=>{
    let response:any=res;
    this.initiatives=response;
  })
}
}
