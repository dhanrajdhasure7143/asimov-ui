import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { DataTransferService } from '../services/data-transfer.service';
import { RestApiService } from '../services/rest-api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  selectedIndex: number;
  parent_link:any={};
  child_link:any={};
  pages:any[];
  parent_subscription;
  child_subscription;
  public userRole:any = [];
  error: string;

  constructor(private router:Router, private dataTransfer:DataTransferService, private rpa:RestApiService) { }

  ngOnInit() {
    this.parent_subscription = this.dataTransfer.current_parent_module.subscribe(res => this.parent_link = res);
    
    
    this.child_subscription = this.dataTransfer.current_child_module.subscribe(res => this.child_link = res);
    this.rpa.getUserRole(2).subscribe(res=>{
      this.userRole=res.message;
     
      localStorage.setItem('userRole',this.userRole);
    console.log("user role is",this.userRole)
    if(this.userRole.includes('SuperAdmin')){
      this.pages = [
        {"img":"assets/images/pi.svg", "title":"Process Intelligence", "link":"/pages/processIntelligence/upload"},
        {"img":"assets/images/busstudioicon1.svg", "title":"Business Process Studio", "link":"/pages/businessProcess/home"},
        {"img":"assets/images/robothand.svg", "title":"RPA", "link":"/pages/rpautomation/home"},
        {"img":"assets/images/settingsicon.svg", "title":"Service Orchestration", "link":"/pages/serviceOrchestration/home"}
         ];
         
      
     }else if(this.userRole.includes('Admin')){
      this.pages = [
        {"img":"assets/images/pi.svg", "title":"Process Intelligence", "link":"/pages/processIntelligence/upload"},
        {"img":"assets/images/busstudioicon1.svg", "title":"Business Process Studio", "link":"/pages/businessProcess/home"},
        {"img":"assets/images/robothand.svg", "title":"RPA", "link":"/pages/rpautomation/home"},
        {"img":"assets/images/settingsicon.svg", "title":"Service Orchestration", "link":"/pages/serviceOrchestration/home"}
        
      ];
   
     }else if(this.userRole.includes('RPA Admin')){
      this.pages = [
        {"img":"assets/images/robothand.svg", "title":"RPA", "link":"/pages/rpautomation/home"},
        {"img":"assets/images/settingsicon.svg", "title":"Service Orchestration", "link":"/pages/serviceOrchestration/home"}
        
      ];
   
     }else if(this.userRole.includes('RPA Designer')){
      this.pages = [
        {"img":"assets/images/robothand.svg", "title":"RPA", "link":"/pages/rpautomation/home"},
        
      ];
   
     }else if(this.userRole.includes('Data Architect')){
      this.pages = [
        {"img":"assets/images/busstudioicon1.svg", "title":"Business Process Studio", "link":"/pages/businessProcess/home"},
        
      ];
   
     }else if(this.userRole.includes('Process Designer')){
      this.pages = [
        {"img":"assets/images/busstudioicon1.svg", "title":"Business Process Studio", "link":"/pages/businessProcess/home"},
        
      ];
   
     }else if(this.userRole.includes('Automation Designer')){
      this.pages = [
        {"img":"assets/images/busstudioicon1.svg", "title":"Business Process Studio", "link":"/pages/businessProcess/home"},
        
      ];
   
     }else if(this.userRole.includes('Process Analyst')){
      this.pages = [
        {"img":"assets/images/pi.svg", "title":"Process Intelligence", "link":"/pages/processIntelligence/upload"},
        
      ];
   
     }else if(this.userRole.includes('Process Architect')){
      this.pages = [
        {"img":"assets/images/pi.svg", "title":"Process Intelligence", "link":"/pages/processIntelligence/upload"},
        
      ];
   
     }else{

     }
    },error => {
      this.error = "Please complete your registration process";
      
    })
    // this.pages = [
    //   {"img":"assets/images/pi.svg", "title":"Process Intelligence", "link":"/pages/processIntelligence/upload"},
    //   {"img":"assets/images/busstudioicon1.svg", "title":"Business Process Studio", "link":"/pages/businessProcess/home"},
    //   {"img":"assets/images/robothand.svg", "title":"RPA", "link":"/pages/rpautomation/home"},
    //   {"img":"assets/images/settingsicon.svg", "title":"Service Orchestration", "link":"/pages/serviceOrchestration/home"}
    // ];
  }

  loopTrackBy(index, term){
    return index;
  }

  ngOnDestroy(){
    this.parent_subscription.unsubscribe();
    this.child_subscription.unsubscribe();
  }
  logout(){
    localStorage.clear();
    this.router.navigate(["/"])
  }
}
