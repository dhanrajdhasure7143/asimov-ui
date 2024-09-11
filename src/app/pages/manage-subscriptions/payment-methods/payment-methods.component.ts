import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ConfirmationService } from 'primeng/api';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { StripeCardNumberComponent, StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
  PaymentIntent,
} from '@stripe/stripe-js'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.css']
})
export class PaymentMethodsComponent implements OnInit {
  paymentMode: any;
  error: string;
  showcarddetails:boolean=false;
  stripeCardValid: boolean = false;
  isLoading: boolean = false;
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    },
  };

public elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };
  paymentForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    isdefault: [false, ],
    // email: ['john@gmail.com', [Validators.required]],
    // amount: [100, [Validators.required, Validators.pattern(/d+/)]],
});

  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  constructor(
    private rest_api:RestApiService,
    private spinner:LoaderService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toastService: ToasterService,
    private toastMessages: toastMessages,
    private fb: FormBuilder,
    private stripeService: StripeService
    ) { }

  ngOnInit(): void {
    this.getAllPaymentmodes();
  }

  addNewCard(){
    let request_body = {
      "successUrl":environment.cardCancelURL,
      "cancelUrl":environment.cardCancelURL
    }
    this.spinner.show(); 
    this.rest_api.addNewCardURLGenerate(request_body).pipe(
      switchMap((session: any) => {
        this.spinner.hide();
        return this.stripeService.redirectToCheckout({ sessionId: session.id });
      })
    )
    .subscribe((res) => {
      console.log( res)
      this.spinner.hide();
    },err=>{
      this.spinner.hide();
      this.toastService.showError(this.toastMessages.plzTryAgain);
    })
    // this.showcarddetails=!this.showcarddetails;
   
  }
  onBack(){
    this.showcarddetails=!this.showcarddetails;
    this.getAllPaymentmodes();
  }
  confrmDeleteCard(index) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this card?',
      header: 'Remove Card',
      acceptLabel:'Yes',
      rejectLabel:'No',
      rejectButtonStyleClass: ' btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      accept: () => {
        this.spinner.show();
        this.rest_api.deletePaymentMode(index.id).subscribe((res) => {
            this.spinner.hide();
            // this.toastService.showSuccess(this.toastMessages.cardDelete,'response');
            this.toastService.toastSuccess("Card has been successfully deleted.");
            this.getAllPaymentmodes();
          },err=>{
            this.toastService.showError(this.toastMessages.deleteError);
            this.spinner.hide();
          });
      },
      reject: () => {
      }
    });

    }
    setAsDefaultCard(selectedCardData){
      const cardId=selectedCardData.id
      this.confirmationService.confirm({
        message: 'Are you sure you want to set this card as the default?',
        header: 'Default Card',
        acceptLabel:'Yes',
        rejectLabel:'No',
        rejectButtonStyleClass: ' btn reset-btn',
        acceptButtonStyleClass: 'btn bluebg-button',
        defaultFocus: 'none',
        rejectIcon: 'null',
        acceptIcon: 'null',
        accept: () => {
          this.spinner.show();
          this.rest_api.setasDefaultCard(cardId).subscribe((res) => {
              this.spinner.hide();
              // this.toastService.showSuccess(this.toastMessages.defualtCard,'response');
              this.toastService.toastSuccess("The default card has been set successfully.");
              this.getAllPaymentmodes();
            },err=>{
              this.spinner.hide();
              this.toastService.showError(this.toastMessages.plzTryAgain);
            });
        },
        reject: () => {
        },
      });
    }

  getAllPaymentmodes() {
    this.spinner.show();
    // this.api.listofPaymentModes().subscribe(response => {
    this.isLoading = true;
    this.rest_api.getPaymentCards().subscribe((response:any) => {
        if(response.data.length > 0){
          this.paymentMode = response.data 
            // let result = this.paymentMode.filter(obj => {
            // return obj.defaultSource === true
            // })
            this.paymentMode.sort((a, b) => {
              if (a.defaultSource) return -1;
              if (b.defaultSource) return 1;
              return 0;
            });
      }
      this.isLoading = false;
      this.spinner.hide();
    },err=>{  
      this.isLoading = false;
      this.spinner.hide();
    });
  }

  
  loopTrackBy(index, term) {
    return index;
  }

  onChange({ type, event }) {
    if (type === 'change') {
      this.stripeCardValid = event.complete;
    }
  }

  createToken() {
    if(this.paymentForm.value.name === ''){
      this.toastService.showError("Please enter the card holder name");
      return;
    }
    this.spinner.show();
    this.stripeService.createToken(this.card.getCard(), { name: this.paymentForm.value.name })
      .subscribe(result => {
        console.log(result.token);
        if (result.token) {
          this.rest_api.addNewCard(result.token.id, this.paymentForm.value.isdefault).subscribe((res) => {
            this.getAllPaymentmodes();
            this.showcarddetails=false;
            this.paymentForm.reset();
            if (res === null) {
              this.toastService.showSuccess(this.toastMessages.addCard,'response');
            }
            if (res.errorMessage === "Failed to create payment method") {
              this.toastService.showError(this.toastMessages.addCardErr);
            }
          },
          (error) => {
            this.spinner.hide();
            this.toastService.showError(this.toastMessages.addCardErr);
          }
        );
        } else if (result.error) {
          console.log(result.error.message);
        }
      });
  }

  cancel(){
    this.showcarddetails= false;
    this.paymentForm.reset();
  }

  get validForm() {
    return this.paymentForm.valid && this.stripeCardValid;
  }
}
