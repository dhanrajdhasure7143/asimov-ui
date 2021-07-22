import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { RestApiService } from '../../services/rest-api.service';
import Swal from 'sweetalert2';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-request-file',
  templateUrl: './request-file.component.html',
  styleUrls: ['./request-file.component.css']
})
export class RequestFileComponent implements OnInit {

  
  requestFileForm:FormGroup;
  mindate: string;
  @Input('createRequestmodalref') public createRequestmodalref: BsModalRef;
  @Input('project_id') public project_id: BsModalRef;
  userslist: any;
  projectdetails: Object;
  constructor(private formBuilder: FormBuilder,private spinner:NgxSpinnerService,private api:RestApiService,
    private router: Router,) { }

  ngOnInit(): void {

    
    this.requestFileForm=this.formBuilder.group({
      fileCategory: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      
      resources: ["", Validators.compose([Validators.maxLength(50)])],
      
      description: ["", Validators.compose([Validators.required, Validators.maxLength(200)])],
      })


      


      this.getallusers();
  }

  inputNumberOnly(event){
    let numArray= ["0","1","2","3","4","5","6","7","8","9","Backspace","Tab"]
    let temp =numArray.includes(event.key); //gives true or false
   if(!temp){
    event.preventDefault();
   } 
  }

  saveRequestedfile()
  {
    this.spinner.show();
    this.requestFileForm.value.projectId=this.project_id;
    let data=this.requestFileForm.value;
    this.api.createTask(data).subscribe(data=>{
      let response:any=data;
      this.spinner.hide();
      if(response.message!=undefined)
      {
        let status: any= response;
        Swal.fire({
          title: 'Success',
          text: ""+status.message,
          position: 'center',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#007bff',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
      }).then((result) => {
       // this.resettask();
        this.projectDetailsbyId(this.project_id);
        this.createRequestmodalref.hide();
      }) 
        
      }
      else
      Swal.fire("Error",response.message,"error");
      
    })
  }



  projectDetailsbyId(id){

    this.api.getProjectDetailsById(id).subscribe( res =>{
    this.projectdetails=res;
    console.log("project details",this.projectdetails)
    this.navigatetodetailspage(this.projectdetails)
    })
  }


  navigatetodetailspage(detials){
    let encoded=Base64.encode(JSON.stringify(detials));
    let project={id:encoded}
    this.router.navigate(['/pages/projects/projectdetails',project])
  }

  getallusers()
  {
    let tenantid=localStorage.getItem("tenantName")
    this.api.getuserslist(tenantid).subscribe(item=>{
      let users:any=item
      this.userslist=users;
    })
  }
  
  // resettask(){
  //   this.requestFileForm.reset();
  //   this.requestFileForm.get("taskCategory").setValue("");
  
  // this.requestFileForm.get("resources").setValue("");
  
  // }
  // }

}
