import { Component, OnInit,Input,ViewChild,TemplateRef, OnChanges } from '@angular/core';
import { ComponentPortal, Portal } from '@angular/cdk/portal';

import { UserComponent } from './user/user.component';
import { SystemComponent } from './system/system.component';
import { NotificationComponent } from './notification/notification.component';

@Component({
  selector: 'app-header-dropdown-overlay',
  templateUrl: './header-dropdown-overlay.component.html',
  styleUrls: ['./header-dropdown-overlay.component.css']
})
export class HeaderDropdownOverlayComponent implements OnInit, OnChanges {
  @ViewChild('dialog_model',{ static: true }) dialog_model: TemplateRef<any>;
  @Input() componentIndex;
  compList = [UserComponent, SystemComponent, NotificationComponent];
  dynamicComponent: ComponentPortal<any>;
  selectedPortal: Portal<any>;
 
  constructor() { }

  ngOnInit() {
   
 }

 ngOnChanges() {
  if (this.componentIndex) {
    this.dynamicComponent = new ComponentPortal(this.compList[this.componentIndex]);
  }
}
  telInputObject(obj) {
    obj.setCountry('in');
  }
  slideDown(){
    var modal = document.getElementById('header_overlay');
     modal.style.display="none";
 }
//  openAlertModel(){
 
//    this.dialog.open(this.dialog_model);
//  }
//   save(){
//     alert("saved")
//   }
//   openCity(evt, cityName) {
//     let i, tabcontent, tablinks;
//     tabcontent = document.getElementsByClassName("tabcontent");
//     for (i = 0; i < tabcontent.length; i++) {
//       tabcontent[i].style.display = "none";
//     }
//     tablinks = document.getElementsByClassName("tablinks");
//     for (i = 0; i < tablinks.length; i++) {
//       tablinks[i].className = tablinks[i].className.replace(" active", "");
  

//     }
//     document.getElementById(cityName).style.display = "block";
//     evt.currentTarget.className += " active";
//     //alert(evt.currentTarget.className)
//   }
 
}

