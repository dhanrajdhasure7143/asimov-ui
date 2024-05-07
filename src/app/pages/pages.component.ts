import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DataTransferService } from './services/data-transfer.service';

@Component({
  selector: 'app-home',
  templateUrl: './pages.component.html',
  styles: [`

  ::ng-deep mat-sidenav:not(.mat-drawer-opened) div.leftNav div.navProfile img {
    width: 40px; margin: 16px 0 0px 0;
  }
  ::ng-deep mat-sidenav:not(.mat-drawer-opened) .navTitle,mat-sidenav:not(.mat-drawer-opened) .profileTitle {
    display: none;
  }


  ::ng-deep .mat-drawer-side {
       border-right: none !important;
      box-shadow:0 4px 8px 0 rgb(0 0 0 / 10%);
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
    height: calc(100% - 55px);
    background-color: #f9f9f9 !important;
    z-index: 1;
    position: relative;
    top: 55px;
  }

  .eiap-main{
    min-height:100vh !important;
    overflow:scroll !important;
  }


  .shadow{
    box-shadow: 0 3px 5px -1px rgb(0 0 0 / 20%), 0 6px 10px 0 rgb(0 0 0 / 14%), 0 1px 18px 0 !important;
  }

  .content-div {
    margin-left: 70px !important;
  }
  `
  ]
})
export class PagesComponent implements OnInit {

  sideBarOpen: Boolean = true;
  contentMargin: any = 62;
  tenantInfo:any={};
  isPredefinedBotUser:boolean = false;

  @ViewChild(SidebarComponent) sidebar: SidebarComponent;
  @ViewChild('iframeRef') iframeRef: ElementRef;
  
  constructor(private dt: DataTransferService) {
    this.dt._tenant_info.subscribe(res=>{
      if(res){
        console.log(res)
        this.tenantInfo=res;
        this.isPredefinedBotUser = res.isPredefinedBots
      }
    })
   }
   
  ngOnInit(): void {
    this.onToolbarMenuToggle();
  }

  ngAfterViewInit() {
    if(this.isPredefinedBotUser){
        setTimeout(() => {
          const iframe = document.getElementById('iframeRef') as HTMLIFrameElement;
          iframe.contentWindow.postMessage({ action: 'botKey', bot_key: 'g/ogMiS7UKhQwMXnUrKqlXGgNW/fm8cgloMwUzAuuAboQ/YIViOsalrEHPfMVdUWQId802CtpRrOdpW33YhGVqMSEUbXbJC5zkM=' }, '*');
        }, 2000);
        
        window.addEventListener('message', event => {
          const message = event.data;
          const iframe = document.getElementById('iframeRef') as HTMLIFrameElement;
              iframe.style.height = message.height;
              iframe.style.width = message.width;
      });
    }
  }

  onToolbarMenuToggle() {
    this.sideBarOpen = !this.sideBarOpen;
    (!this.sideBarOpen)?this.hideSubMenu():this.contentMargin = 260;
  }

  hideSubMenu(){
    if(!(this.sidebar)) setTimeout(()=>{this.hideSubMenu()},100);
    else{
    this.sidebar.showSubmenu = false
    this.sidebar.showprocessesSubmenu = false
    this.sidebar.showadminSubmenu = false
    this.contentMargin = 62;
    }
  }
}