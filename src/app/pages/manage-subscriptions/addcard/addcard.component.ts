import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import {CryptoService} from '../../../services/crypto.service'
import { RestApiService } from '../../services/rest-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { StripeCardNumberComponent, StripeService } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';

@Component({
  selector: 'app-addcard',
  templateUrl: './addcard.component.html',
  styleUrls: ['./addcard.component.css']
})
export class AddcardComponent implements OnInit {

  public isdefault:boolean=false;
  public cardDetails:any;
  public paymentToken:any;
  public monthlist: number[] = new Array(12);
  public yearList: number[] = new Array(11);
  private spacialSymbolEncryption:string = '->^<-';
  cards:any;
  @Output() onBack = new EventEmitter<any>();
  @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;

  public cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        fontWeight: 400,
        fontFamily: 'Circular',
        fontSize: '14px',
        iconColor: '#666EE8',
        color: '#002333',
        '::placeholder': {
          color: '#919191',
        },
      },
    },
  };

public elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };
  paymentForm: FormGroup = this.fb.group({
    name: ['John', [Validators.required]],
    // email: ['john@gmail.com', [Validators.required]],
    // amount: [100, [Validators.required, Validators.pattern(/d+/)]],
});
 
  constructor(private cryptoService:CryptoService,private api:RestApiService, private spinner:LoaderService,
    private toastService: ToasterService,
    private toastMessages: toastMessages,
    private fb: FormBuilder,
    private stripeService: StripeService
  ) { }

  ngOnInit(): void {
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 6 && (charCode < 2 || charCode > 57)) {
      return false;
    }
    return true;
  }

  Back(){
    this.onBack.emit(false)
  }

  addNewCard() {
    this.spinner.show();
    // this.cardDetails = {
    //   "name": this.cardHoldername,
    //   "exp_month": this.cardmonth,
    //   "number": this.cardnumber1 + this.cardnumber2 + this.cardnumber3 + this.cardnumber4,
    //   "exp_year": this.cardyear,
    //   "cvc": this.cvvNumber,
    // };
  
    let encrypt = this.spacialSymbolEncryption + this.cryptoService.encrypt(JSON.stringify(this.cardDetails));
    let reqObj = {"enc": encrypt};
    this.api.getMyAccountPaymentToken(reqObj).subscribe((res) => {
        this.paymentToken = res;
        if (this.paymentToken.errorMessage === "Failed to generate payment token"){
          this.spinner.hide();
          this.toastService.showError(this.toastMessages.validCardErr);
        }
        if (this.paymentToken.message === "Card already exists") {
          this.spinner.hide();
          this.toastService.showError(this.toastMessages.cardExists);
        } else {
          this.api.addNewCard(this.paymentToken.message, this.isdefault).subscribe((res) => {
              this.spinner.hide();
              if (res === null) {
                this.toastService.showSuccess(this.toastMessages.addCard,'response');
                this.Back();
              }
              if (res.errorMessage === "Failed to create payment method") {
                this.toastService.showError(this.toastMessages.addCardErr);
              }
            },
            (error) => {
              this.toastService.showError(this.toastMessages.addCardErr);
            }
          );
        }
      },
      (error) => {
        this.toastService.showError(this.toastMessages.addCardErr);
      }
    );
  }
  pay(p){
console.log(p)
  }

  createToken(){

  }
  
}
