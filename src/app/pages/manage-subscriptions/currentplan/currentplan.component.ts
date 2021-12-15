import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { CryptoService } from 'src/app/services/crypto.service';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';

@Component({
  selector: 'app-currentplan',
  templateUrl: './currentplan.component.html',
  styleUrls: ['./currentplan.component.css']
})
export class CurrentplanComponent implements OnInit {

  tab: string;
  selected_plans: any={};
  selected_plansOne: any[];
  plan: any;
  plantype: any;
  public plansList: any;
  public list: any[];
  public productId: any;
  public error = '';
  public test: any;
  tenantId: string;
  newAccessToken: any[];
  userRole: any;
  freetrailAvailed: any;
  remainingDays: any;
  isfreetrail: boolean;
  features: any
  currentplanname: string;
  getallplans: boolean=false;
  public allplans: any=[];
  paymentMode: any;
  paymentToken: any;
  subscriptionDetails: any;
  finalAmount: any;
  validateCoupondata: any;
  totalPay: any;
  taxPercentage: any;
  promo: any;
  revieworder:boolean=false;
  modalRef: BsModalRef;
  private spacialSymbolEncryption: string = '->^<-';
  cardDetails: any;
  name: any;
  freetrail: any;
  listofplans: any[];
 
  constructor(
    private api: RestApiService, private spinner: NgxSpinnerService,private modalService: BsModalService,
    private cryptoService: CryptoService,private router:Router
  ) { }

  ngOnInit(): void {
    this.currentplanname=localStorage.getItem('currentplan')
    this.getCurrentPlan()
    //this.getAllPlans();
  }


  getCurrentPlan() {
    this.spinner.show();
    this.tenantId = localStorage.getItem('tenantName');
    this.api.getProductPlans("EZFlow", this.tenantId).subscribe(data => {
      this.plansList = data
      // this.plansList=null;
      this.spinner.hide();
      if (this.plansList == undefined || this.plansList == null) {
        this.error = 'Sorry for inconvenience we will get back to you shortly'
      }
      if(this.plansList.length > 1){
        this.plansList=this.plansList.reverse();
      }
          for(var i=0; i<this.plansList.length; i++){
          var features=[];
          for (let [key, value] of Object.entries(this.plansList[i].features)) {
            var obj={'name':key,'active':value}
            features.push(obj)  
          }
          this.plansList[i].features=features;
        }
        for(var a=0; a<this.plansList[0].features.length-2; a++){
            this.plansList[0].features[a].limited=true
        }
        for(var a=0; a<this.plansList[1].features.length-2; a++){
          this.plansList[1].features[a].limited=true
        }
          this.plansList[2].features[2].limited=true;
          this.plansList[2].features[3].limited=true;
      this.plansList[0].amount = 0;
      this.plansList[0].term='month';
      this.plansList[1].term='month';
      this.plansList[2].term='year';
      },error=>{
        this.error='Sorry for inconvenience we will get back to you shortly'
      });

  }

  getAllPlans(){
  this.plansList.forEach(element => {
    if(element.nickName!=='Free Tier'){
      this.allplans.push(element)
    }
   this.plansList=this.allplans
  });
    this.getallplans=true;
  }

  selectedPlan(plans){
    console.log(plans)
    this.plantype=plans.nickName
    this.spinner.show();
    this.freetrail=localStorage.getItem('freetrail')
    // if(this.plantype='Standard'){
    //   this.plantype='Standard'
    // }
    // else{
    //   this.plantype='Professional'
    // }
    this.api.listofPaymentModes().subscribe(response => {
     
       this.paymentMode = response 
        let result = this.paymentMode.filter(obj => {
         return obj.defaultSource === true
        
        })
        this.cardDetails=result

        this.tenantId=localStorage.getItem("tenantName");
        this.api.getProductPlans("EZFlow",this.tenantId).subscribe(data=> {this.listofplans =data
        this.listofplans.forEach(obj => {
          if(obj.nickName == this.plantype){
            this.selected_plans=obj
            if(this.selected_plans.term =="12month"){
              this.selected_plans.term= 'Annual'
            }else{
              this.selected_plans.term= 'One Month'
            }
            this.name=this.selected_plans.nickName;
          }
          
        }
        );
        
      });
  
    this.revieworder=true;
    this.spinner.hide();
      })
     
  }
  buyProductPlan(template){
    const cardValue = {
      "name":  this.cardDetails[0].name,
      "number": "3782 8224 6310 005",
      "exp_month":  this.cardDetails[0].cardExpMonth,
      "exp_year":  this.cardDetails[0].cardExpYear,
      "cvc": "123"
    }
   
    const plandetails = {
      "ip": "1.2.3.4",
      "promo": this.promo,
      "items": [
        {
          "meta": {
            "orderable": true,
            "visible": true,
            "plan_id": this.selected_plans.id
          },
          "planId": this.selected_plans.id,
          "quantity":"100"
        }
      ],
      "meta": {
        "orderable": true,
        "visible": true,
        "product_id": "EZFlow"
      }
    }

    let encrypt = this.spacialSymbolEncryption + this.cryptoService.encrypt(JSON.stringify(cardValue))
    let reqObj = { "enc": encrypt };
    this.api.getSubscriptionPaymentToken(reqObj).subscribe(res => {
      this.spinner.show();
      this.paymentToken = res
      if (this.paymentToken.message == 'Failed To Generate Payment Token') {
        Swal.fire({
          title: 'Error',
          text: `Invalid Card Details!!`,
          position: 'center',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#007bff',
          cancelButtonColor: '#d33',
          heightAuto: false,
          confirmButtonText: 'Ok'
      })
        this.spinner.hide();
      }
      else {

        this.api.subscribePlan(this.paymentToken.message, plandetails).subscribe(data => {
          this.subscriptionDetails = data
          this.spinner.hide();
          this.finalAmount = this.subscriptionDetails.amountPaid;
          this.productId = "EZFlow";
          this.modalRef = this.modalService.show(template);
        })
      }
   
    })
  }
  
  close_modal(){
    this.modalRef.hide();
    this.router.navigate(['/pages/home']).then(() => {
      window.location.reload();
    });
  }
  currentplan(){
    this.allplans=[]
    this.getallplans=false;
  }
  chooseplan(){
    this.getallplans=true;
    this.revieworder=false;
  }

  contactUs(){
    window.location.href = "https://www.epsoftinc.com/"
  }
}
