import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { RestApiService } from '../../services/rest-api.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { switchMap } from 'rxjs/operators';
import { StripeService } from 'ngx-stripe';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-subscription-plan',
  templateUrl: './subscription-plan.component.html',
  styleUrls: ['./subscription-plan.component.css']
})
export class SubscriptionPlanComponent implements OnInit {
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
  planType="Monthly";
  selectedValue:any;
  plans : any[] = ["RPA", "Process Intelligence","Orchestration","Business Process Studio","Projects" ]
  isDisabled : boolean = true;
  password : any;
  isReview_order:boolean = false;
  selected_plans_list:any;
  log_data:any={}
  isRegistered : boolean = false;
  totalAmount : number = 0;
  selectedPlan: string = '';
  constructor( private spinner : LoaderService,
    private router: Router,
    private rest: RestApiService,
    private formBuilder: FormBuilder,
    private stripeService: StripeService) { }

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

    this.loadPredefinedBots();
  }

  loadPredefinedBots(){
    this.rest.loadPredefinedBots().subscribe((response : any) =>{
      this.spinner.hide()
      console.log(response)
      if(response){
        response.forEach(element => {
          let obj=element.product
          obj["priceCollection"] = element.priceCollection
          let data = element.product.metadata?.product_features?element.product.metadata.product_features:[];
          if(data.length>0)
          obj["features"] =JSON.parse(data);
          this.botPlans.push(obj)
        });
        console.log(this.botPlans)
      // this.botPlans = response;
      // this.botPlans.forEach(item=>{
      //   item["isSelected"] = false;
      //   item["selectedTerm"] = "Monthly"
      // })
      }
    },err=>{
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
    })
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
    "cancelUrl": environment.paymentFailuerURL
  };
  console.log("PLAN_ID's", req_body);
  
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
  this.selectedPlans = [];
  this.botPlans[index].isSelected = !this.botPlans[index].isSelected;
  this.isDisabled = this.botPlans.every(item => !item.isSelected);
  this.botPlans.forEach(item => {
    if (item.isSelected) {
      this.selectedPlans.push(item);
    }
  });
  this.selectedPlan = this.selectedPlans.length > 0 ? this.selectedPlan || "Monthly" : "";
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
  
}
