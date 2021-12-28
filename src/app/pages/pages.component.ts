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
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)  !important;
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
    height: calc(100% - 52px);
    background-color: #d9dfe4 !important;
    z-index: 1;
    position: relative;
    top: 52px;
  }

  .eiap-main{
    min-height:100vh !important;
    overflow:scroll !important;
  }


  .shadow{
    box-shadow: 0 3px 5px -1px rgb(0 0 0 / 20%), 0 6px 10px 0 rgb(0 0 0 / 14%), 0 1px 18px 0 !important;
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
  
    this.sideBarOpen = !this.sideBarOpen;

    if(!this.sideBarOpen) {
      this.sidebar.showSubmenu=false
      this.sidebar.showadminSubmenu=false
      this.contentMargin = 60;
    } else {
      this.contentMargin = 260;
    }
  }
  // sidenavEvents(str) {
  //   console.log(str);
  // }

}