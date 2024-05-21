import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rpa-approvals-tabs',
  templateUrl: './rpa-approvals-tabs.component.html',
  styleUrls: ['./rpa-approvals-tabs.component.css']
})
export class RpaApprovalsTabsComponent implements OnInit {
  public selectedTab = 0;
  public check_tab = 0;
  selected_tab_index: number = 0;

  constructor(private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe((data) => {
      if (data) {
        this.selected_tab_index = data.index
        this.check_tab = data.index;
      }
      else this.selected_tab_index = 0;
    });
  }

  ngOnInit() { }

  onTabChanged(event, tabView) {
    const tab = tabView.tabs[event.index].header;
    this.selected_tab_index = event.index;
    this.check_tab = event.index;
    this.router.navigate([], { relativeTo: this.route, queryParams: { index: event.index } });
  }

}

