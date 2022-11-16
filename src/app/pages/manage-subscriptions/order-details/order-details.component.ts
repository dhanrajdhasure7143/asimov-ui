import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
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
  @ViewChild("sort104",{static:false}) sort104: MatSort;
  @ViewChild("paginator104",{static:false}) paginator104: MatPaginator;
  @ViewChild("subscriptiontemplate",{static:false}) subscriptiontemplate: any;
  @ViewChild("subscriptioninfotemplate",{static:false}) subscriptioninfotemplate: any;
  subscribeddata: any;
  modalRef: BsModalRef;
  tableData: any;
  public stopcheckbox: any;
  public pricecheckbox: any;
  public plancheckbox: any;
  public feedbackbox: any;
  constructor(private modalservice:BsModalService,private router:Router,private rest:RestApiService,
    private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.getAllSubscrptions();
  }

  subscriptiondata(data, index) {
    this.subscribeddata = data;
   // console.log(this.subscribeddata)
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
   // console.log("data",data)
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
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
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
        text: "Subscription cancelled successfully !!",
        position: 'center',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#d33',
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
    else if(data.message=='Cancellation Abrupted!!'){
      //Swal.fire("Warning","Subscription cancelled in progress!","success");
      Swal.fire({
        title: 'Warning',
        text: "Subscription cancelled in progress!",
        position: 'center',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#d33',
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
