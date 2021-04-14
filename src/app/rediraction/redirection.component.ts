import { Component, OnInit, Inject } from '@angular/core';
import { AuthenticationService } from '../services';
import { APP_CONFIG } from 'src/app/app.config';
@Component({
    selector: 'app-redirection',
    templateUrl: './redirection.component.html'
})
export class RedirectionComponent{
  constructor(private authService:AuthenticationService, @Inject(APP_CONFIG) private config) { 
    this.authService.logout();
      localStorage.clear();
      var input = btoa("Signout");
      window.location.href=this.config.logoutRedirectionURL+'?input='+input;
  }
  ngOnInit() {}
}