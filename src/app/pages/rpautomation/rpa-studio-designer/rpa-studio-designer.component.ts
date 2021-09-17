import {Input, Component, OnInit, QueryList,ViewChildren } from '@angular/core';
import { RpaStudioComponent } from '../rpa-studio/rpa-studio.component';

@Component({
  selector: 'app-rpa-studio-designer',
  templateUrl: './rpa-studio-designer.component.html',
  styleUrls: ['./rpa-studio-designer.component.css']
})
export class RpaStudioDesignerComponent implements OnInit {

  @Input('tabsArray') public tabsArray: any[];
  @ViewChildren("rpa_bot_instance") bot_instances:QueryList<any>;
  current_instance:any;
  toolset_instance:any;
  constructor(private rpa_studio:RpaStudioComponent) { }

  ngOnInit() {
    
    localStorage.setItem("isHeader","true");
 
  }

  ngAfterViewInit()
  {
    console.log(this.tabsArray.length)
    localStorage.setItem("isHeader","true");
  
      setTimeout(()=>{
        console.log(this.bot_instances)
        this.bot_instances.forEach((instance,index)=>{
          this.current_instance=instance.rpa_actions_menu;
          this.toolset_instance=instance;
          });
      },2500)
     
  
    localStorage.setItem("isHeader","true");
  }

  
  removetab(tab)
  {
    this.tabsArray.splice(this.tabsArray.indexOf(tab), 1)
  }


  change_active_bot(event)
  {
    this.current_instance=undefined;
    this.toolset_instance=undefined;
    this.rpa_studio.spinner.show();
    setTimeout(()=>{
      this.bot_instances.forEach((instance,index)=>{
        if(index==event.index)
        {
          this.toolset_instance=instance
          this.current_instance=instance.rpa_actions_menu;
          this.rpa_studio.spinner.hide();
        }
      })
    },2500)
    
    
    console.log(this.current_instance)
  }

}
