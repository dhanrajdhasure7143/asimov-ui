import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonData } from './../../copilot-models';

@Component({
  selector: 'app-copilot-message-button',
  templateUrl: './copilot-message-button.component.html',
  styleUrls: ['./copilot-message-button.component.css']
})
export class CopilotMessageButtonComponent implements OnInit{
  @Input() buttonData: ButtonData={} as ButtonData;
  @Output() buttonAction = new EventEmitter<ButtonData>();
  constructor(){
  }
  ngOnInit(): void {
  }
  submitButton(value: any) {
    this.buttonAction.emit(value);
  }
}
