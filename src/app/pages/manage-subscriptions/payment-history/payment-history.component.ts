import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Table } from 'primeng/table';
import { LoaderService } from 'src/app/services/loader/loader.service';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {
  

  public invoicedata: any=[];
  tot: any=[];
  public tableData: any=[];
  invoiceid: any;
  errorMessage:any;
  columns_list:any=[]
  table_searchFields: any=[];
  constructor(private rest:RestApiService,private spinner:LoaderService) { }

  ngOnInit(): void {

    this.getAllSubscrptions();
  }

  getAllSubscrptions() {
   this.spinner.show();
    this.rest.listofinvoices().subscribe(response => { 
      this.invoicedata = response.data;
      this.invoicedata.map(data=>{
        data["created_timestamp"] = moment(data.createDate).format("MMMM DD [,] yy") 
        data["status_converted"] =data.status.charAt(0).toUpperCase() + data.status.substr(1).toLowerCase(); 
        return data
      })
      this.columns_list = [
        {ColumnName: "invoiceNumber",DisplayName: "Invoice Number",filterWidget: "normal",filterType: "text",ShowGrid: true,sort: true,ShowFilter:true},
        {ColumnName: "subscriptionId",DisplayName: "Subscription Id",filterWidget: "normal",filterType: "text",ShowGrid: true,sort: true,ShowFilter:true},
        {ColumnName: "amount",DisplayName: "Price",filterWidget: "normal",filterType: "text",ShowGrid: true,sort: true,ShowFilter:true},
        {ColumnName: "created_timestamp",DisplayName: "Issue Date",filterWidget: "normal",filterType: "text",ShowGrid: true,sort: true,ShowFilter:true},
        {ColumnName: "status_converted",DisplayName: "Status",filterWidget: "normal",filterType: "text",ShowGrid: true,sort: true,ShowFilter:true},
        {ColumnName: "action",DisplayName: "Actions",ShowGrid: true,sort: false,ShowFilter:false},
      ];
      this.table_searchFields = [
        "invoiceNumber",
        "subscriptionId",
        "amount",
        "created_timestamp",
        "status_converted"
      ];
      this.spinner.hide();
     });
}
// getinvoiceDate(createDate){
//   return moment(createDate).add(1, 'months').format('MM/DD/YYYY')
//  }

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
clear(table: Table) {
  table.clear();
}
}
