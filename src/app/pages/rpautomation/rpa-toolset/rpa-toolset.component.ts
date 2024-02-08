import {ViewChild,Input, Output, Component,Injectable, OnInit, ElementRef, EventEmitter  } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { DataTransferService } from '../../services/data-transfer.service';

@Injectable()
@Component({
  selector: 'app-rpa-toolset',
  templateUrl: './rpa-toolset.component.html',
  styleUrls: ['./rpa-toolset.component.css']
})
export class RpaToolsetComponent implements OnInit {
  
    constructor(private rest:RestApiService,
      public dt:DataTransferService,
      ) { }

    public userFilter:any={name:""};
    @ViewChild('section') section: ElementRef<any>;
    @Input("toolsetItems") public templateNodes:any=[];
    @Output("closeToolset") closeToolset=new EventEmitter();
    userRole:any;
    search:any=false;
    sidenavbutton:Boolean=false;
    isMicroBotsTabActive: boolean = false;
    isToolSetTabActive: boolean = false;
    public microBotsUserFilter: any = { name: "" };
    microBotsList: any[] = [];

    ngOnInit() {
      this.dt.changeParentModule({"route":"/pages/rpautomation/home", "title":"RPA Studio"});
      this.dt.changeChildModule({"route":"/pages/rpautomation/home","title":"Designer"});
      this.getMicroBots();
    }
    searchclear(){
      this.search=false
      this.userFilter.name=""
    }
    closeToolsetEvent()
    {
      this.closeToolset.emit(null);
    }

    onTabChange(event: any) {
      // Update the flag based on the active tab
      this.isMicroBotsTabActive = event.index === 1;
      this.isToolSetTabActive = event.index === 0; // Assuming Micro Bots tab index is 1
    }

    get filteredMicroBotsList(): any[] {
      return this.microBotsList.filter(microBot =>
          microBot.microBotName.toLowerCase().includes(this.microBotsUserFilter.name.toLowerCase())
      );
  }
  
  getMicroBots(){
    this.rest.getMicroBots().subscribe((data: any[]) => {
      this.microBotsList = data;
    });
  }
  
    
  }




