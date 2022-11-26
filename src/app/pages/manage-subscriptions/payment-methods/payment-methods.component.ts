import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.css']
})
export class PaymentMethodsComponent implements OnInit {
  paymentMode: any;
  error: string;
  showcarddetails:boolean=false;
  constructor(private api:RestApiService,private spinner:NgxSpinnerService,private router: Router) { }

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
    Swal.fire({
      // title: 'Confirmation',
      // // text: `Updated failed, Please try again.`,
      // html: '<h4> Do you want to set this card as default?</h4> ',
    
      // showCancelButton: true,
      // allowOutsideClick: true,
      title: 'Confirmation',
      text: "Do you want to Remove this card?",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      heightAuto: false,
      confirmButtonText: 'Yes!'
    }).then((result)=>{
      if(result.value){
        this.spinner.show()
        this.api.deletePaymentMode(index.id).subscribe(data => {
          this.getAllPaymentmodes();
         })
      }
    })
      
     
  
  
    }
    setAsDefaultCard(selectedCardData){
      const cardId=selectedCardData.id
      Swal.fire({
        // title: 'Confirmation',
        // // text: `Updated failed, Please try again.`,
        // html: '<h4> Do you want to set this card as default?</h4> ',
      
        // showCancelButton: true,
        // allowOutsideClick: true,
        title: 'Confirmation',
        text: "Do you want to set this card as default?",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        heightAuto: false,
        confirmButtonText: 'Yes!'
      }).then((result) => {
        if (result.value) {
          this.spinner.show();
          this.api.setasDefaultCard(cardId).subscribe(res=>{
            this.spinner.hide();
            Swal.fire({
              title: 'Success',
              text: "Default card is set successfully!!",
              position: 'center',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#007bff',
              cancelButtonColor: '#d33',
              heightAuto: false,
              confirmButtonText: 'Ok'
            })
           
            this.getAllPaymentmodes(); 
          },err=>{
            this.spinner.hide();
            Swal.fire({
              title: 'Error!',
              text: 'Please try again.',
             // type: 'error',
              showCancelButton: false,
              allowOutsideClick: true
            })
          })
          // this.getAllPaymentmodes();
        }
      })
      
    }
  getAllPaymentmodes() {
    this.spinner.show();
    this.api.listofPaymentModes().subscribe(response => {
     
       this.paymentMode = response 
       if(this.paymentMode.message=='Billing account not found'){
         this.error="Billing Account Not Found"
      //   Swal.fire({
      //     title: 'Error',
      //     text: "Billing Account Not Found",
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
