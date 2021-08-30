import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {NgxSpinnerService} from 'ngx-spinner';
@Component({
  selector: 'app-so-monitoring',
  templateUrl: './so-monitoring.component.html',
  styleUrls: ['./so-monitoring.component.css']
})
export class SoMonitoringComponent implements OnInit {
  url: string = "https://www.site24x7.in/public/dashboard/pKHl5Tx2Kb8CiuwPYYVUxlWp2x3RYPKPSAxnY70ddw5Ryc96EyKu/oDHVjt8ZTmMvy2blPi5kZ4kSBRbVULvP0sD6Evb3tA8VM+N2Y6iqaXdqnq0NXu6kw==";
  urlSafe: SafeResourceUrl;

  constructor(
    private spinner:NgxSpinnerService,public sanitizer: DomSanitizer) { }
  

  ngOnInit() {
    //this.spinner.show();
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  selectedTab:any=0;
  check_tab:any=0;
  onTabChanged(event)
  {
    if(event.index==2)
    event.preventDeafault
    else
    {
      this.selectedTab=event.index;
      this.check_tab=event.index;
      //this.spinner.show();
    }
  }
}

