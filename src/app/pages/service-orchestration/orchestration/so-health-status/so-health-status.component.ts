import { Component, OnInit } from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-so-health-status',
  templateUrl: './so-health-status.component.html',
  styleUrls: ['./so-health-status.component.css']
})
export class SoHealthStatusComponent implements OnInit {
  url: string = "https://www.site24x7.in/dv.do?id=CWYYTvwa89LK5SEUmoBgc7TE2nujogYh7mQGOctQmyOmWpny1mmJ4BMk2UuHtwAzMThErN5runTUj5kwkSwLaDCA6mPws4fo";
  urlSafe: SafeResourceUrl;
  constructor( 
    private spinner:NgxSpinnerService,public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    this.spinner.show();
    setTimeout(()=>{

    },500)
  }

}
