import { Component } from '@angular/core';
import { AuthenticationService } from '../services';

@Component({
    selector: 'app-redirection',
    templateUrl: './redirection.component.html'
})
export class RedirectionComponent{
  constructor(private authService:AuthenticationService) { 
    this.authService.logout();
      localStorage.clear();
      window.location.href='http://eiapclouddev.epsoftinc.in/';
  }
  ngOnInit() {}
}