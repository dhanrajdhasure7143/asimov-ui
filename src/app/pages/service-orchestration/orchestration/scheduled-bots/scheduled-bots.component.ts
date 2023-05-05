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
  categoriesList:any[]=[];
  
  constructor(
      private rest:RestApiService,
      private spinner:LoaderService,
  ) { }

  ngOnInit() {

     }

  ngAfterViewInit() {
    this.getCategoryList();
  }

  onTabChanged(event){
    this.spinner.show();
    this.selectedTab=event.index;
    this.check_tab=event.index;
  }

  getCategoryList(){
    this.rest.getCategoriesList().subscribe(data=>{
      let catResponse : any;
      catResponse=data
      this.categoriesList=catResponse.data.sort((a, b) => (a.categoryName.toLowerCase() > b.categoryName.toLowerCase()) ? 1 : ((b.categoryName.toLowerCase() > a.categoryName.toLowerCase()) ? -1 : 0));
    });
  }
}
