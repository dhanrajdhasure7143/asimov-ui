import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.css']
})
export class ModifyUserComponent implements OnInit {

  editUserForm:FormGroup;
  userId: any;
  categories: any;
  allRoles: any[];
  roles =[];
  roleObj: any;
  roleIds:any[]=[];
  constructor(private formBuilder: FormBuilder,private api:RestApiService,
    private router:Router, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.editUserForm=this.formBuilder.group({
      email: ["", Validators.compose([Validators.required])],
      departments: ["", Validators.compose([Validators.required])],
      role: ["", Validators.compose([Validators.required])]
      })
    this.getAllCategories();
    this.getRoles();
 
}
getAllCategories(){
  this.api.getDepartmentsList().subscribe(resp => {
    this.categories = resp.data; 
  })
 }
 getRoles(){
   var roles1:any=[];
   var depts:any=[];
  this.api.getAllRoles(2).subscribe(resp => {
    this.allRoles = resp;

    
    this.route.queryParams.subscribe(data=>{​​​​​​
   
      this.userId=data.id;
      // this.roles=["3"];
     // data.role.forEach(element => {
        this.allRoles.forEach(x => {
          if(x.displayName === data.role){
            roles1.push(x.id)
          }
          
        });
        // this.roleIds.push(this.roleObj.id);
     //   });
      data.dept.forEach(element => {
        this.categories.forEach(x => {
          if(x.categoryName === element){
             depts.push(x.categoryId)
          }
          
        });
        
      });
      this.editUserForm.get("email").setValue(this.userId);
      this.editUserForm.get("role").setValue(roles1);
      this.editUserForm.get("departments").setValue(depts);
  })
 })
}

updateUser(){
 let roles_list = [];
 roles_list.push(this.editUserForm.get("role").value);
  let body={
      "userId":this.userId,
      "department":this.editUserForm.get("departments").value.toString(),
      "rolesList": roles_list
  }

  this.api.updateUserRoleDepartment(body).subscribe(resp=> {
    if(resp.message === "Successfuly updated role of an user for particular application"){
      Swal.fire({
        title: 'Success',
        text: "User details updated Successfully !!",
        position: 'center',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#007bff',
        heightAuto: false,
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
    }).then((result) => {
      this.router.navigate(['/pages/admin/user-management'])
    })
    }else {
      Swal.fire("Error",resp.message,"error");
    }

  })
}
}
