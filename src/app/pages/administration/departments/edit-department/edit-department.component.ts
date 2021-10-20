import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.css']
})
export class EditDepartmentComponent implements OnInit {
  departmentdata: any;
  editDepartmentForm:FormGroup;
  constructor(private formBuilder: FormBuilder,private route:ActivatedRoute,private api: RestApiService) { }

  ngOnInit(): void {
    this.editDepartmentForm=this.formBuilder.group({
      departmentName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      })
      this.getDepartmentdetails();
  }

  getDepartmentdetails(){

    this.route.queryParams.subscribe(data=>{​​​​​​
      let paramsdata:any=data
      this.departmentdata=paramsdata
      this.editDepartmentForm.get("departmentName").setValue(this.departmentdata.name);
    })
  }

  updateDepartment(){
      let body = {
        "categoryId": this.departmentdata.id,
        "categoryName": this.editDepartmentForm.get("departmentName").value
      }
      this.api.updateCategory(body).subscribe(resp => {
        if(resp.message === "Successfully updated the category"){
          Swal.fire({
            title: 'Success',
            text: "Department Updated Successfully !!",
            position: 'center',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#007bff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
        }).then((result) => {
        })
        }else {
          Swal.fire("Error",resp.message,"error");
        }
      })
  }

  reseteditdepartment(){
    this.editDepartmentForm.reset();
    this.editDepartmentForm.get("departmentName").setValue("");
  }
}
