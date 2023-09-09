import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectedItem } from '../../copilot-models';

@Component({
  selector: 'app-copilot-message-card',
  templateUrl: './copilot-message-card.component.html',
  styleUrls: ['./copilot-message-card.component.css']
})
export class CopilotMessageCardComponent implements OnInit {


  @Input()
  cardData: any={}
  @Input()
  mappings:any={}
  @Output()
  response= new EventEmitter<SelectedItem>();
  hideActions:boolean=false;
  selectedCardItem(selected:SelectedItem){
    this.hideActions=true;
    this.response.emit(selected);
  }

  cardItems:any=[];
  ngOnInit() {
    if (this.cardData?.values && (typeof this.cardData.values === 'string' || this.cardData.values instanceof String)){
      this.cardItems = JSON.parse(this.cardData.values);
    }else {
      this.cardItems = this.cardData.values;
    }
  }

}
