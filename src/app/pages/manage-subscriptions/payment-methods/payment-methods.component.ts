import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ConfirmationService } from 'primeng/api';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.css']
})
export class PaymentMethodsComponent implements OnInit {
  paymentMode: any;
  error: string;
  showcarddetails:boolean=false;
  constructor(
    private api:RestApiService,
    private spinner:LoaderService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toastService: ToasterService,
    private toastMessages: toastMessages
    ) { }

  ngOnInit(): void {
    this.getAllPaymentmodes();
  }

  addNew(){
    this.showcarddetails=!this.showcarddetails;
   
  }
  onBack(){
    this.showcarddetails=!this.showcarddetails;
    this.getAllPaymentmodes();
  }
  confrmDeleteCard(index) {
    this.confirmationService.confirm({
      message: 'Do you want to remove this card?',
      header: 'Are you sure?',
      accept: () => {
        this.spinner.show();
        this.api.deletePaymentMode(index.id).subscribe((res) => {
            this.spinner.hide();
            this.toastService.showSuccess(this.toastMessages.cardDelete,'response');
            this.getAllPaymentmodes();
          },err=>{
            this.toastService.showError(this.toastMessages.deleteError);
            this.spinner.hide();
          });
      },
      reject: () => {
      },
      acceptLabel: 'Yes',
      rejectLabel: 'No',
    });

    }
    setAsDefaultCard(selectedCardData){
      const cardId=selectedCardData.id
      this.confirmationService.confirm({
        message: 'Do you want to set this card as the default?',
        header: 'Are you sure?',
        accept: () => {
          this.spinner.show();
          this.api.setasDefaultCard(cardId).subscribe((res) => {
              this.spinner.hide();
              this.toastService.showSuccess(this.toastMessages.defualtCard,'response');
              this.getAllPaymentmodes();
            },err=>{
              this.spinner.hide();
              this.toastService.showError(this.toastMessages.plzTryAgain);
            });
        },
        reject: () => {
        },
        acceptLabel: 'Yes',
        rejectLabel: 'No',
      });
    }

  getAllPaymentmodes() {
    this.spinner.show();
    this.api.listofPaymentModes().subscribe(response => {
     
       this.paymentMode = response 
       if(this.paymentMode.message=='Billing account not found'){
         this.error="Billing account not found."
      //   Swal.fire({
      //     title: 'Error',
      //     text: "Billing account not found.",
      //     position: 'center',
      //     icon: 'error',
      //     showCancelButton: false,
      //     confirmButtonColor: '#007bff',
      //     cancelButtonColor: '#d33',
      //     heightAuto: false,
      //     confirmButtonText: 'Ok'
      // })
      }
      else{
        let result = this.paymentMode.filter(obj => {
         return obj.defaultSource === true
        })

      }
      //   localStorage.setItem('cardId',result[0].id)
      //  localStorage.setItem('cardExpMonth',result[0].cardExpMonth)
      //  localStorage.setItem('cardExpYear',result[0].cardExpYear)
      //   localStorage.setItem('cardholdername',result[0].name)
      //  localStorage.setItem('cardLast4',result[0].cardLast4)
      this.spinner.hide();
        });
  }

  
  loopTrackBy(index, term) {
    return index;
  }
}
