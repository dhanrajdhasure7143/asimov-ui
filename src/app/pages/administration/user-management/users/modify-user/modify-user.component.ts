import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from 'src/app/pages/services/rest-api.service';

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.css']
})
export class ModifyUserComponent implements OnInit {

  editUserForm:FormGroup;
  userId: any;
  categories: any;
  allRoles: any;
  roles =[];
  constructor(private formBuilder: FormBuilder,private api:RestApiService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.editUserForm=this.formBuilder.group({
      email: ["", Validators.compose([Validators.required])],
      departments: ["", Validators.compose([Validators.required])],
      role: ["", Validators.compose([Validators.required])]
      })
      this.route.queryParams.subscribe(data=>{​​​​​​
        this.userId=data.id;
        // this.roles = localStorage.getItem("userRole").split(',');
        this.editUserForm.get("email").setValue(this.userId);
        this.editUserForm.get("role").setValue(localStorage.getItem("userRole"));
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
  this.api.getAllRoles(2).subscribe(resp => {
    this.allRoles = resp;
 })
}
}
