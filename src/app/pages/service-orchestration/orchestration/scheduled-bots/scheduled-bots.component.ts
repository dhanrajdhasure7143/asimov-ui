import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {RestApiService} from '../../../services/rest-api.service';
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from 'moment';

@Component({
  selector: 'app-scheduled-bots',
  templateUrl: './scheduled-bots.component.html',
  styleUrls: ['./scheduled-bots.component.css']
})
export class ScheduledBotsComponent implements OnInit {
  selectedTab:any=0;
  check_tab:any=0;
  
  constructor(
      private rest:RestApiService,
      private spinner:NgxSpinnerService,
  ) { }

  ngOnInit() {
     }

  ngAfterViewInit() {
    
  }

  onTabChanged(event)
  {
    this.spinner.show();
    this.selectedTab=event.index;
    this.check_tab=event.index;
  }
}
