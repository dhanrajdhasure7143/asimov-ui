import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StripeService } from 'ngx-stripe';
import { MessageService } from 'primeng/api';
import { switchMap } from 'rxjs/operators';
import { CryptoService } from 'src/app/services/crypto.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { PredefinedBotsService } from 'src/app/pages/services/predefined-bots.service';

@Component({
  selector: 'app-payment-collection',
  templateUrl: './payment-collection.component.html',
  styleUrls: ['./payment-collection.component.css']
})
export class PaymentCollectionComponent implements OnInit {
  email:any;
  selectedAgent:any;
  agentsQuantity: number = 1;
  isYearly: boolean = true;
  selectedAgentId:any;
  totalAmount: number = 0;

  constructor(private route : ActivatedRoute,
    private crypto: CryptoService,
    private service : PredefinedBotsService,
              private spinner : LoaderService,
              private router: Router,
              private stripeService: StripeService,
              private messageService: MessageService,
              private toaster: ToasterService,
              private toastMessages: toastMessages,
) {
 this.route.queryParams.subscribe(data => {
    if (data && data.token) {
    this.email = this.crypto.decrypt(data.token);
    } else {
    }
    if (data && data.id) this.selectedAgentId = data.id;
    if (data && data.quantity) this.agentsQuantity = data.quantity;
    if (data && data.isYearly) this.isYearly = data.isYearly === 'true';
})
this.loadPredefinedBots();
}

  ngOnInit(): void {
  }

  loadPredefinedBots() {
    this.spinner.show();
    this.service.loadPredefinedBots().subscribe((response: any) => {
        this.spinner.hide();
        if (response) {
            response.forEach((agent) => {
                if(agent.product.id == this.selectedAgentId){
                this.selectedAgent = agent.product;
                this.selectedAgent["priceCollection"] = agent.priceCollection;
                }
            });
            this.getTotalAmount();
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

  incrementAgents() {
    this.agentsQuantity++;
    this.getTotalAmount();
  }

  decrementAgents() {
    if (this.agentsQuantity > 1) {
      this.agentsQuantity--;
      this.getTotalAmount();
    }
  }

  proceedToPay() {
    // console.log(`Proceeding to pay for ${this.agentsQuantity} agents on ${this.isYearly ? 'yearly' : 'monthly'} plan`);
    // Implement payment logic here
    this.spinner.show();
  
    // let selectedInterval = (this.selectedPlan === 'Monthly') ? 'month' : 'year';
    let filteredPriceIds = [];
      let selectedTire = !this.isYearly ? 'month' : 'year'
      this.selectedAgent.priceCollection.forEach((price) => {
        if (price.recurring.interval === selectedTire) {
          let obj = {};
          obj["id"] = price.id;
          obj["quantity"] = this.agentsQuantity;
          filteredPriceIds.push(obj);
        }
      });

  
  
    if (filteredPriceIds.length === 0) {
      // Handle the case when no price is selected for the chosen interval
      // console.error('No price selected for the chosen interval.');
      this.spinner.hide();
      return;
    }
    
    let filteredUrls = this.router.url.split('&');
    let req_body = {
      // "price": filteredPriceIds,
      "priceData": filteredPriceIds.map(price => ({
        "price": price.id,
        "quantity": price.quantity
      })),
      "customerEmail": this.email,
      "successUrl": environment.paymentSuccessURL,
      // "cancelUrl": environment.paymentFailuerURL+"?token="+this.crypto.encrypt(this.userEmail)
    //   "cancelUrl": environment.paymentFailuerURL+"?token="+this.email+"&id="+this.selectedAgentId+"&quantity="+this.agentsQuantity+"&isYearly="+this.isYearly
      // "cancelUrl": environment.paymentFailuerURL+this.router.url+"&quantity="+this.agentsQuantity+"&isYearly="+this.isYearly
      "cancelUrl": environment.paymentFailuerURL+filteredUrls[0]+'&'+filteredUrls[1]+"&quantity="+this.agentsQuantity+"&isYearly="+this.isYearly
    };
    // console.log("PLAN_ID's", req_body);
    
    this.service.getCheckoutScreen(req_body).pipe(
        switchMap((session: any) => {
          this.spinner.hide();
          return this.stripeService.redirectToCheckout({ sessionId: session.id });
        })
      ).subscribe(
        res => {
          this.spinner.hide();
        },error => {
          this.spinner.hide();
          this.toaster.showError(this.toastMessages.apierror);
        }
      );
  }

  getTotalAmount(){
    let selectedTire = !this.isYearly ? 'month' : 'year'
    this.selectedAgent.priceCollection.forEach((price) => {
      if (price.recurring.interval === selectedTire) {
        this.totalAmount= price.unitAmount * this.agentsQuantity;
      }
    });
  }

  onplanTyreChanges(){
    this.getTotalAmount();
  }

}