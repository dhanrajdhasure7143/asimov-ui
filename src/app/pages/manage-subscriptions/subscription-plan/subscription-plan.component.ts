import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { RestApiService } from '../../services/rest-api.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { switchMap } from 'rxjs/operators';
import { StripeService } from 'ngx-stripe';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ToasterService } from 'src/app/shared/service/toaster.service';

@Component({
  selector: 'app-subscription-plan',
  templateUrl: './subscription-plan.component.html',
  styleUrls: ['./subscription-plan.component.css']
})
export class SubscriptionPlanComponent implements OnInit {
  @Input() isbillingInfoDisble: boolean = false;
  subscriptionForm: FormGroup;
  botPlans : any[] = [];
  countries : any[] = [];
  selectedPlanIndex: number = -1;
  showArrowRight : boolean = true;
  showArrowDown : boolean = false;
  countryInfo: any[] = [];
  userEmail : any;
  predefinedPlans:any[]=[];
  selectedPlans:any=[];
  selectedAmount:number=0;
  planType="Yearly";
  selectedValue:any;
  plans : any[] = ["RPA", "Process Intelligence","Orchestration","Business Process Studio","Projects" ]
  isDisabled : boolean = true;
  password : any;
  isReview_order:boolean = false;
  selected_plans_list:any;
  log_data:any={}
  isRegistered : boolean = false;
  totalAmount : number = 0;
  selectedPlan: string = 'Yearly';
  showDescriptionFlag: boolean = false;
  booleanString: boolean = false;
  booleanValue: boolean = true;
  visibleBotInfo:boolean = false;
  selectedBot: any={};
  selectedInterval: boolean = true;
  predefinedRawBots: any[] = [];
  payment_methods_overlay: boolean = false;
  selectedCard: any;
  paymentCards:any []=[];
  cvv:any;

  constructor( private spinner : LoaderService,
    private router: Router,
    private rest: RestApiService,
    private formBuilder: FormBuilder,
    private stripeService: StripeService,
    private toastService: ToasterService,
    ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.subscriptionForm = this.formBuilder.group({
      cardNumber: [''],
      monthYear: [''],
      cvv: [''],
      lastName: [''],
      userName: [''],
      country: [''],
      autoBilling: ['']
    });

    this.getPredefinedRawBots();
    this.loadPredefinedBots();
  }

  getPredefinedRawBots(){
    this.rest.getPredifinedRawBots().subscribe((response: any) =>{
      if(response && response.data){
        this.predefinedRawBots = response.data;
      }
    },err=>{
      console.log(err,"error for the raw bots");
    });
  }

  // loadPredefinedBots(){
  //   this.rest.loadPredefinedBots().subscribe((response : any) =>{
  //     this.spinner.hide()
  //     console.log(response)
  //     if(response){
  //       response.forEach(element => {
  //         let obj=element.product
  //         obj["priceCollection"] = element.priceCollection
  //         let data = element.product.metadata?.product_features?element.product.metadata.product_features:[];
  //         if(data.length>0)
  //         obj["features"] =JSON.parse(data);
  //         this.botPlans.push(obj)
  //       });
  //       console.log(this.botPlans)
  //     // this.botPlans = response;
  //     // this.botPlans.forEach(item=>{
  //     //   item["isSelected"] = false;
  //     //   item["selectedTerm"] = "Monthly"
  //     // })
  //     }
  //   },err=>{
  //     this.spinner.hide();
  //     Swal.fire({
  //       title: 'Error!',
  //       text: 'Failed to load',
  //       icon: 'error',
  //       showCancelButton: false,
  //       allowOutsideClick: true
  //   }).then((result) => {
  //     if (result.value) {
  //       this.router.navigate(['/signup']);
  //     }
  //   });
  //   })
  // }

