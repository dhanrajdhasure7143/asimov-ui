import { Component, OnInit,Input,ViewChild,TemplateRef, HostListener } from '@angular/core';
import { DataTransferService } from '../services/data-transfer.service';
import {MatDialog} from '@angular/material';
import { RestApiService } from '../services/rest-api.service';
import { NotifierService } from 'angular-notifier';

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
  table_details:any[]
  // table_details=[
  //   {
  //     "sub_id":"1",
  //     "prod":"2.O",
  //     "plan":"IAP_tm1",
  //     "amount":"100",
  //     "status":"Failed",
  //     "action":"icon"
  //   },
  //   {
  //     "sub_id":"2",
  //     "prod":"2.O",
  //     "plan":"IAP_tm2",
  //     "amount":"200",
  //     "status":"Success",
  //     "action":"icon"
  //   }];
  
  tenantId: string;
  role: string;
  c=0;
  public notificationList: any;
  public dataid: any;
  notificationscount: any;
  notificationbody: { tenantId: string; };
  public notificationreadlist:any;

  constructor(private dt:DataTransferService ,private rpa:RestApiService,private notifier: NotifierService,private dialog:MatDialog) { }

  ngOnInit() {
    setTimeout(() => {
      this.getAllNotifications();
    }, 900);
   
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
 
  deletnotification(id) {
    this.dataid = id
    }
    canceldeleteNotification(index) {
        this.dataid = '';
      }
       deleteNotification(data,index){
        console.log(data)
        this.rpa.deleteNotification(data).subscribe(resp=>{
          // console.log(resp)
       this.getAllNotifications();
           this.notifier.show({
          type: "success",
           message: "Notification deleted successfully!"
         });
         this.dataid = '';
          },err=>{
          this.getAllNotifications();
            });
          this.getAllNotifications();
      }
       getAllNotifications() {
      let userId =  localStorage.getItem("ProfileuserId")
         this.tenantId=localStorage.getItem('tenantName');
         this.role=localStorage.getItem('userRole')
       let notificationbody ={
          "tenantId":this.tenantId
         }
          this.rpa.getNotifications(this.role,userId,notificationbody).subscribe(data => {
           this.notificationList = data
          })
        }

        notificationclick(id)
        {
          let userId =  localStorage.getItem("ProfileuserId")
          this.tenantId=localStorage.getItem('tenantName');
          this.role=localStorage.getItem('userRole')
         this.notificationbody ={
            "tenantId":this.tenantId
         }
         console.log("notification id",id)
         if(this.notificationList.find(ntf=>ntf.id==id).status!='read'){
          this.rpa.getReadNotificaionCount(this.role,userId,id,this.notificationbody).subscribe(data => {
            this.notificationreadlist = data
            this.notificationList.find(ntf=>ntf.id==id).status='read'
          // document.getElementById('ntf_'+id).style.color="grey"
           //document.getElementById('date_'+id).style.color="grey"
           //document.getElementById(id).style.cursor="none"
            console.log(this.notificationreadlist)
          })
         
        }
        }
  // overview(){

  // }
  // downloadBpmn(){

  // }
  // hasError(value){

  // }
  // getNumber(e){

  // }
    loopTrackBy(index, term) {
    return index;
  }
}

