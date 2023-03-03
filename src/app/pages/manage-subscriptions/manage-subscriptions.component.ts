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

    let active_module = localStorage.getItem('selectedModule')
    if (active_module) {
      let selected_module = active_module.split('&')
      $('.link').removeClass('active');
      $('#' + selected_module[0]).addClass("active");
      if (selected_module[1]) {
        $('#' + selected_module[1]).addClass("active");
      }
    } else {
      localStorage.setItem('selectedModule', 'eiap-home&' + null);
      $('#eiap-home').addClass("active");
    }

    this.userRoles = localStorage.getItem("userRole")

  }


  // hightlight(element, name) {
  //   this.spinner.show();
  //   localStorage.setItem('selectedModule', element + '&' + name)
  //   $('.link').removeClass('active');
  //   $('#' + element).addClass("active");
  //   if (name) {
  //     $('#' + name).addClass("active");
  //   }
  //   this.obj.sideBarOpen = false;
  //   this.obj.sidebar.showSubmenu = false;
  //   this.obj.sidebar.showadminSubmenu = false;
  //   this.obj.contentMargin = 60;

  //   if (element == "currentplan") {
  //     this.billingaddresssection = false
  //     this.currentplansection = true
  //     this.paymentmethodssection = false
  //     this.paymenthistorysection = false
  //     this.orderdetailssection = false
  //   }
  //   if (element == "paymentmethods") {
  //     this.paymentmethodssection = true
  //     this.currentplansection = false
  //     this.billingaddresssection = false
  //     this.paymenthistorysection = false
  //     this.orderdetailssection = false
  //   }
  //   if (element == "billing") {
  //     this.billingaddresssection = true
  //     this.currentplansection = false
  //     this.paymentmethodssection = false
  //     this.paymenthistorysection = false
  //     this.orderdetailssection = false
  //   } if (element == "paymenthistory") {
  //     this.paymenthistorysection = true
  //     this.billingaddresssection = false
  //     this.currentplansection = false
  //     this.paymentmethodssection = false
  //     this.orderdetailssection = false
  //   }
  //   if (element == "order") {
  //     this.orderdetailssection = true
  //     this.paymenthistorysection = false
  //     this.billingaddresssection = false
  //     this.currentplansection = false
  //     this.paymentmethodssection = false
  //   }
  //   this.spinner.hide();
  // }

  handleChange(event,tabView) {
    const tab = tabView.tabs[event.index].header;
    this.activeIndex = event.index;
    console.log(this.activeIndex);
    
    this.check_tab = event.index;
    this.router.navigate([],{ relativeTo:this.route, queryParams:{index:event.index} })
  //   if (e.originalEvent.target.outerText == "Invoices") {
  //     this.paymenthistorysection = true
  //     this.billingaddresssection = false
  //     this.currentplansection = false
  //     this.paymentmethodssection = false
  //     this.orderdetailssection = false
  //   }
  //   if (e.originalEvent.target.outerText == "Billing Information") {
  //     this.billingaddresssection = true
  //     this.currentplansection = false
  //     this.paymentmethodssection = false
  //     this.paymenthistorysection = false
  //     this.orderdetailssection = false
  //   }
  //   if (e.originalEvent.target.outerText == "Payment Methods") {
  //     this.paymentmethodssection = true
  //     this.currentplansection = false
  //     this.billingaddresssection = false
  //     this.paymenthistorysection = false
  //     this.orderdetailssection = false
  //   }
  //   if (e.originalEvent.target.outerText == "Package Options") {
  //     this.billingaddresssection = false
  //     this.currentplansection = true
  //     this.paymentmethodssection = false
  //     this.paymenthistorysection = false
  //     this.orderdetailssection = false
  //   }
  // }
  }
  
}
