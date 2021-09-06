import {Input, Component, OnInit, QueryList,ViewChildren } from '@angular/core';

@Component({
  selector: 'app-rpa-studio-designer',
  templateUrl: './rpa-studio-designer.component.html',
  styleUrls: ['./rpa-studio-designer.component.css']
})
export class RpaStudioDesignerComponent implements OnInit {

  @Input('tabsArray') public tabsArray: any[];
  @ViewChildren("rpa_bot_instance") bot_instances:QueryList<any>;
  current_instance:any;
 
  constructor() { }

  ngOnInit() {
  }



  
  removetab(tab)
  {
    this.tabsArray.splice(this.tabsArray.indexOf(tab), 1)
  }


  change_active_bot(event)
  {
    console.log("------------------------------check-----------------------------",event.index)
    this.bot_instances.forEach((instance,index)=>{
      console.log(instance,index)
    })

  }

}