  loadPredefinedBots() {
    this.rest.loadPredefinedBots().subscribe((response: any) => {
        this.spinner.hide();
        console.log(response);
        this.getPaymentMethods();
        if (response) {
            response.forEach(element => {
                let obj = element.product;
                let isSubscribed=false;
                let isYearlySubscribed=false;
                let isMonthlySubscribed=false;
                obj["priceCollection"] = element.priceCollection;
                let data = element.product.metadata?.product_features ? element.product.metadata.product_features : [];
                if (data.length > 0)
                    obj["features"] =data?JSON.parse(data):[];

                obj.priceCollection.forEach(price => {
                    try {
                      if (Array.isArray(this.predefinedRawBots)) {
                        price.isPlanSubscribed = this.predefinedRawBots.some(bot => {
                            return bot.products.some(product => {
                                if (Array.isArray(product.price_id)) {
                                    return product.price_id.some(priceId => {
                                      if (priceId === price.id && bot.term === price.tiersMode) {
                                        isSubscribed = true;
                                        if (price.tiersMode === 'year') {
                                          isYearlySubscribed = true;
                                        } 
                                        
                                        if (price.tiersMode === 'month'){
                                          isMonthlySubscribed = true; 
                                        }
                                      }
                                        return priceId === price.id && bot.term === price.tiersMode;  
                                    });
                                } else {
                                  if (product.price_id === price.id && bot.term === price.tiersMode) {
                                    isSubscribed = true;
                                    if (price.tiersMode === 'year') {
                                      isYearlySubscribed = true;
                                    } 
                                    
                                    if (price.tiersMode === 'month'){
                                      isMonthlySubscribed = true; 
                                    }
                                  }
                                  return product.price_id === price.id && bot.term === price.tiersMode;
                                }
                            });
                        });
                    } 
                    else {
                          price.isPlanSubscribed = false;
                      }
                    } catch (error) {
                        price.isPlanSubscribed = false;
                    }
                });

                obj["isYearlySubscribed"] = isYearlySubscribed;
                obj["isMonthlySubscribed"] = isMonthlySubscribed;
                obj["doPlanDisabled"] = isSubscribed;
                this.botPlans.push(obj);
            });
            console.log(this.botPlans);
        }
    }, err => {
        this.spinner.hide();
        Swal.fire({
            title: 'Error!',
            text: 'Failed to load',
            icon: 'error',
            showCancelButton: false,
            allowOutsideClick: true
        }).then((result) => {
            if (result.value) {
                this.router.navigate(['/signup']);
            }
        });
    });
}
  
