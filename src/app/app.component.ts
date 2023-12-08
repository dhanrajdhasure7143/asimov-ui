import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserIdleService } from 'angular-user-idle';
import { APP_CONFIG } from './app.config';
import { RestApiService } from './pages/services/rest-api.service';
import { AuthenticationService } from './services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  newAccessToken: any;
  isApprovalScreen:boolean = false;

  constructor(private userIdle: UserIdleService, private apiservice: RestApiService,
     private authservice: AuthenticationService, @Inject(APP_CONFIG) private config,
     private router: Router,private route:ActivatedRoute,
     private messageService: MessageService) {
      this.route.queryParams.subscribe(res=>{
        this.isApprovalScreen = false;
        if(res)
        if(res.token)this.isApprovalScreen = true;
      })
      }

  ngOnInit() {
    addEventListener("offline",(e)=>{
      this.messageService.add({key: 'tc',severity:'error', summary: '', detail: 'Please check your internet connection.'});
    });
    addEventListener("online",(e)=>{
      this.messageService.add({key: 'tc',severity:'success', summary: '', detail: 'You are now online.'});

    });
    //Start watching for user inactivity.
    this.userIdle.startWatching();
    this.userIdle.ping$.subscribe(() => {
      if(localStorage.getItem("accessToken") != null){
        let tenantId=localStorage.getItem('tenantName')
        let masterTenant=localStorage.getItem("masterTenant")
        this.apiservice.getNewAccessTokenByTenantId(tenantId,masterTenant).subscribe(resp=>{
          this.newAccessToken=resp;
          localStorage.setItem('accessToken', this.newAccessToken.accessToken);
      })}
    })
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
           if(token == undefined && !this.isApprovalScreen) { 
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
