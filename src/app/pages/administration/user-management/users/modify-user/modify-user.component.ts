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
  userData: any;
  categories: any;
  allRoles: any[];
  roles =[];
  roleObj: any;
  roleIds:any[]=[];
  isdprtDisabled:boolean=false;
  people=[{name:"test",id:"01"}];
  isdisabled:boolean=true;
  departments = [];
  email:any;
  role:any;
  depts:any=[];
  errShow:boolean=false;
  constructor(private formBuilder: FormBuilder,private api:RestApiService,
    private router:Router, private route:ActivatedRoute) { 
      this.route.queryParams.subscribe(data=>{​​​​​​
        this.userData=data;
      })
    }

  ngOnInit(): void {
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
   this.depts=[];
  this.api.getAllRoles(2).subscribe(resp => {
    this.allRoles = resp;
        this.allRoles.forEach(x => {
          if(x.displayName === this.userData.role){
            roles1.push(x.id)
          }
        });
      this.userData.dept.forEach(element => {
        this.categories.forEach(x => {
          if(x.categoryName === element){
             this.depts.push(x.categoryId)
          }
          
        });
        
      });
      if(roles1[0]== '8'){
        this.isdprtDisabled=true;
      }
      this.email=this.userData.id;
      this.departments=this.depts;
      this.role=roles1[0];
  })
//  })
}

updateUser(){
 let roles_list = [];
 this.errShow=false;
 roles_list.push(this.role);
  if(this.departments.length==0){
    this.errShow=true;
    return;
  }
  let body={
      "userId":this.email,
      "department":this.departments.toString(),
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

onchangeRole(value){
  this.departments=[];
  if(value== '8'){
    this.categories.forEach(element => {
      this.departments.push(element.categoryId)
    });
    this.isdprtDisabled=true;
  }else{
    this.departments=this.depts;
    this.isdprtDisabled=false;
  }
}

}
