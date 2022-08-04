import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input('projectid') public projectid: BsModalRef;
  @Input('filecategoriesList') public filecategoriesList:any[]=[];
  userslist: any;
  projectdetails: Object;
  onupdate: any;
  @Output() onrequest=new EventEmitter<boolean>();
  filecategories: any;
  uploadFileDescriptionFlag: boolean = false;
  constructor(private formBuilder: FormBuilder,private spinner:NgxSpinnerService,private api:RestApiService,
    private router: Router,) { }

  ngOnInit(): void {

    
    this.requestFileForm=this.formBuilder.group({
      fileCategory: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      
      resources: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      
      description: ["", Validators.compose([Validators.required, Validators.maxLength(200)])],
      })

    this.getFileCategories();
      


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
    
  
    
    var body={
      "category": this.requestFileForm.get("fileCategory").value,
      "comments": this.requestFileForm.get("description").value,
      "projectId": this.projectid,
      "requestFrom": localStorage.getItem("ProfileuserId"),
      "requestTo": this.requestFileForm.get("resources").value,
        }
        this.api.requestFile(body).subscribe(data=>{
          this.onrequest.emit(true);
          this.createRequestmodalref.hide();
          let response:any=data;
          //this.onupdate.emit(true);
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
          }) 
            
          }
          else
          Swal.fire("Error",response.message,"error");
          
        })
  }



  projectDetailsbyId(id){

    this.api.getProjectDetailsById(id).subscribe( res =>{
    this.projectdetails=res;
    
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
  
   resettask(){
    this.requestFileForm.reset();
    this.requestFileForm.get("taskCategory").setValue("");
  
    this.requestFileForm.get("resources").setValue("");
  
   }
   getFileCategories(){
    this.api.getFileCategories().subscribe(data =>{
      this.filecategories=data;
  })
  }
  uploadFileDescriptionMaxLength(value){
    if(value.length > 150){
    this.uploadFileDescriptionFlag = true;
    }else{
      this.uploadFileDescriptionFlag = false;
    }
     }
   }


