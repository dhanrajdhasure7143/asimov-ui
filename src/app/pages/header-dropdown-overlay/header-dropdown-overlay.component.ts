import { Component, OnInit,Input,ViewChild,TemplateRef, HostListener } from '@angular/core';
import { DataTransferService } from '../services/data-transfer.service';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-header-dropdown-overlay',
  templateUrl: './header-dropdown-overlay.component.html',
  styleUrls: ['./header-dropdown-overlay.component.css']
})
export class HeaderDropdownOverlayComponent implements OnInit {
  @Input() overlay_acc_dt: string;
  @Input() overlay_user_manage_dt: string;
  @Input() overlay_config_alert_dt: string;
  @Input() overlay_invite_user_dt: string;
  @Input() overlay_notifications_dt:string;
  @ViewChild('dialog_model',{ static: true }) dialog_model: TemplateRef<any>;

  table_details=[
    {
      "sub_id":"1",
      "prod":"2.O",
      "plan":"IAP_tm1",
      "amount":"100",
      "status":"Failed",
      "action":"icon"
    },
    {
      "sub_id":"2",
      "prod":"2.O",
      "plan":"IAP_tm2",
      "amount":"200",
      "status":"Success",
      "action":"icon"
    }];

  constructor(private dt:DataTransferService ,private dialog:MatDialog) { }

  ngOnInit() {


  }
  telInputObject(obj) {
    obj.setCountry('in');
  }
close(){
}
  slideDown(){
    var modal = document.getElementById('header_overlay');
     modal.style.display="none";
 }
 openAlertModel(){
   this.dialog.open(this.dialog_model);
 }
  save(){
    alert("saved")
  }
  @HostListener('document:click', ['$event'])
  clickedOutside(event){
    if(event.target.classList.contains('hd_overlay')){
      this.slideDown();
    }
  }
  openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");


    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    //alert(evt.currentTarget.className)
  }

}

