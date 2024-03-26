import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { PagesComponent } from '../pages.component';
import { RestApiService } from '../services/rest-api.service';

@Component({
  selector: 'app-manage-subscriptions',
  templateUrl: './manage-subscriptions.component.html',
  styleUrls: ['./manage-subscriptions.component.scss']
})
export class ManageSubscriptionsComponent implements OnInit {
  isExpanded = true;
  showSubmenu: boolean = false;
  showadminSubmenu: boolean = false;
  showSubSubMenu: boolean = false;
  showadminSubSubMenu: boolean = false;
  userRoles: any;
  currentplansection: boolean = true;
  paymentmethodssection: boolean = false;
  billingaddresssection: boolean = false;
  paymenthistorysection: boolean = false;
  orderdetailssection: boolean = false;
  index: number;
  activeIndex :number=0
  check_tab=0
  isbillingInfoEnable:boolean = true;
  constructor(public obj: PagesComponent, private rest_service: RestApiService,
    private spinner: LoaderService,private route: ActivatedRoute,private router:Router) {
       this.route.queryParams.subscribe((data) => {
      if(data){
      this.activeIndex = data.index
      this.check_tab = data.index;
    }
      else this.activeIndex=0;
    });}

  ngOnInit(): void {
    this.getBillingIfStatus();
    this.userRoles = localStorage.getItem("userRole")
  }

  handleChange(event,tabView) {
    const tab = tabView.tabs[event.index].header;
    this.activeIndex = event.index;
    this.check_tab = event.index;
    this.router.navigate([],{ relativeTo:this.route, queryParams:{index:event.index} })
  }

  getBillingIfStatus() {
    this.rest_service.getBillingInfoStatus().subscribe((data:any) => {
      console.log(data,"billingInfoStatus")
      if(data)
        this.isbillingInfoEnable = data.status;
    })
  }
  
}
