import { Component, Inject } from '@angular/core';
import { UserIdleService } from 'angular-user-idle';
import { APP_CONFIG } from './app.config';
import { RestApiService } from './pages/services/rest-api.service';
import { AuthenticationService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  newAccessToken: any;
  constructor(private userIdle: UserIdleService, private apiservice: RestApiService,
     private authservice: AuthenticationService, @Inject(APP_CONFIG) private config) { }

  ngOnInit() {
    
    //Start watching for user inactivity.
    this.userIdle.startWatching();
    this.userIdle.ping$.subscribe(() => {
      if(localStorage.getItem("accessToken") != null){
        this.apiservice.getNewAccessToken().subscribe(resp=>{
          this.newAccessToken=resp;
          // console.log("token",this.newAccessToken.accessToken)
          localStorage.setItem('accessToken', this.newAccessToken.accessToken);
      });
      }
    });
    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(count => console.log(count));
    
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      localStorage.clear();
    var input = btoa("Signout")
    window.location.href=this.config.logoutRedirectionURL+'?input='+input;
    });
  }
  
 
  stop() {
    this.userIdle.stopTimer();
  }
 
  stopWatching() {
    this.userIdle.stopWatching();
  }
 
  startWatching() {
    this.userIdle.startWatching();
  }
 
  restart() {
    this.userIdle.resetTimer();
  }

}
