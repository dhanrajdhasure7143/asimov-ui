import { Component, OnInit } from '@angular/core';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';

@Component({
  selector: 'app-list-of-changes',
  templateUrl: './list-of-changes.component.html',
  styleUrls: ['./list-of-changes.component.css']
})
export class ListOfChangesComponent implements OnInit {

  changes:any;
  added_Count;
  changed_Count;
  layoutChanged_Count;
  removed_Count;
  constructor(private bpmnservice:SharebpmndiagramService) { }

  ngOnInit() {
    this.bpmnservice.sendDiff.subscribe(res => {
      this.changes = res;
    })
  }
  slideDown(){
    let ele = document.getElementById("foot");
    if(ele){
      ele.classList.add("slide-down");
      ele.classList.remove("slide-up");
    }
  }
  jsonLength(json){
    let value = 0;
    if(json){
      value = Object.keys(json).length;
    }
    return value;
  }
  getArray(json){
    if(json){
      let process_name = Object.keys(json);
      if(process_name.length != 0)
        return json[process_name[0]]["flowElements"]
      else
        return [];
    }else{
      return [];
    }
  }

  getProcessType(type){
    return type.replace('bpmn:','');
  }
  
}
