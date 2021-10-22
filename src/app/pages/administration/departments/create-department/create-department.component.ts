import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.css']
})
export class CreateDepartmentComponent implements OnInit {

  createDepartmentForm:FormGroup;
  constructor(private formBuilder: FormBuilder,private api:RestApiService,) { }

  ngOnInit(): void {

    this.createDepartmentForm=this.formBuilder.group({
      departmentName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      })
  }


  savedepartments(){
    let body = {
      "categoryName": this.createDepartmentForm.value.departmentName
    }
    this.api.createCategory(body).subscribe(resp => {
      if(resp.message === "Successfully created the category"){
        Swal.fire({
          title: 'Success',
          text: "Department Created Successfully !!",
          position: 'center',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#007bff',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
      }).then((result) => {
        this.resetdepartment();
      }) 
      }else {
        Swal.fire("Error",resp.message,"error");
      }
    })
  }

  resetdepartment(){
    this.createDepartmentForm.reset();
    this.createDepartmentForm.get("departmentName").setValue("");
  }
}
