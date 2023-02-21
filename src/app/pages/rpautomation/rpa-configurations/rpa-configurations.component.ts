import { Component, OnInit } from '@angular/core';
import { DataTransferService} from "../../services/data-transfer.service";
import { VERSION } from '@angular/material/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rpa-configurations',
  templateUrl: './rpa-configurations.component.html',
  styleUrls: ['./rpa-configurations.component.css']
})
export class RpaConfigurationsComponent implements OnInit {
  public selectedTab=0;
  public check_tab=0;
  public param:any=0;

  constructor(private dt:DataTransferService, private route:ActivatedRoute) { }

  ngOnInit() {
    
    this.dt.changeParentModule({"route":"/pages/rpautomation/home", "title":"RPA Studio"});
      this.dt.changeChildModule({"route":"/pages/rpautomation/environments","title":"Configurations"});
      this.dt.changeChildModule(undefined);
    
    if(localStorage.getItem("config_tab")){
      this.selectedTab = Number(localStorage.getItem("config_tab"));
      this.check_tab = Number(localStorage.getItem("config_tab"));
      }else{
        
      }
    }
    isEmpty(obj) {
      for(var key in obj) {
          if(obj.hasOwnProperty(key))
              return false;
      }
      return true;
    }
    onTabChanged(event){
      localStorage.setItem("config_tab", event.index)
      this.check_tab=event.index;
    }
    back(event){
      localStorage.setItem("config_tab", event.index = null)
      this.selectedTab=0;
      this.check_tab = 0;
    }
  }

