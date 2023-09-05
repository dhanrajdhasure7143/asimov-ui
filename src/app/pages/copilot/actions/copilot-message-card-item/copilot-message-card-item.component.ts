import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectedItem } from '../../copilot-models';
import { getElementValue } from '../../Utilities';

@Component({
  selector: 'app-copilot-message-card-item',
  templateUrl: './copilot-message-card-item.component.html',
  styleUrls: ['./copilot-message-card-item.component.css']
})
export class CopilotMessageCardItemComponent implements OnInit {

  properties: string[] = ['header', 'title', 'description', 'footer', 'items', 'submitValue','icon'];
  @Input()
  cardItemData: any = undefined
  @Input()
  mappings: any = undefined;
  @Output()
  response= new EventEmitter<SelectedItem>();

  data: any = {};

  ngOnInit() {
    this.properties.forEach(i => {
      let val = getElementValue(i, this.mappings, this.cardItemData);
      if (val) this.data[i] = val;
    })
  }

  selectedCard(item:any){
    this.response.emit({
      label: item.title, submitValue: item.submitValue
    });
  }
}
