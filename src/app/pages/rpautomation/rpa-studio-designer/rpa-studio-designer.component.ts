import {Input, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rpa-studio-designer',
  templateUrl: './rpa-studio-designer.component.html',
  styleUrls: ['./rpa-studio-designer.component.css']
})
export class RpaStudioDesignerComponent implements OnInit {

  @Input('tabsArray') public tabsArray: any[];
  constructor() { }

  ngOnInit() {
  }



  removetab(tab)
  {
    this.tabsArray.splice(this.tabsArray.indexOf(tab), 1)
  }

}
