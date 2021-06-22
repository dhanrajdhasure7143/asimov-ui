import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import {MatTableDataSource} from '@angular/material/table';
import { RestApiService } from '../services/rest-api.service';
import Swal from 'sweetalert2';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  public updateForm:FormGroup;
  displayedColumns1: string[] = ["check","id","type","initiatives","process","projectName","owner","priority","access"];
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
  projDetials: {};
  myprojDetials: { projectName: any; initiatives: string; resources: string; owner: string; };
  tablelist:any=[]
  constructor( private api:RestApiService,private formBuilder: FormBuilder,private spinner: NgxSpinnerService,  private modalService: BsModalService,
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
  this.Credupdateflag=false;
      this.Creddeleteflag=false;
  }

  ngOnInit() {
    this.getallProjects();
    document.getElementById('projectmodal').style.display='none'

  }

  
  CredcheckAllCheckBox(ev) {
    this.projectsdata.forEach(x =>
       x.checked = ev.target.checked);
    this.Credchecktoupdate();
    this.checktodelete();
  }

  Updatecredntials(){
    document.getElementById("filters").style.display='none';
    document.getElementById("UpdateProjects").style.display='block';
  }

 
  async getallProjects(){
    this.api.getAllProjects().subscribe(data1 => {
        this.projectsdata = data1;
        if(this.projectsdata.length>0)
         { 
           this.Prjcheckeddisabled = false;
           this.projectsdata.sort((a,b) => a.id > b.id ? -1 : 1);
           setTimeout(() => {
            this.sortmethod(); 
          }, 80);
  
         }
         else
         {
           this.Prjcheckeddisabled = true;
         }
        this.dataSource2 = new MatTableDataSource(this.projectsdata);
        this.spinner.hide();
      });
      document.getElementById("filters").style.display='block'; 
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
    let data:any;
    for(data of this.projectsdata)
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
    // this.insertForm.get("type").setValue(this.prjupdatedata["type"]);
    // this.insertForm.get("initiatives").setValue(this.prjupdatedata["initiatives"]);
    // this.insertForm.get("process").setValue(this.prjupdatedata["process"]);
    // this.insertForm.get("projectName").setValue(this.prjupdatedata["projectName"]);
    // this.insertForm.get("owner").setValue(this.prjupdatedata["owner"]);
    // this.insertForm.get("access").setValue(this.prjupdatedata["access"]);
    // this.insertForm.get("priority").setValue(this.prjupdatedata["priority"]);
    let projDetails = this.insertForm.value;
   
    this.myprojDetials=

      {
        
       
        "projectName": projDetails.projectname,
        "initiatives": projDetails.initiatives,
        "resources": projDetails.addresources,
        "owner":projDetails.addresources
              }
  


  }
  resetProjForm(){
    
  }
  saveProgram(){​​​​​​​​
    if(this.createprogram.valid)
       {​​​​​​​​
    this.spinner.show();
    this.submitted=true;
    let program = this.createprogram.value;
    console.log("my prog",program)
    this.api.saveProgram(program).subscribe( res=>{​​​​​​​​
    this.spinner.hide();
    Swal.fire({​​​​​​​​
    position:'center',
    icon:'success',
    title:"saved",
    showConfirmButton:false,
    timer:2000
              }​​​​​​​​)
    this.submitted=false; 
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
  addProject(template: TemplateRef<any>)
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
        position: 'center',
        icon: 'success',
        title: status.message,
        showConfirmButton: false,
        timer: 2000
      });
     
      this.getallProjects();
      this.Credchecktoupdate();
      
      document.getElementById('UpdateProjects').style.display='none';   
      this.spinner.hide();
  });
}
else
{
  alert("please fill all details");
}
  
}

delete(){
  let selectedprojectid = this.projectsdata.filter(product => product.checked==true).map(p =>p.id);
  var selectedprojecttype = this.projectsdata.filter(product => product.checked==true).map(p => p.type);

  
  this.projectmodifybody = [{
    "id": selectedprojectid,
    "type": selectedprojecttype,
    
}]
  
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
      this.api.delete_Project(JSON.stringify(this.projectmodifybody)).subscribe( res =>{ 
        let status:any = res;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: status.message,
          showConfirmButton: false,
          timer: 2000    
        });
        this.tablelist=[]
        this.removeallchecks();
        this.getallProjects();
        this.spinner.hide();
        this.Credchecktoupdate();  
        this.checktodelete();                 
      });
    }
  });

}


Credchecktoupdate()
  {
    const selectedprojectdetails = this.projectsdata.filter(product => product.checked==true);
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
    this.projectsdata.find(data=>data.id==id).checked=event.target.checked;
    if(this.projectsdata.filter(data=>data.checked==true).length==this.projectsdata.length)
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
    const selectedprojectdata = this.projectsdata.filter(product => product.checked).map(p => p.id);
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
    for(let i=0;i<this.projectsdata.length;i++)
    {
      this.projectsdata[i].checked= false;
    }
    this.Credcheckflag=false;
  }
}
