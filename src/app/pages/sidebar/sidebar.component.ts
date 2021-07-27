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
    let selectedId=localStorage.getItem('selectedModule')
    if(selectedId){
     $('.link').removeClass('active');
     $('#'+selectedId).addClass("active");
    }
  }

  hightlight(element){
    localStorage.setItem('selectedModule',element)
     $('.link').removeClass('active');
     $('#'+element).addClass("active");
     this.obj.sideBarOpen=false;
     this.obj.sidebar.showSubmenu=false;
      this.obj.sidebar.showadminSubmenu=false;
      this.obj.contentMargin = 60;
  }
  
  selection(){
     this.obj.sideBarOpen=true;
     this.obj.contentMargin=260;
   }
}