  ngAfterViewInit(){
    this.userEmail = localStorage.getItem('ProfileuserId');
  }

showDescription(index: number) {
  this.selectedPlanIndex = index;
  this.showArrowRight = false;
  this.showArrowDown = true;
}

hideDescription() {
  this.selectedPlanIndex = -1;
  this.showArrowRight = true;
  this.showArrowDown = false;
}

paymentPlan() {
  this.spinner.show();
  this.payment_methods_overlay = false;
  let selectedInterval = (this.selectedPlan === 'Monthly') ? 'month' : 'year';
  let filteredPriceIds = [];
  this.selectedPlans.forEach((element) => {
    element.priceCollection.forEach((price) => {
      if (price.recurring.interval === selectedInterval) {
        filteredPriceIds.push(price.id);
      }
    });
  });

  if (filteredPriceIds.length === 0) {
    // Handle the case when no price is selected for the chosen interval
    console.error('No price selected for the chosen interval.');
    this.spinner.hide();
    return;
  }

  let req_body = {
    "price": filteredPriceIds,
    "customerEmail": this.userEmail,
    "successUrl": environment.paymentSuccessURL,
    // "cancelUrl": environment.paymentFailuerURL,
    "paymentMethodId": this.selectedCard,
  };
  if(this.isbillingInfoDisble){
    req_body["cancelUrl"]= environment.paymentFailuerURL+"?index=4"
  }else{
    req_body["cancelUrl"]= environment.paymentFailuerURL+"?index=2"
  }
  console.log("PLAN_ID's", this.selectedCard);
  console.log("REQ_BODY", req_body);
  
  this.rest.getCheckoutScreen(req_body).pipe(
      switchMap((session: any) => {
        this.spinner.hide();
        return this.stripeService.redirectToCheckout({ sessionId: session.id });
      })
    ).subscribe(
      res => {
        this.spinner.hide();
      },error => {
        this.spinner.hide();
        this.toastService.showError("Failed to redirect to payment gateway");
        console.error('Error during payment:', error);
      }
    );
}


sendEmailEnterPrisePlan(){
  this.spinner.show();
  this.rest.sendEmailEntrepricePlan(this.userEmail).subscribe((res : any)=>{
    if(res.errorMessage !="User not present"){
    Swal.fire({
        title: 'Success!',
        text: `Thank you for choosing Enterprise plan, Our team will contact you soon!`,
        icon: 'success',
        showCancelButton: false,
        allowOutsideClick: false
    })
    // .then((result) => {
    //   if (result.value) {
    //     this.router.navigate(['/login'],{
    //       queryParams: { email : this.userEmail },
    //     });
    //   }
    // });
  }
      this.spinner.hide();
  },err=>{
    Swal.fire("Error","Failed to send","error")
    this.spinner.hide();
  })
}

onSelectPredefinedBot(plan, index) {
  this.showDescriptionFlag = true;
  this.selectedPlans = [];
  this.botPlans[index].isSelected = !this.botPlans[index].isSelected;
  this.isDisabled = this.botPlans.every(item => !item.isSelected);
  this.botPlans.forEach(item => {
    if (item.isSelected) {
      this.selectedPlans.push(item);
    }
  });
  this.selectedPlan = this.selectedPlans.length > 0 ? this.selectedPlan || "Monthly" : "Yearly";
  this.isDisabled = this.selectedPlans.length === 0;
  this.planSelection(this.selectedPlan);
}

readValue(value){
  this.isReview_order = false;
}

// planSelection(event){
//   this.selectedPlan = event
//   let plansData = []
//   this.selectedPlans.forEach((item : any) => {
//     plansData.push(item.planDetails)
//   })
//   console.log(plansData,"plansData")
//   this.totalAmount = 0;
//   for (const planGroup of plansData) {
//     for (const plan of planGroup) {
//       if (plan.interval === this.selectedPlan) {
//         this.totalAmount += plan.amount;
//         console.log(this.totalAmount)
//       }
//     }
//   }
// }

  planSelection(interval: string) {
    this.selectedPlan = interval;
    let plansData = [];
    let selectedInterval = (interval === 'Monthly') ? 'month' : 'year';
    this.selectedPlans.forEach((item) => {
      item.priceCollection.forEach((price) => {
        if (price.recurring.interval === selectedInterval) {
          plansData.push(price.unitAmount);
        }
      });
    });
    console.log(plansData, "plansData");
    this.totalAmount = 0;
    plansData.forEach((amount) => {
      this.totalAmount += amount;
    });
    console.log(this.totalAmount);
  }

  showDialog() {
    this.visibleBotInfo = true;
  }

  openDetailsDialog(plan: any) {
    this.selectedBot = plan;
    this.visibleBotInfo = true;
  }

  closeDialog() {
      this.visibleBotInfo = false;
  }
   
  toggleChanged() {
    if (this.selectedInterval) {
      this.planSelection('Yearly');
    } else {
      this.planSelection('Monthly');
    }
  }

getPaymentMethods(){
  this.spinner.show();
  this.rest.getPaymentCards().subscribe((res : any)=>{
  
    if (res.code == 5075) {
      this.paymentCards = res.data
      console.log(this.paymentCards,"payment cards")
      this.spinner.hide();
      if(this.paymentCards.length>0){
        // this.payment_methods_overlay = true;
        this.paymentCards.sort((a, b) => {
          if (a.defaultSource) return -1;
          if (b.defaultSource) return 1;
          return 0;
        });
        this.selectedCard = this.paymentCards.find(card => card.defaultSource).id;
      }
    }
  this.spinner.hide();
  },err=>{
    this.spinner.hide();
    this.toastService.showError("Failed to load payment methods");
  });
}

getPaymentCards(){
  console.log(this.paymentCards,"payment cards")

  if(this.paymentCards.length>1){
    this.payment_methods_overlay = true
  }else{
    this.paymentPlan();
  }
}

cancelPayment(){
  this.payment_methods_overlay = false;
}

}
