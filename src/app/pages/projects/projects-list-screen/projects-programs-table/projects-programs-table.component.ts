import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
@Component({
  selector: 'app-projects-programs-table',
  templateUrl: './projects-programs-table.component.html',
  styleUrls: ['./projects-programs-table.component.css']
})
export class ProjectsProgramsTableComponent implements OnInit {


  public updateForm:FormGroup;
  displayedColumns1: string[] = ["id","type","initiatives","process","projectName","owner","priority","access","status","lastupdatedby","action"];
  @ViewChild("paginator2",{static:false}) paginator2: MatPaginator;
  @ViewChild("sort2",{static:false}) sort2: MatSort;
  public selectedTab=0;
  public check_tab=0;
  dataSource2:MatTableDataSource<any>;
  public prjupdatedata:any;
  public checkeddisabled:boolean =false;
  public Prjcheckeddisabled:boolean =false;
  projectsdata: any=[];
  dbupdateid: any;
  modalRef: BsModalRef;
    public createprogram:FormGroup;
  updateddata: any;
  public updateflag: boolean;
  public Credupdateflag:Boolean;
    public Creddeleteflag:Boolean;
    public Credcheckflag:boolean = false;
  selectedprojectid: string;
  selectedprojecttype: any;
  projectmodifybody: any;
  submitted: boolean;
  insertForm: FormGroup;
  insertForm2:FormGroup;
  projDetials: {};
  myprojDetials:any;
  tablelist:any=[]
  prog_projectArray: any=[];
  myProgrambody: any;
  public selected_process_names:any=[];
  userslist:any;
  projectdetailsEncode: any;
  project: { id: any; };
  constructor( private api:RestApiService,private formBuilder: FormBuilder,private spinner: NgxSpinnerService, 
     private router: Router
    ) { 

    this.updateForm=this.formBuilder.group({
      type: ["", Validators.compose([Validators.required , Validators.maxLength(50)])],
      initiatives: ["", Validators.compose([Validators.required , Validators.maxLength(50)])],
      process: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      projectName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      owner: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      priority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      access: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
  })
  this.createprogram=this.formBuilder.group({
    programname: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    initiatives: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    programpurpose: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    programpriority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    measurablemetrics: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    description: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    })

    this.insertForm=this.formBuilder.group({
      projectname: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      initiatives: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      addresources: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      addprojectpurpose: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      enddate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      startdate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      programpriority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      measurablemetrics: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      description: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],

  })
  this.insertForm2=this.formBuilder.group({
    projectName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    initiatives: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    resources: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    
    owner: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    
    mapchainvalue: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    enddate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    startdate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    projectpriority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    measurablemetrics: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    description: ["", Validators.compose([Validators.maxLength(200)])],

})
  this.Credupdateflag=false;
      this.Creddeleteflag=false;
  }

  ngOnInit() {

    this.getallProjects();
    this.getallusers();

  }

  navigatetodetailspage(detials){
    this.projectdetailsEncode=Base64.encode(JSON.stringify(detials));
          this.project={id:this.projectdetailsEncode}
          console.log("details",this.project)
          this.router.navigate(['/pages/projects/projectdetails',this.project])
  }
  
  CredcheckAllCheckBox(ev) {
    this.tablelist.forEach(x =>
       x.checked = ev.target.checked);
    this.Credchecktoupdate();
    this.checktodelete();
  }

  Updatecredntials(){
    document.getElementById("filters").style.display='none';
    document.getElementById("UpdateProjects").style.display='block';
  }

 
   
    getallProjects(){
      this.spinner.show();
      this.api.getAllProjects().subscribe(data1 => {
          this.projectsdata = data1;
          this.projectsdata[0].filter(data => {
            this.tablelist.push({
              id:data.id,
              projectName:data.programName,
              access:data.access,
              initiatives:data.initiatives,
              process:data.process,
              type:data.type,
              owner:data.owner,
              priority:data.priority,
            })
           
          })
          this.projectsdata[1].filter(data => {
            if(data.type=="Project"){
            this.tablelist.push({
              id:data.id,
              projectName:data.projectName,
              access:data.access,
              initiatives:data.initiatives,
              process:data.process,
              type:data.type,
              owner:data.owner,
              priority:data.priority,
            })
           
          }
        })
  
        if(this.projectsdata.length>0)
         { 
           this.Prjcheckeddisabled = false;
           this.tablelist.sort((a,b) => a.id > b.id ? -1 : 1);
           setTimeout(() => {
            this.sortmethod(); 
          }, 80);
  
         }
         else
         {
           this.Prjcheckeddisabled = true;
         }
      
        this.dataSource2 = new MatTableDataSource(this.tablelist);
       // console.log("tablelist",this.tablelist)
        this.spinner.hide();
      });
     // document.getElementById("filters").style.display='block'; 
  }
  sortmethod(){
    this.dataSource2.sort = this.sort2;   
    this.dataSource2.paginator=this.paginator2; 
  }

  closeproject()
  {     
    document.getElementById("filters").style.display='block';
    document.getElementById('UpdateProjects').style.display='none';
    this.resetupdateForm();
  }

  closeprogram(){
    document.getElementById("filters").style.display='block';
    document.getElementById('prog-proj-tab').style.display='none';
    this.resetcreateprogramForm();
    this.resetcreateproject();
  }

  resetcreateprogramForm(){
      this.createprogram.reset();
  }

  resetProjForm(){
  this.insertForm.reset();
  }

  resetupdateForm(){
    this.updateForm.reset();
  }
  onTabChanged(event)
  {
    this.check_tab=event.index;
  }
  
  updatedata()
  {    
    document.getElementById("filters").style.display='none';
    document.getElementById('UpdateProjects').style.display='block';
    this.getprocessnames();
    let data:any;
    for(data of this.tablelist)
    {
      if(data.id==this.dbupdateid)
      {
        this.prjupdatedata=data;
        this.updateForm.get("type").setValue(this.prjupdatedata["type"]);
        this.updateForm.get("initiatives").setValue(this.prjupdatedata["initiatives"]);
        this.updateForm.get("process").setValue(this.prjupdatedata["process"]);
        this.updateForm.get("projectName").setValue(this.prjupdatedata["projectName"]);
        this.updateForm.get("owner").setValue(this.prjupdatedata["owner"]);
        this.updateForm.get("access").setValue(this.prjupdatedata["access"]);
        this.updateForm.get("priority").setValue(this.prjupdatedata["priority"]);
        break;
      }
    }
   
  }

  saveProject(){
        let projDetails = this.insertForm.value;
       this.myprojDetials=
      {
          "projectName": projDetails.projectname,
        "initiatives": projDetails.initiatives,
        "resources": projDetails.addresources,
        "owner":projDetails.addresources,
        "priority": projDetails.priority,
      "measurableMetrics":projDetails.measurablemetrics ,
        "description": projDetails.description
              }
             this.prog_projectArray.push(this.myprojDetials);
             console.log("project array is",this.prog_projectArray)
             document.getElementById('addproj').style.display='none';
             document.getElementById('prog-proj-tab').style.display='block';


  }
  
  saveProgram(){​​​​​​​​
    if(this.createprogram.valid)
       {​​​​​​​​
    this.spinner.show();
    this.submitted=true;
    let program = this.createprogram.value;
    console.log("my prog",program)
 this.myProgrambody=   
{"programName":program.programname,
"initiatives":program.initiatives,
"purpose":program.programpurpose,
"priority":program.programpriority,
"measurablemetrics":program.measurablemetrics,
"description":program.description,
"project":this.prog_projectArray
}

    this.api.saveProgram(this.myProgrambody).subscribe( res=>{​​​​​​​​
    this.spinner.hide();
    Swal.fire({​​​​​​​​
    position:'center',
    icon:'success',
    title:"saved",
    showConfirmButton:false,
    timer:2000
              }​​​​​​​​)
    this.submitted=false; 
    this.tablelist=[];
    document.getElementById('prog-proj-tab').style.display='none';   
    this.getallProjects();
    
    this.spinner.hide();
        }​​​​​​​​);
    
      }​​​​​​​​
    else{​​​​​​​​
    alert("Invalid Form");
      }​​​​​​​​
       }​​​​​​​​

  createprojects(){
    document.getElementById("filters").style.display='none';
    document.getElementById('prog-proj-tab').style.display='block';
  }

  addProject()
  {
    //this.modalRef = this.modalService.show(template);
    document.getElementById('addproj').style.display='block'

   }
  
   back(){
    document.getElementById("addproj").style.display="none";
    this.resetCredForm();
  }

  resetCredForm(){
    this.insertForm.reset();
  }
  
  projectupdate(){
    if(this.updateForm.valid)
    {
      this.spinner.show();
    let credupdatFormValue =  this.updateForm.value;
    credupdatFormValue["id"]= this.prjupdatedata.id;
    this.api.update_project(credupdatFormValue).subscribe( res =>{
      let status: any= res;
      this.spinner.hide();
      Swal.fire({
        title: 'Success',
        text: ""+status.message,
        position: 'center',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      })
      this.tablelist=[];
      this.removeallchecks();

      this.getallProjects();
      this.Credchecktoupdate();
      this.checktodelete(); 
      document.getElementById('UpdateProjects').style.display='none';   
      this.spinner.hide();
    },err => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong!',
      })
      
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

delete(){
  let selectedproject = this.tablelist.filter(product => product.checked==true).map(p =>{
    return{
      id:p.id,
      type:p.type
    }
  });
  // let selectedprojecttype = this.tablelist.filter(product => product.checked==true).map(p => p.type);
 
  
//   this.projectmodifybody = [{
//     "id":selectedprojectid[0],
//     "type": selectedprojecttype[0],
    
// }]
  
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
      this.spinner.show();
      this.api.delete_Project(selectedproject).subscribe( res =>{ 
        let status:any = res;
        Swal.fire({
          title: 'Success',
          text: ""+status.message,
          position: 'center',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#007bff',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }) 
        this.tablelist=[]
        this.removeallchecks();
        this.getallProjects();
        this.spinner.hide();
        this.Credchecktoupdate();  
        this.checktodelete(); 
        },err => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          })
                       
        })
    }
  });

}


