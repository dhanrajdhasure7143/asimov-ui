import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, ViewChild } from '@angular/core';
import { DataTransferService } from '../../services/data-transfer.service';

@Component({
  selector: 'app-rpa-studio-tabs',
  templateUrl: './rpa-studio-tabs.component.html',
  styleUrls: ['./rpa-studio-tabs.component.css'],
  // encapsulation: ViewEncapsulation.ShadowDom
})
export class RpaStudioTabsComponent implements OnInit {
  @ViewChild('t',{static: false}) ngbTabset;
  @Input('tabsArray') public tabsArray: any[];
  @Input('tabActiveId') public tabActiveId: string;
  @Output() closeTabEvent = new EventEmitter<void>();
  constructor(private dt:DataTransferService) { }

  ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/rpautomation/home", "title":"RPA Studio"});
    this.dt.changeChildModule({"route":"/pages/rpautomation/home","title":"Designer"});
  }
  closeTab(bot) {
    this.closeTabEvent.emit(bot);
    let i = this.tabsArray.findIndex(item => item.botName === bot.botName);
    if (i >= this.tabsArray.length - 1) {
      if(i == 0){
        this.tabActiveId = this.tabsArray[0].id;
      }else{   
        this.tabActiveId = this.tabsArray[i - 1].id;
      }
     
    } else {
      if(i == 0){
      this.tabActiveId = this.tabsArray[i + 1].id;
      }else{
        this.tabActiveId = this.tabsArray[i - 1].id;
      }
      
    }
  }
}
