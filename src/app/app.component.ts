import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserIdleService } from 'angular-user-idle';
import { APP_CONFIG } from './app.config';
import { RestApiService } from './pages/services/rest-api.service';
import { AuthenticationService } from './services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  newAccessToken: any;
  constructor(private userIdle: UserIdleService, private apiservice: RestApiService,
     private authservice: AuthenticationService, @Inject(APP_CONFIG) private config,
     private router: Router,private toastr: ToastrService) { }

  ngOnInit() {
    addEventListener("offline",(e)=>{
      this.toastr.error('Please check your internet connection');
    });
    addEventListener("online",(e)=>{
      this.toastr.success('You are now online');
    });
    //Start watching for user inactivity.
    this.userIdle.startWatching();
    this.userIdle.ping$.subscribe(() => {
      if(localStorage.getItem("accessToken") != null){
        this.apiservice.getNewAccessToken().subscribe(resp=>{
          this.newAccessToken=resp;
          localStorage.setItem('accessToken', this.newAccessToken.accessToken);
      });
      }
    });
    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(count => console.log(count));
    
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      localStorage.clear();
    // var input = btoa("Signout")
    // window.location.href=this.config.logoutRedirectionURL+'?input='+input;
    this.router.navigate(['/redirect'])
    });

    window.addEventListener('storage', (event) => {
      if (event.storageArea == localStorage) {
           let token = localStorage.getItem('accessToken');
           if(token == undefined) { 
             // Perform logout
             //Navigate to login/home
             this.router.navigate(['/redirect']);
           }
      }
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
