import { Component, OnInit } from '@angular/core';
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
  isShowing = false;
  showSubSubMenu: boolean = false;
  showadminSubSubMenu: boolean = false;
  userRoles: any;
  currentplansection: boolean = true;
  paymentmethodssection: boolean = false;
  billingaddresssection: boolean = false;
  paymenthistorysection: boolean = false;
  orderdetailssection: boolean = false;
  constructor(private obj: PagesComponent, private rest_service: RestApiService) { }

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


  hightlight(element, name) {
    localStorage.setItem('selectedModule', element + '&' + name)
    $('.link').removeClass('active');
    $('#' + element).addClass("active");
    if (name) {
      $('#' + name).addClass("active");
    }
    this.obj.sideBarOpen = false;
    this.obj.sidebar.showSubmenu = false;
    this.obj.sidebar.showadminSubmenu = false;
    this.obj.contentMargin = 60;

    if (element == "currentplan") {
      this.billingaddresssection = false
      this.currentplansection = true
      this.paymentmethodssection = false
      this.paymenthistorysection = false
      this.orderdetailssection = false
    }
    if (element == "paymentmethods") {
      this.paymentmethodssection = true
      this.currentplansection = false
      this.billingaddresssection = false
      this.paymenthistorysection = false
      this.orderdetailssection = false
    }
    if (element == "billing") {
      this.billingaddresssection = true
      this.currentplansection = false
      this.paymentmethodssection = false
      this.paymenthistorysection = false
      this.orderdetailssection = false
    } if (element == "paymenthistory") {
      this.paymenthistorysection = true
      this.billingaddresssection = false
      this.currentplansection = false
      this.paymentmethodssection = false
      this.orderdetailssection = false
    }
    if (element == "order") {
      this.orderdetailssection = true
      this.paymenthistorysection = false
      this.billingaddresssection = false
      this.currentplansection = false
      this.paymentmethodssection = false
    }
  }
}
