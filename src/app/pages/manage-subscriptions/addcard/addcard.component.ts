import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import {CryptoService} from '../../../services/crypto.service'
import { RestApiService } from '../../services/rest-api.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-addcard',
  templateUrl: './addcard.component.html',
  styleUrls: ['./addcard.component.css']
})
export class AddcardComponent implements OnInit {
  public cardHoldername: any;
  public cardmonth: any;
  public cardnumbertotal: any;
  public cardyear: any;
  public cvvNumber: any;
  cardnumber1: string;
  cardnumber2: string;
  cardnumber3: string;
  cardnumber4: string;
  public isdefault:boolean=false;
  public cardDetails:any;
  public paymentToken:any;
  public monthlist: number[] = new Array(12);
  public yearList: number[] = new Array(11);
  private spacialSymbolEncryption:string = '->^<-';
  cards:any;
  @Output() onBack = new EventEmitter<any>();
 
  constructor(private cryptoService:CryptoService,private api:RestApiService, private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 6 && (charCode < 2 || charCode > 57)) {
      return false;
    }
    return true;
  }
  resetForm(form:NgForm) {
    form.resetForm();
    this.cardmonth=undefined;
    this.cardyear=undefined;
  }
  Back(){
    this.onBack.emit(false)
  }

  addNewCard(){
    this.spinner.show()
    this.cardDetails = {
      "name": this.cardHoldername,
      "exp_month": this.cardmonth,
      "number": this.cardnumber1 + this.cardnumber2 + this.cardnumber3 + this.cardnumber4,
      "exp_year": this.cardyear,
      "cvc": this.cvvNumber,
    }
    let encrypt = this.spacialSymbolEncryption + this.cryptoService.encrypt(JSON.stringify(this.cardDetails));
    let reqObj = {"enc": encrypt};
    this.api.getMyAccountPaymentToken(reqObj).subscribe(res=>{
     
      this.paymentToken=res
      if(this.paymentToken.errorMessage==="Failed to generate payment token"){
        this.spinner.hide()
        Swal.fire({
          title: 'Error',
          text:"Please enter valid card details",
          position: 'center',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#007bff',
          cancelButtonColor: '#d33',
          heightAuto: false,
          confirmButtonText: 'Ok'
        })
      }
      if(this.paymentToken.message==="Card already exists"){
        this.spinner.hide()
        Swal.fire({
          title: 'Error',
          text:"Card already exists",
          position: 'center',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#007bff',
          cancelButtonColor: '#d33',
          heightAuto: false,
          confirmButtonText: 'Ok'
        })
      } 
      else {
        
    
    this.api.addNewCard(this.paymentToken.message,this.isdefault).subscribe(res=>{
        this.spinner.hide()
       // this.getAllPaymentmodes();
        if(res===null){
          Swal.fire({
            
            title: 'Success',
            text: "Card added successfully!!",
            position: 'center',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#007bff',
            cancelButtonColor: '#d33',
            heightAuto: false,
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.value) {
                 this.Back()
            }
          });

        }
        if(res.errorMessage==="Failed to create payment method"){
          this.spinner.hide()
          Swal.fire({
            title: 'Error',
            text:"Failed to add card",
            position: 'center',
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#007bff',
            cancelButtonColor: '#d33',
            heightAuto: false,
            confirmButtonText: 'Ok'
          })
        }

    })
  }
    }),err=>{
      Swal.fire({
        title: 'Error',
        text:"Failed to add card",
        position: 'center',
        icon: 'error',
        showCancelButton: false,
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#d33',
        heightAuto: false,
        confirmButtonText: 'Ok'
      })
    }
  }
  
}
