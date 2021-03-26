import { Component, OnInit } from '@angular/core';

import {NgxSpinnerService} from 'ngx-spinner';
@Component({
  selector: 'app-so-monitoring',
  templateUrl: './so-monitoring.component.html',
  styleUrls: ['./so-monitoring.component.css']
})
export class SoMonitoringComponent implements OnInit {

  constructor(
    private spinner:NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.spinner.show();
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
      this.spinner.show();
    }
  }
}
