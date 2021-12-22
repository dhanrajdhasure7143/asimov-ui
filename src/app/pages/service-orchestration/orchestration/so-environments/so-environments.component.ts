import { Component,  OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-so-environments',
  templateUrl: './so-environments.component.html',
  styleUrls: ['./so-environments.component.css']
})
export class SoEnvironmentsComponent implements OnInit {
  public selectedTab=0;
  public check_tab=0;
  public param:any=0;
  public processId : any;
  constructor(
    private route : ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.processId=params;
    if(this.isEmpty(this.processId))
    {
      this.selectedTab=0;
      this.param=0;
      this.check_tab=0
    }
    else
    {
      this.selectedTab=1;
      this.param=this.processId.processid;
      this.check_tab=1;
      
    }
  });
   
  }
  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }
  onTabChanged(event)
  {
    this.check_tab=event.index;
  }
  

}
