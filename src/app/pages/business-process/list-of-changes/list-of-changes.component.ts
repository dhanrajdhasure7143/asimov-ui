import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { GlobalScript } from 'src/app/shared/global-script';

@Component({
  selector: 'app-list-of-changes',
  templateUrl: './list-of-changes.component.html',
  styleUrls: ['./list-of-changes.component.css']
})
export class ListOfChangesComponent implements OnInit {

  @Output() closeDiff = new EventEmitter<any>();

  changes:any;
  added_Count;
  changed_Count;
  layoutChanged_Count;
  removed_Count;
  isHavingChange:boolean = false;
  constructor(private bpmnservice:SharebpmndiagramService, private global:GlobalScript) { }

  ngOnInit() {
    this.bpmnservice.sendDiff.subscribe(res => {
      this.changes = res;
    })
  }
  slideDown(){
    let ele = document.getElementById("bpmn_differences");
    if(ele){
      ele.classList.add("slide-down");
      ele.classList.remove("slide-up");
    }
    this.closeDiff.emit();
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

  hasChanges(changes){
    this.isHavingChange = this.getArray(changes._removed) + this.getArray(changes._added) + this.getArray(changes._changed) + this.getArray(changes._layoutChanged) != 0;
    return this.isHavingChange;
  }
  
}
