import { Component, OnInit, Inject } from '@angular/core';
import { AuthenticationService } from '../services';
import { APP_CONFIG } from 'src/app/app.config';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-redirection',
    templateUrl: './redirection.component.html'
})
export class RedirectionComponent{
  constructor(private authService:AuthenticationService,
              @Inject(APP_CONFIG) private config,
              private spinner:NgxSpinnerService) { 
      this.spinner.show();
      this.authService.logout();
      window.location.href=this.config.signoutRedirectionURL;
      //window.location.href="http://localhost:4200/#/signout";
  }

  ngOnInit() {}
  
  ngDestroy(){
    this.spinner.hide();
  }
}