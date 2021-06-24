import { Component, OnInit } from '@angular/core';
import {PagesComponent} from '../pages.component'
import * as $ from 'jquery';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isExpanded = true;
  showSubmenu: boolean = false;
  showadminSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  showadminSubSubMenu: boolean = false;
  constructor(private obj:PagesComponent) { }

  ngOnInit() {
    //this.disable();
  }

  hightlight(element)
  {
     $('.link').removeClass('active')
     $('#'+element).addClass("active")
  }
}
