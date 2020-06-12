import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from '../pages/services/rest-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  constructor(private router:Router,private rest:RestApiService) { }
  getAccessToken(){
   
this.rest.getAccessToken().subscribe(res =>{
     localStorage.setItem("accessToken", res['accessToken']);
     this.router.navigateByUrl("pages/home")
    });
  }
}
