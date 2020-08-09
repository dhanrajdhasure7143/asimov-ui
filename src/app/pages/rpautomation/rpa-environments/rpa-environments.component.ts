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
import { SearchPipe } from 'src/app/shared/pipes/search.pipe';

@Component({
  selector: 'app-environments',
  templateUrl:'./rpa-environments.component.html',
  styleUrls: ['./rpa-environments.component.css']
})
  export class RpaenvironmentsComponent implements OnDestroy, OnInit{
    @ViewChild('closebutton', {static: false}) closebutton  
    @ViewChild(DataTableDirective,{static: false}) dtElement: DataTableDirective;
    @Output()
    title:EventEmitter<string> = new EventEmitter<string>();
    public environments : environmentobservable [];
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
    isDtInitialized:boolean = false;
    dtTrigger: Subject<any> =new Subject();
    dtOptions: DataTables.Settings = {};
    
  constructor(private api:RestApiService, 
    private router:Router, 
    private formBuilder: FormBuilder,
    private environmentservice:EnvironmentsService, 
    private chanref:ChangeDetectorRef, 
    private dt:DataTransferService,
    private hints:RpaEnvHints
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
      comments:[""],
      
    })

    this.updateForm=this.formBuilder.group({
      update_environmentName: ["", Validators.required],
      update_environmentType: ["", Validators.required],
      update_agentPath: ["", Validators.required],
      update_hostAddress: ["", Validators.compose([Validators.required, Validators.pattern(ipPattern)])],
      update_username: ["", Validators.required],
      update_password: ["", Validators.required],
      update_connectionType: ["",Validators.compose([Validators.required, Validators.pattern("[A-Za-z]*")])],
      update_portNumber: ["",  Validators.compose([Validators.required, Validators.pattern("[0-9]*")])],
      update_comments: [""]
    
    })
    this.updateflag=false;
    this.deleteflag=false;
    
  }
  ngOnInit() {
    
    this.dt.changeParentModule({"route":"/pages/rpautomation/home", "title":"RPA Studio"});
    this.dt.changeChildModule({"route":"/pages/rpautomation/environments","title":"Environments"});

    this.createpopup=document.getElementById('create')
    this.updatepopup=document.getElementById('update-popup');
    this.dt.changeHints(this.hints.rpaenvhints);
    //console.log(this.hints.rpaenvhints)
    this.title.emit("Environments")
    this.dtOptions = {
      pagingType: 'simple',
      pageLength: 10,
      scrollX: true,
      dom:'<f<t>lp>',
      columnDefs:[ { orderable: false, targets: [0]}],
      responsive:true,
      retrieve:true,
      scrollY: "true",
      language: {
        searchPlaceholder: 'Search',
      }
      };

    this.getallData();
    this.createpopup.style.display='none';
    this.updatepopup.style.display='none';
  }

  savedata(){}
 async getallData()
  {

    await this.api.listEnvironments().subscribe(
    data => {
        this.environments = data as environmentobservable [];	
        this.chanref.detectChanges();
        this.dtTrigger.next();
      },
      (err: HttpErrorResponse) => {
      }
    );
  }


  checkAllCheckBox(ev) {
    this.environments.forEach(x => x.checked = ev.target.checked)
    this.checkEnableDisableBtn()
	}

  isAllCheckBoxChecked() {
		return this.environments.every(p => p.checked);
  }
  
  create()
  {
    this.createpopup.style.display='block';
    this.updatepopup.style.display='none';
  
  }

  
  async saveEnvironment()
  {
   if(this.insertForm.valid)
   {
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
        this.rerender();
        this.insertForm.reset();
        this.createpopup.style.display='none'; 
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
    if(this.updateForm.valid)
    {
      await this.api.updateenvironment(this.updateenvdata).subscribe( res => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: res.status,
          showConfirmButton: false,
          timer: 2000
        })
      this.chanref.detectChanges();
      this.rerender();
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
    //this.createpopup.style.display='none';
    
  }

  close()
  { 
    document.getElementById('create').style.display='none';
    document.getElementById('update-popup').style.display='none';
  }


  async deleteEnvironments(){

		const selectedEnvironments = this.environments.filter(product => product.checked).map(p => p.environmentId);
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
 
            //this.chanref.detectChanges();
          })
          
        }
      })
      
    }
    this.rerender();
          
    
  }
 

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  checktoupdate()
  {
    const selectedEnvironments = this.environments.filter(product => product.checked).map(p => p.environmentId);
    if(selectedEnvironments.length==1)
    {
      this.updateflag=true;
      this.updateid=selectedEnvironments[0];
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


  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }



  checkEnableDisableBtn()
  {
    this.checktoupdate();
    this.checktodelete();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      this.environmentservice.getfulldata().subscribe(
        data => 
        {
          this.environments = data as environmentobservable [];	
          this.chanref.detectChanges();
          this.dtTrigger.next();
          this.environments.forEach(x => ! x.checked)
          this.checkEnableDisableBtn()
        });

      });
      
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
            
      })
    }
  }



}

