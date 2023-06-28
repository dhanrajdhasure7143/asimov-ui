import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.css']
})
export class EditDepartmentComponent implements OnInit {
  departmentdata: any;
  editDepartmentForm:FormGroup;
  departmentowner: any;
  users_list:any=[];
  constructor(private formBuilder: FormBuilder,
    private route:ActivatedRoute,
    private router:Router,
    private api: RestApiService,
    private loader:LoaderService) { }

  ngOnInit(): void {
    this.editDepartmentForm=this.formBuilder.group({
      departmentName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      owner: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      })
      this.getDepartmentdetails();
      this.loader.show();
      this.getallusers();
  }

  getDepartmentdetails(){

    this.route.queryParams.subscribe(data=>{​​​​​​
      let paramsdata:any=data
      this.departmentdata=paramsdata.id
     // this.editDepartmentForm.get("departmentName").setValue(this.departmentdata.name);
      this.getDepartmentdetailsbyId(this.departmentdata)
    })
  }

  updateDepartment(){
      let body = {
        "categoryId": this.departmentdata,
        "categoryName": this.editDepartmentForm.get("departmentName").value,
        "owner":this.editDepartmentForm.get("owner").value
      }
      this.api.updateDepartment(body).subscribe(resp => {
        if(resp.message === "Successfully updated the category"){
          Swal.fire({
            title: 'Success',
            text: "Department updated successfully!",
            position: 'center',
            icon: 'success',
            showCancelButton: false,
            customClass: {
              confirmButton: 'btn bluebg-button',
              cancelButton:  'btn new-cancelbtn',
            },
    
            heightAuto: false,
           
            confirmButtonText: 'Ok'
        }).then((result) => {
          this.userManagement();
        })
        }
        else if(resp.message==="Category already exists"){
          Swal.fire("Error","Department already exists.","error");
        }
        else {
          Swal.fire("Error",resp.message,"error");
        }
      })
  }


  getDepartmentdetailsbyId(id){
    this.api.getDepartmentDetails(id).subscribe(resp => {
      let response:any=resp;
      this.departmentowner=response.data.owner
      this.editDepartmentForm.get("departmentName").setValue(response.data.categoryName);
      this.editDepartmentForm.get("owner").setValue(this.departmentowner);
    })
  }

  reseteditdepartment(){
    this.editDepartmentForm.reset();
    this.editDepartmentForm.get("departmentName").setValue("");
    this.editDepartmentForm.get("owner").setValue("");
  }

  getallusers(){
    let tenantid=localStorage.getItem("masterTenant")
    this.api.getuserslist(tenantid).subscribe(item=>{
      let users:any=item
      this.users_list=users;
      this.loader.hide();
    })
  }
  userManagement(){
    this.router.navigate(["/pages/admin/user-management"],{
      queryParams:{index:1}
    })
  }
}
