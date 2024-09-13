import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { Table } from 'primeng/table';
import { LoaderService } from 'src/app/services/loader/loader.service';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';
import { columnList } from 'src/app/shared/model/table_columns';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css'],
  providers:[columnList]
})
export class PaymentHistoryComponent implements OnInit {
  

  public invoicedata: any=[];
  tot: any=[];
  public tableData: any=[];
  invoiceid: any;
  errorMessage:any;
  table_searchFields: any=[];
  columns_list:any[]

  constructor(
    private rest:RestApiService,
    private spinner:LoaderService,
    private columns:columnList,
    private toastService: ToasterService,
    private toastMessages: toastMessages
  ) { }

  ngOnInit(): void {
    this.getAllSubscrptions();
    this.columns_list = this.columns.invoice_column
  }

  getAllSubscrptions() {
   this.spinner.show();
    this.rest.listofinvoices().subscribe(response => { 
      this.invoicedata = response.data;
      this.invoicedata.map(data=>{
        data["createDate"] = new Date(data.createDate);
        data["status_converted"] =data.status.charAt(0).toUpperCase() + data.status.substr(1).toLowerCase(); 
        data["amount_modified"] ="$"+String(data.dueAmmount);
        return data
      })
      this.table_searchFields = [
        "invoiceNumber",
        // "subscriptionId",
        "amount_modified",
        "createDate",
        "status_converted",
        "productName"
      ];
      this.spinner.hide();
     },err=>{
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
    this.toastService.showError(this.toastMessages.downloadErr);
    // Swal.fire({
    //   title: 'Error',
    //   text: "Download failed!",
    //   position: 'center',
    //   icon: 'error',
    //   showCancelButton: false,
    //   customClass: {
    //     confirmButton: 'btn bluebg-button',
    //     cancelButton:  'btn new-cancelbtn',
    //   },

    //   heightAuto: false,
    //   confirmButtonText: 'Ok'
    // })
  }
  )
}
clear(table: Table) {
  table.clear();
}
}
