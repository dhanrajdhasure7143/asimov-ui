import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoaderService } from 'src/app/services/loader/loader.service';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  displayedColumns8: string[] = ["subscriptionId","name","planEntity.nickName","planEntity.amount","status","action"];
  dataSource8:MatTableDataSource<any>;
  @ViewChild("sort104") sort104: MatSort;
  @ViewChild("paginator104") paginator104: MatPaginator;
  @ViewChild("subscriptiontemplate") subscriptiontemplate: any;
  @ViewChild("subscriptioninfotemplate") subscriptioninfotemplate: any;
  subscribeddata: any;
  modalRef: BsModalRef;
  tableData: any[] =[];
  public stopcheckbox: any;
  public pricecheckbox: any;
  public plancheckbox: any;
  public feedbackbox: any;
  constructor(private modalservice:BsModalService,private router:Router,private rest:RestApiService,
    private spinner:LoaderService) { }

  ngOnInit(): void {
    this.getAllSubscrptions();
  }

  subscriptiondata(data, index) {
    this.subscribeddata = data;
    this.modalRef = this.modalservice.show(this.subscriptiontemplate, { class: 'gray modal-lg' });
    if(this.subscribeddata.subscriptionId==null||this.subscribeddata.subscriptionId==undefined){
      this.subscribeddata.subscriptionId="--"
    }
    
  }

  getAllSubscrptions(){
    this.spinner.show();
  this.rest.listofsubscriptions().subscribe(response => { 
    this.tableData = response 
    this.dataSource8= new MatTableDataSource(this.tableData);
    this.dataSource8.sort=this.sort104;
    this.dataSource8.paginator=this.paginator104;
    this.spinner.hide();
});
}
  infoModelSubmit(data) {
    localStorage.setItem("selectedproductId",data.name)
    this.modalRef.hide();
  //  this.router.navigate(['/activation/payment/chooseplan']);
  }

  changePlanCancel()
  {
    this.modalRef.hide();
    this.getAllSubscrptions();
  }

  selecteddata(data) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn bluebg-button',
        cancelButton:  'btn new-cancelbtn',
      },
      confirmButtonText: 'Yes, unsubscribe it!'
    }).then((result) => {
      if (result.value) {
        this.modalRef = this.modalservice.show(this.subscriptioninfotemplate, { class: 'gray modal-lg' });
      }
    });
    this.subscribeddata = data;
   
//    this.selectedIndex = index;
  }

  subscriptionCancelModalSubmit()
  {
    this.spinner.show();
    this.rest.cancelSubscription(this.subscribeddata).subscribe(data => {
    
      this.getAllSubscrptions();
      this.modalRef.hide();
      //this.router.navigate(['/activation/payment/chooseplan']);
         if(data==null){
           this.spinner.hide();
      Swal.fire({
        title: 'Success',
        text: "Subscription cancelled successfully!",
        position: 'center',
        icon: 'success',
        showCancelButton: false,
        customClass: {
          confirmButton: 'btn bluebg-button',
          cancelButton:  'btn new-cancelbtn',
        },

        heightAuto: false,
        confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.value) {
        this.router.navigate(['/pages/home']).then(() => {
          window.location.reload();
        });
      }
    });
    }
    else if(data=='Cancellation Abrupted!!'){
      //Swal.fire("Warning","Subscription cancellation is in progress!","success");
      Swal.fire({
        title: 'Warning',
        text: "Subscription cancellation is in progress!",
        position: 'center',
        icon: 'warning',
        showCancelButton: false,
        customClass: {
          confirmButton: 'btn bluebg-button',
          cancelButton:  'btn new-cancelbtn',
        },

        heightAuto: false,
        confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.value) {
        this.router.navigate(['/pages/home']).then(() => {
          window.location.reload();
        });
      }
    });
    }
    }, err => {
    });
   // this.unsubscribeYes(this.selectedIndex,template);
  }
  CancelSubform()
  {
    this.modalRef.hide();
    this.getAllSubscrptions();
    
  }
  
}
