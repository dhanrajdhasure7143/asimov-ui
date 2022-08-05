import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from '../pages/services/rest-api.service';
import { AuthenticationService } from '../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  password:any;
  userName:any;

  constructor(private router:Router,private rest:RestApiService, private authService:AuthenticationService) { }

  ngOnInit() {
    this.authService.logout();
  }

  getAccessToken(){
    this.rest.getAccessToken().subscribe(res =>{
      localStorage.setItem("accessToken", res['accessToken']);
      localStorage.setItem('authKey', 'V2t6Q2Q3N01Gb1dDR252TXJ0TzJiT0pEaHR3a1ZXNFVBdjlIRVprVG9Vaz0=');
      this.router.navigateByUrl("pages/home")
    });
  }
}
