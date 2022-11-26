import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {
  
  displayedColumns8: string[] = ["invoiceNumber","subscriptionId","amount","createDate","nextdue","status","action"];
  dataSource8:MatTableDataSource<any>;
  @ViewChild("sort104",{static:false}) sort104: MatSort;
  @ViewChild("paginator104",{static:false}) paginator104: MatPaginator;
  public invoicedata: any=[];
  tot: any=[];
  public tableData: any=[];
  invoiceid: any;
  errorMessage:any;
  
  constructor(private rest:RestApiService,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {

    this.getAllSubscrptions();
  }

  getAllSubscrptions() {
   this.spinner.show();
    this.rest.listofinvoices().subscribe(response => { this.invoicedata = response.data 
      this.dataSource8= new MatTableDataSource(this.invoicedata);
      this.dataSource8.sort=this.sort104;
      this.dataSource8.paginator=this.paginator104;
      this.spinner.hide();
     });
}
getinvoiceDate(createDate){
  return moment(createDate).add(1, 'months').format('MM/DD/YYYY')
 }

 invoicedownload(invoicedata) {
  this.spinner.show();
  this.invoiceid = invoicedata.invoiceId;
  this.rest.invoicedownload(this.invoiceid).subscribe(data => {
    const urlCreator = window.URL;
    const blob = new Blob([data], {
      type: 'application/pdf',
    });
    const url = urlCreator.createObjectURL(blob);
    const a: any = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = invoicedata.invoiceNumber + '.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
    // this.notifier.show({
    //   type: "success",
    //   message: "Downloading....",
    //   id: "123"
    // });
    this.spinner.hide();
  }, err => {
    Swal.fire({
      title: 'Error',
      text: "Download failed!",
      position: 'center',
      icon: 'error',
      showCancelButton: false,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#d33',
      heightAuto: false,
      confirmButtonText: 'Ok'
    })
  }
  )
}
}