Credchecktoupdate()
  {
    const selectedprojectdetails = this.tablelist.filter(product => product.checked==true);
    if(selectedprojectdetails.length==1)
    {
      this.Credupdateflag=true;
      this.dbupdateid=selectedprojectdetails[0].id;
    }else
    {
      this.Credupdateflag=false;
    }
  }

  CredcheckEnableDisableBtn(id, event)
  {
    this.tablelist.find(data=>data.id==id).checked=event.target.checked;
    if(this.tablelist.filter(data=>data.checked==true).length==this.tablelist.length)

    {
      this.updateflag=true;
    }else
    {
      this.updateflag=false;  
    }
    this.Credchecktoupdate();
    this.checktodelete();
  }

  checktodelete()
  {
    const selectedprojectdata = this.tablelist.filter(product => product.checked).map(p => p.id);
    if(selectedprojectdata.length>0)
    {
      this.Creddeleteflag=true;
    }else
    {
      this.Creddeleteflag=false;
    }
  }

  applyFilter1(filterValue: string) {
    
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource2.filter = filterValue;
  }

  removeallchecks()
  {
    for(let i=0;i<this.tablelist.length;i++)
    {
      this.tablelist[i].checked= false;
    }
    this.Credcheckflag=false;
  }


  createproject()
  {
    this.spinner.show();
    this.api.createProject(this.insertForm2.value).subscribe(data=>{
      let response:any=data;
      this.spinner.hide();
      if(response.errormessage==undefined)
      {
        Swal.fire("Success",response.message,"success");
        this.insertForm2.reset();
        document.getElementById("prog-proj-tab").style.display="none"
        this.getallProjects()
        this.insertForm2.get("mapchainvalue").setValue("");
        this.insertForm2.get("resources").setValue("");
        this.insertForm2.get("owner").setValue("");
        this.insertForm2.get("initiatives").setValue("");
        this.insertForm2.get("projectpriority").setValue("");
        
      }
      else
        Swal.fire(response.errormessage,"","error");
      
    })
  }

  resetcreateproject()
  {
        this.insertForm2.reset();
        
        this.insertForm2.get("resources").setValue("");
        this.insertForm2.get("mapchainvalue").setValue("");
        this.insertForm2.get("owner").setValue("");
        this.insertForm2.get("initiatives").setValue("");
        this.insertForm2.get("projectpriority").setValue("");
        
  }

  getallusers()
  {
    let tenantid=localStorage.getItem("tenantName")
    this.api.getuserslist(tenantid).subscribe(item=>{
      let users:any=item
      this.userslist=users;
    })
  }
}
