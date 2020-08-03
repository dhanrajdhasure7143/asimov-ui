import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { DataTransferService } from '../services/data-transfer.service';

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
  overlay_acc_model: boolean=false;
  overlay_user_manage_model: boolean=false;
  overlay_config_alert_model: boolean=false;
  overlay_invite_user_model: boolean=false;
  overlay_notifications_model: boolean=false;
 
  
  constructor(private router:Router, private dataTransfer:DataTransferService) { }

  ngOnInit() {
    this.parent_subscription = this.dataTransfer.current_parent_module.subscribe(res => this.parent_link = res);
    this.child_subscription = this.dataTransfer.current_child_module.subscribe(res => this.child_link = res);
    this.pages = [
      {"img":"assets/images/pi.svg", "title":"Process Intelligence", "link":"/pages/processIntelligence/upload"},
      {"img":"assets/images/busstudioicon1.svg", "title":"Business Process Studio", "link":"/pages/businessProcess/home"},
      {"img":"assets/images/robothand.svg", "title":"RPA", "link":"/pages/rpautomation/home"},
      {"img":"assets/images/settingsicon.svg", "title":"Service Orchestration", "link":"/pages/serviceOrchestration/home"}
    ];
  }

  loopTrackBy(index, term){
    return index;
  }
  
  slideUp(e){
     if(e=="my_acc"){
      this.overlay_user_manage_model = false;
      this.overlay_config_alert_model = false;
      this.overlay_invite_user_model = false;
      this.overlay_acc_model = true;
      
       //this.dataTransfer.setOverlayData("my_acc");
     }
     else if(e=="user_manage"){
       this.overlay_acc_model=false;
       this.overlay_config_alert_model=false;
       this.overlay_invite_user_model = false;
       this.overlay_notifications_model=false;
      this.overlay_user_manage_model = true;
     }
     else if(e=="config_alert"){
      this.overlay_acc_model=false;
      this.overlay_user_manage_model = false;
      this.overlay_invite_user_model = false;
      this.overlay_notifications_model=false;
       this.overlay_config_alert_model = true;
     }
     else if(e=="invite_user"){
      this.overlay_acc_model=false;
      this.overlay_user_manage_model = false;
       this.overlay_config_alert_model = false;
       this.overlay_notifications_model=false;
      this.overlay_invite_user_model = true;
     }
     else{
      this.overlay_acc_model=false;
      this.overlay_user_manage_model = false;
       this.overlay_config_alert_model = false;
      this.overlay_invite_user_model = false;
      this.overlay_notifications_model = true;
     }
   
    var modal = document.getElementById('header_overlay');
    modal.style.display="block";
  }
  // slideDown(){
  //   var modal = document.getElementById('header_overlay');
  //   modal.style.display="none";
  // }
  ngOnDestroy(){
    this.parent_subscription.unsubscribe();
    this.child_subscription.unsubscribe();
  }
  logout(){
    localStorage.clear();
    this.router.navigate(["/"])
  }




 
}
