import {Component, OnInit, ViewChild} from '@angular/core';
import {RestApiService} from '../../../services/rest-api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';

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
      private spinner:LoaderService,
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
