import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestApiService } from '../../services/rest-api.service';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.css']
})
export class PaymentMethodsComponent implements OnInit {
  paymentMode: any;

  constructor(private api:RestApiService,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.getAllPaymentmodes();
  }


  getAllPaymentmodes() {
    this.spinner.show();
    this.api.listofPaymentModes().subscribe(response => {
     
       this.paymentMode = response 
        let result = this.paymentMode.filter(obj => {
         return obj.defaultSource === true
        })
      //   localStorage.setItem('cardId',result[0].id)
      //  localStorage.setItem('cardExpMonth',result[0].cardExpMonth)
      //  localStorage.setItem('cardExpYear',result[0].cardExpYear)
      //   localStorage.setItem('cardholdername',result[0].name)
      //  localStorage.setItem('cardLast4',result[0].cardLast4)
      this.spinner.hide();
        });
  }
}
