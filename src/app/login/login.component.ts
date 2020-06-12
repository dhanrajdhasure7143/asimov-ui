import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from '../pages/services/rest-api.service';
import { DataTransferService } from '../pages/services/data-transfer.service';
export interface AccessTokenResponse{
  accessToken:string;
  refreshToken:string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  constructor(private router:Router,private rest:RestApiService,private dt:DataTransferService) { }
  getAccessToken(){
   
// this.rest.getAccessToken().subscribe((res:AccessTokenResponse) =>
//    {
//      this.dt.setaccesstoken(res.accessToken);
//      this.router.navigateByUrl("pages/home")
//     });
  }
}
