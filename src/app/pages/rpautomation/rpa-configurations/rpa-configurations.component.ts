import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rpa-configurations',
  templateUrl: './rpa-configurations.component.html',
  styleUrls: ['./rpa-configurations.component.css']
})
export class RpaConfigurationsComponent implements OnInit {
  public selectedTab=0;
  public check_tab=0;
  public param:any=0;
  selected_tab_index:Number;

  constructor(private route:ActivatedRoute, 
    private router: Router) {
      this.route.queryParams.subscribe((data) => {
        if(data)
        this.selected_tab_index = data.index
        else this.selected_tab_index=0;
      });
     }

  ngOnInit() {}

    onTabChanged(event,tabView){
      const tab = tabView.tabs[event.index].header;
      this.selected_tab_index = event.index
      this.router.navigate([],{ relativeTo:this.route, queryParams:{index:event.index} });
    }
  
  }

