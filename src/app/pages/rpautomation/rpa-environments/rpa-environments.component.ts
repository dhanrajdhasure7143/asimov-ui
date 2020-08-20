import { Component,  OnInit,OnDestroy, ChangeDetectorRef, ViewChild, EventEmitter, Output } from '@angular/core';
import {HttpClient,HttpErrorResponse} from '@angular/common/http';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { environmentobservable } from '../model/environmentobservable';
import { EnvironmentsService } from './rpa-environments.service';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';
import { DataTransferService} from "../../services/data-transfer.service";
import {RpaEnvHints} from "../model/rpa-environments-module-hints";
import {Router} from "@angular/router";
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-environments',
  templateUrl:'./rpa-environments.component.html',
  styleUrls: ['./rpa-environments.component.css']
})
  export class RpaenvironmentsComponent implements  OnInit{
    displayedColumns: string[] = ["check","environmentName","environmentType","agentPath","username","password","connectionType","portNumber","createdTimeStamp","createdBy","activeStatus","deployStatus"];
    dataSource1:MatTableDataSource<any>;
    @ViewChild('closebutton', {static: false}) closebutton  
    @ViewChild(DataTableDirective,{static: false}) dtElement: DataTableDirective;
    @Output()
    title:EventEmitter<string> = new EventEmitter<string>();
    public environments:any=[];
    public createpopup=document.getElementById('create');
    public button:string;
    public updatepopup=document.getElementById('update-popup');
    public delete_elements:number[];
    public masterSelected:Boolean;
    public updateenvdata:environmentobservable;
    public environmentName:FormControl;
    public insertForm:FormGroup;
    public updateForm:FormGroup;
    public updateflag:Boolean;
    public deleteflag:Boolean;
    private updateid:number;
    public term:string;
    public submitted:Boolean;
    public checkflag:Boolean;
    isDtInitialized:boolean = false;
    dtTrigger: Subject<any> =new Subject();
    dtOptions: DataTables.Settings = {};
    
  constructor(private api:RestApiService, 
    private router:Router, 
    private formBuilder: FormBuilder,
    private environmentservice:EnvironmentsService, 
    private chanref:ChangeDetectorRef, 
    private dt:DataTransferService,
    private hints:RpaEnvHints,
    private spinner: NgxSpinnerService
    ) { 
    const ipPattern = 
    "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
      this.insertForm=this.formBuilder.group({
      environmentName:["", Validators.required],
      environmentType:["", Validators.required],
      agentPath:["", Validators.required],
      hostAddress:["", Validators.compose([Validators.required, Validators.pattern(ipPattern)])],
      username:["", Validators.required],
      password:["", Validators.required],
      connectionType:["SSH", Validators.compose([Validators.required, Validators.pattern("[A-Za-z]*")])],
      portNumber:["22", Validators.required],
      activeStatus:[true],
      
    })

    this.updateForm=this.formBuilder.group({
      environmentName: ["", Validators.required],
      environmentType: ["", Validators.required],
      agentPath: ["", Validators.required],
      hostAddress: ["", Validators.compose([Validators.required, Validators.pattern(ipPattern)])],
      username: ["", Validators.required],
      password: ["", Validators.required],
      connectionType: ["",Validators.compose([Validators.required, Validators.pattern("[A-Za-z]*")])],
      portNumber: ["",  Validators.compose([Validators.required, Validators.pattern("[0-9]*")])],
      activeStatus: [""]
    
    })
    this.updateflag=false;
    this.deleteflag=false;
    
  }
  ngOnInit() {
    this.spinner.show();
    this.dt.changeParentModule({"route":"/pages/rpautomation/home", "title":"RPA Studio"});
    this.dt.changeChildModule({"route":"/pages/rpautomation/environments","title":"Environments"});

    this.createpopup=document.getElementById('create')
    this.updatepopup=document.getElementById('update-popup');
    this.dt.changeHints(this.hints.rpaenvhints);
    this.getallData();
    this.createpopup.style.display='none';
    this.updatepopup.style.display='none';
  }

 async getallData()
  {
    this.environments=[];
    await this.api.listEnvironments().subscribe(
    data => {
         let response:any= data;	
        for(let i=0;i<response.length;i++)
        {
          let checks={
            checked:false,
            }
          this.environments.push(Object.assign({}, response[i], checks));
        }
        console.log(this.environments)
        this.dataSource1= new MatTableDataSource(this.environments);
        this.spinner.hide();
      });
  }


  checkAllCheckBox(ev) {
    this.environments.forEach(x => x.checked = ev.target.checked)
    this.checktoupdate();
    this.checktodelete();

	}

  isAllCheckBoxChecked() {
    this.environments.forEach(data=>{
      if(data.checked==false)
      {
        return false;
      }
    })
    return true;
  }
  
  create()
  {
    this.createpopup.style.display='block';
    this.updatepopup.style.display='none';
  
  }
  resetEnvForm(){
    this.insertForm.reset();
    
    this.insertForm.get("portNumber").setValue("22");
    this.insertForm.get("connectionType").setValue("SSH");
    this.insertForm.get("environmentType").setValue("");
    this.insertForm.get("activeStatus").setValue(true);
  }

  async testConnection(data){
    let formdata:any;
    if(data=="insert"){
      formdata=this.insertForm;
    }else{
      formdata=this.updateForm;
    }
   if(formdata.valid)
   {
    if(formdata.value.activeStatus==true)
    {
      formdata.value.activeStatus=7
    }else{
      formdata.value.activeStatus=8
    }
     await this.api.testenvironment(formdata.value).subscribe( res =>
      {
        if(res.errorCode==undefined){
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: res.status,
          showConfirmButton: false,
          timer: 2000
        })
        }else{
          Swal.fire({
            position: 'top-end',
            icon: 'question',
            title: 'Connection Failed',
            showConfirmButton: false,
            timer: 2000
          })
        }
    });
  }
  else
  {
     alert("Invalid Form")
  }

  }
  
  async saveEnvironment()
  {
   if(this.insertForm.valid)
   {
     console.log(this.insertForm.value.activeStatus)
     if(this.insertForm.value.activeStatus==true)
      {
        this.insertForm.value.activeStatus=7
      }else{
        this.insertForm.value.activeStatus=8
      }
      console.log(this.insertForm.value.activeStatus)

      this.insertForm.value.createdBy="admin";
     this.submitted=true;
     let environment=this.insertForm.value;
     await this.api.addenvironment(environment).subscribe( res =>
      {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: res.status,
          showConfirmButton: false,
          timer: 2000
        })

        
        this.getallData();
        this.checktoupdate();
        this.checktodelete();
        this.createpopup.style.display='none'; 
        this.insertForm.reset();
        this.insertForm.get("portNumber").setValue("22");
        this.insertForm.get("connectionType").setValue("SSH");
        this.submitted=false;
    });
  }
  else
  {
     alert("Invalid Form")
  }

  }

  async updateEnvironment()
  {
    console.log(this.updateForm.value);
    console.log(this.updateForm.value.activeStatus);
    if(this.updateForm.valid)
    {
      if(this.updateForm.value.activeStatus==true)
      {
        this.updateForm.value.activeStatus=7
      }else{
        this.updateForm.value.activeStatus=8
      }
      console.log(this.updateForm.value.activeStatus);

      await this.api.updateenvironment(this.updateenvdata).subscribe( res => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: res.status,
          showConfirmButton: false,
          timer: 2000
        })
      this.removeallchecks();
      this.getallData();
      this.checktoupdate();
      this.checktodelete();
      this.updatepopup.style.display='none';
      });
      
    }
    else
    {
      alert("please fill all details");
    }
  }

  updatedata()
  {
    document.getElementById("update-popup").style.display="block"
    this.createpopup.style.display='none';

    let data:environmentobservable;
    for(data of this.environments)
    {
      if(data.environmentId==this.updateid)
      {
        this.updateenvdata=data;
        console.log(this.updateenvdata);
        break;
      }
    }
    
  }

  close()
  { 
    this.resetEnvForm();
    document.getElementById('create').style.display='none';
    document.getElementById('update-popup').style.display='none';
  }


  async deleteEnvironments(){
    
		const selectedEnvironments = this.environments.filter(product => product.checked==true).map(p => p.environmentId);
    if(selectedEnvironments.length!=0)
    {
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
    
          this.api.deleteenvironment(selectedEnvironments).subscribe( res =>{ 
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: res.status,
              showConfirmButton: false,
              timer: 2000
    
            })
            this.removeallchecks();
            this.getallData(); 
            this.checktoupdate();
            this.checktodelete();       
          })
          
        }
      })
      
    }
    
          
    
  }
 


  checktoupdate()
  {
    const selectedEnvironments = this.environments.filter(product => product.checked==true);
    if(selectedEnvironments.length==1)
    {
      this.updateflag=true;
      this.updateid=selectedEnvironments[0].environmentId;
    }else
    {
      this.updateflag=false;
    }
  }

  

  checktodelete()
  {
    const selectedEnvironments = this.environments.filter(product => product.checked).map(p => p.environmentId);
    if(selectedEnvironments.length>0)
    {
      this.deleteflag=true;
    }else
    {
      this.deleteflag=false;
    }
  }





  checkEnableDisableBtn(id, event)
  {
    console.log(event.target.checked);
    this.environments.find(data=>data.environmentId==id).checked=event.target.checked;
    if(this.environments.filter(data=>data.checked==true).length==this.environments.length)
    {
      this.checkflag=true;
    }else
    {
      this.checkflag=false;  
    }
    this.checktoupdate();
    this.checktodelete();
  }




  deploybotenvironment()
  {
    const selectedEnvironments = this.environments.filter(product => product.checked).map(p => p.environmentId);
    if(selectedEnvironments.length!=0)
    {
      this.api.deployenvironment(selectedEnvironments).subscribe( res =>{ 
        let data:any=res
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: data[0].status,
          showConfirmButton: false,
          timer: 2000
        })
        this.removeallchecks();
        this.getallData(); 
        this.checktoupdate();
        this.checktodelete();     
      })
    }
  }
  
  applyFilter(filterValue: string) {
    
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource1.filter = filterValue;
  }


  removeallchecks()
  {
    for(let i=0;i<this.environments.length;i++)
    {
      this.environments[i].checked= false;
      console.log(this.environments[i]);
    }
    console.log(this.environments);
  }

}

