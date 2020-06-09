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
import {Router} from "@angular/router";
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
    public createpopup:Boolean;
    public button:string;
    public updatepopup:Boolean;
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
    isDtInitialized:boolean = false;
    dtTrigger: Subject<any> =new Subject();
    dtOptions: DataTables.Settings = {};
    
  constructor(private api:RestApiService, private router:Router, private formBuilder: FormBuilder,private environmentservice:EnvironmentsService, private chanref:ChangeDetectorRef) { 
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
    this.title.emit("Environments")
    this.dtOptions = {
      pagingType: 'simple',
      pageLength: 10,
      scrollX: true,
      dom:'<f<t>lp>',
      columnDefs:[ { orderable: false, targets: [0]}],
      responsive:true,
      retrieve:true,
      };

    this.getallData();
    this.createpopup=false;
    this.updatepopup=false;
  }


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
    this.createpopup=true;
    this.updatepopup=false;
  }

  async saveEnvironment()
  {
   if(this.insertForm.valid)
   {
     let environment=this.insertForm.value;
     await this.api.addenvironment(environment).subscribe( res =>
      {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: res,
          showConfirmButton: false,
          timer: 2000
        })
        this.rerender();
        this.insertForm.reset();
        this.createpopup=false; 
        this.insertForm.get("portNumber").setValue("22");
        this.insertForm.get("connectionType").setValue("SSH");
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
          title: res,
          showConfirmButton: false,
          timer: 2000
        })
      this.chanref.detectChanges();
      this.rerender();
      this.updatepopup=false;
      });
      
    }
    else
    {
      alert("please fill all details");
    }
  }

  updatedata()
  {
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
    this.createpopup=false;
    this.updatepopup=true;
  }

  close()
  {
    this.createpopup=false;
    this.updatepopup=false;
  }


  async deleteEnvironments(){

		const selectedEnvironments = this.environments.filter(product => product.checked).map(p => p.environmentId);
    if(selectedEnvironments.length!=0)
    {
      
      this.closebutton.nativeElement.click();
    
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
              title: res,
              showConfirmButton: false,
              timer: 2000
    
            })
            this.chanref.detectChanges();
            this.rerender();
          })
          
        }
      })
      
    }
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


  navigatetoworkspace()
  {
    this.router.navigate(["/environments",{ queryParams: { id: '1' } }]);
  }
  

  

 

}

