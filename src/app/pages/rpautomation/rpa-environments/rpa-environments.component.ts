import { Component, OnInit,OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import {HttpClient,HttpErrorResponse} from '@angular/common/http';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { environmentobservable } from './environmentobservable';
import { EnvironmentsService } from './rpa-environments.service';
import { checkboxlist } from './checkboxlist';
@Component({
  selector: 'app-environments',
  templateUrl:'./rpa-environments.component.html',
  styleUrls: ['./rpa-environments.component.css']
})
  export class RpaenvironmentsComponent implements OnDestroy, OnInit{
    public environments : environmentobservable [];
    public createpopup:Boolean;
    public button:string;
    public updatepopup:Boolean;
    public delete_elements:number[];
    public masterSelected:Boolean;
    public checkitems: checkboxlist[];
    public updateenvdata:environmentobservable;
    public environmentName:FormControl;
    public insertForm:FormGroup;
    public updateForm:FormGroup;
    public updateflag:Boolean;
    private updateid:number;
  isDtInitialized:boolean = false;
  dtTrigger: Subject<any> =new Subject();
  dtOptions: DataTables.Settings = {};
  constructor(private httpService:HttpClient, private formBuilder: FormBuilder,private environmentservice:EnvironmentsService, private chanref:ChangeDetectorRef) { 
    console.log("app doing good")
    this.insertForm=this.formBuilder.group({
      environmentName:["", Validators.required],
      environmentType:["", Validators.required],
      agentPath:["", Validators.required],
      hostAddress:["", Validators.required],
      userName:["", Validators.required],
      password:["", Validators.required],
      connectionType:["SSH", Validators.required],
      portNumber:["22", Validators.required],
      comments:[""],
      
    })

    this.updateForm=this.formBuilder.group({
      update_environmentName: ["", Validators.required],
      update_environmentType: ["", Validators.required],
      update_agentPath: ["", Validators.required],
      update_hostAddress: ["", Validators.required],
      update_userName: ["", Validators.required],
      update_password: ["", Validators.required],
      update_connectionType: ["", Validators.required],
      update_portNumber: ["", Validators.required],
      update_comments: [""]
    
    })
    this.updateflag=false;

    
  }
  @ViewChild(DataTableDirective,{static: false}) 
  dtElement: DataTableDirective;
  ngOnInit() {
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 4,
      scrollX: true,
      dom:'<<"data"f><t>lip>',
      responsive:true,
      retrieve:true,
      };
    this.getallData();
    this.createpopup=false;
    this.updatepopup=false;
  }


 async getallData()
  {

    await this.environmentservice.getfulldata().subscribe(
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
    this.updateflag=false;
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
     await this.environmentservice.addenvironment(environment).subscribe( res =>
      {
        alert(res);
        
        this.rerender();
        this.insertForm.reset();
        this.createpopup=false; 
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
      await this.environmentservice.updateenvironment(this.updateenvdata).subscribe( res => {
      alert(res);
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
      await this.environmentservice.deleteenvironment(selectedEnvironments).subscribe( res =>{ 
        alert(res);  
        this.chanref.detectChanges();
        this.rerender();
      })
    }
  }
 

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  checktoupdate()
  {
    const selectedEnvironments = this.environments.filter(product => product.checked).map(p => p.environmentId);
    if(selectedEnvironments.length==1){
      this.updateflag=true;
      this.updateid=selectedEnvironments[0];
    }else
    {
      this.updateflag=false;
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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
        });

      });
    
      this.environments.forEach(x => ! x.checked)
      this.updateflag=false;
  }

  savedata(){}
  

  

 

}

