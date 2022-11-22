import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.css']
})
export class CreateDepartmentComponent implements OnInit {

  createDepartmentForm:FormGroup;
  users_list:any=[];
  constructor(private formBuilder: FormBuilder,private api:RestApiService,private router:Router,
    private loader: LoaderService) { }

  ngOnInit(): void {
    this.loader.show();
    this.createDepartmentForm=this.formBuilder.group({
      departmentName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      owner: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      })
      this.getallusers();
  }


  savedepartments(){
    let body = {
      "categoryName": this.createDepartmentForm.value.departmentName,
      "owner":this.createDepartmentForm.value.owner
    }
    this.loader.show();
    this.api.createDepartment(body).subscribe(resp => {
      if(resp.message === "Successfully created the category"){
        Swal.fire({
          title: 'Success',
          text: "Department Created Successfully !!",
          position: 'center',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#007bff',
          cancelButtonColor: '#d33',
          heightAuto: false,
          confirmButtonText: 'Ok'
      }).then((result) => {
        this.resetdepartment();
        this.router.navigate(['/pages/admin/user-management'])
      })
      }
      else if(resp.message==="Category already exists"){
        Swal.fire("Error","Department already exists","error");
      } else {
        Swal.fire("Error",resp.message,"error");
      }
      this.loader.hide();
    })
  }

  resetdepartment(){
    this.createDepartmentForm.reset();
    this.createDepartmentForm.get("departmentName").setValue("");
    this.createDepartmentForm.get("owner").setValue("");
  }

  getallusers(){
    this.users_list=[];
    let tenantid=localStorage.getItem("tenantName")
    this.api.getuserslist(tenantid).subscribe(item=>{
      let users:any=item;
      users.forEach(e=>{
        if(e.user_role_status != "INACTIVE"){
          this.users_list.push(e);
        }
      })
      this.loader.hide();
    })
  }
}
