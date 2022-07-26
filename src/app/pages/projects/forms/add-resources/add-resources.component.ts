import { Component, Output, EventEmitter, Input,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Base64 } from 'js-base64';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { RestApiService } from '../../../services/rest-api.service';
import { ProjectsProgramsTableComponent } from '../../projects-list-screen/projects-programs-table/projects-programs-table.component';
import { Subscription } from 'rxjs';
import { DataTransferService } from 'src/app/pages/services/data-transfer.service';

@Component({
  selector: 'app-add-resources',
  templateUrl: './add-resources.component.html',
  styleUrls: ['./add-resources.component.css']
})
export class AddResourcesComponent implements OnInit {

  addresourcesForm:FormGroup;
  mindate: string;
  @Input('addresourcemodalref') public addresouceref: BsModalRef;
  @Input('userslist') public userslist:any[];
  @Input('resources') public resourcesdata:any;
  @Output() newItemEvent = new EventEmitter<String>();
  // userslist: any = [];
  projectdetails: Object;
  selectedresources:any=[];
  sub:Subscription;
  constructor(private formBuilder: FormBuilder,private spinner:NgxSpinnerService,private api:RestApiService,
    private router: Router,private rpa:RestApiService,private dataTransfer: DataTransferService) { }
  ngOnInit() {


    this.addresourcesForm=this.formBuilder.group({
      
      resources: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      
      })

     // this.getallusers();
      
  }

  inputNumberOnly(event){
    let numArray= ["0","1","2","3","4","5","6","7","8","9","Backspace","Tab"]
    let temp =numArray.includes(event.key); //gives true or false
   if(!temp){
    event.preventDefault();
   } 
  }

 
  getallusers() {
    this.spinner.show();
    this.sub = this.dataTransfer.logged_userData.subscribe(res => {
      if (res) {
        let tenantid = res.tenantID;
        if(res.tenantID)
        //this.sub.unsubscribe();
        this.rpa.getusername(tenantid).subscribe(res => {
          this.userslist=res;
          this.spinner.hide();
        })
      }
    });
  }


  // getallusers()
  // {
  //   let tenantid=localStorage.getItem("tenantName")
  //   this.spinner.show();
  //   this.api.getuserslist(tenantid).subscribe(item=>{
  //     let users:any=item
  //     this.userslist=users;
  //     this.spinner.hide();
  //   })
  // }


  getresource(userId)
  {
   return (this.resourcesdata.find(data=>data==userId) ==undefined)?false:true;
  }
  save() {
    let resources=this.addresourcesForm.get('resources').value
   
    this.newItemEvent.emit(JSON.stringify(resources));
  }
  resetresources(){
    this.addresourcesForm.reset();
    this.addresourcesForm.get("resources").setValue("");
  
  }
}
