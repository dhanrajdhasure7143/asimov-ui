import { Component, ViewChild } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  templateUrl: './pages.component.html',
  styles:[`

  ::ng-deep mat-sidenav:not(.mat-drawer-opened) div.leftNav div.navProfile img {
    width: 40px; margin: 16px 0 0px 0;
  }
  ::ng-deep mat-sidenav:not(.mat-drawer-opened) .navTitle,mat-sidenav:not(.mat-drawer-opened) .profileTitle {
    display: none;
  }


  ::ng-deep .mat-drawer-side {
       border-right: none !important;

  }

  ::ng-deep .mat-drawer {
    z-index:1 !important;
  }

  .example-spacer {
    flex: 1 1 auto;
  }
  mat-sidenav:not(.mat-drawer-opened) {
    transform: translate3d(0, 0, 0) !important;
    visibility: visible !important;
    width: 60px !important;
    overflow: hidden;
  }
  .main{
    height: 90vh;
    overflow-x:unset !important;
    background-color:white !important;
  }

  .eiap-main{
    min-height:100vh !important;
    overflow:scroll !important;
  }
  `
]
})
export class PagesComponent{

  sideBarOpen:Boolean=false;
  contentMargin:any;
  @ViewChild(SidebarComponent, { static: false }) sidebar: SidebarComponent;
  constructor( ) { }

  onToolbarMenuToggle() {
    console.log('On toolbar toggled', this.sideBarOpen);
    this.sideBarOpen = !this.sideBarOpen;

    if(!this.sideBarOpen) {
      this.sidebar.showSubmenu=false
      this.contentMargin = 70;
    } else {
      this.contentMargin = 300;
    }
  }
  // sidenavEvents(str) {
  //   console.log(str);
  // }

}