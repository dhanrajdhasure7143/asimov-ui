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
    @ViewChild('section', {static: false}) section: ElementRef<any>;
    @Input("toolsetItems") public templateNodes:any=[];
   @Output("closeToolset") closeToolset=new EventEmitter();
    userRole:any;
    search:any=false;
    sidenavbutton:Boolean=false;
    ngOnInit() {
      this.dt.changeParentModule({"route":"/pages/rpautomation/home", "title":"RPA Studio"});
      this.dt.changeChildModule({"route":"/pages/rpautomation/home","title":"Designer"});
    }
    searchclear(){
      this.search=false
      this.userFilter.name=""
    }
    closeToolsetEvent()
    {
      this.closeToolset.emit(null);
    }
  }




