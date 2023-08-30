import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectedItem, SelectionList } from '../../copilot-models';
import { getElementValue } from '../../Utilities';
import { DataTransferService } from 'src/app/pages/services/data-transfer.service';
import * as BpmnJS from "../../../../bpmn-modeler-copilot.development.js";


@Component({
  selector: 'app-copilot-message-list',
  templateUrl: './copilot-message-list.component.html',
  styleUrls: ['./copilot-message-list.component.css']
})
export class CopilotMessageListComponent implements OnInit {

  properties: string[] = ['label', 'title','description', 'items', 'submitValue','icon', 'items.id','items.name', 'imageURL', 'bpmnXml'];
  @Input()
  listData: any={};

  @Input()
  mappings: any={};

  @Output()
  response= new EventEmitter<SelectedItem>();
  selectedItem:SelectedItem={};
  selectedProcessSteps:any={};
  selectionListValues:any;
  componentData:any=[];
  @Output() previewResponse= new EventEmitter();
  isLoaded:Boolean=false;
  subscription: any;
  bpmnModeler: any;

  constructor(private data: DataTransferService) { }



  ngOnInit() {
    console.log("test",this.listData)

    if ('selectList' === this.listData?.type){
      //Handling encoding
      if (this.listData?.encoded){
        // let buff = new Buffer(this.listData?.values, 'base64');
        this.selectionListValues = atob(this.listData?.values);
        this.selectionListValues = JSON.parse(this.selectionListValues);
      }else {
        this.selectionListValues = this.listData?.values;
      }

      //handling mappings
      this.selectionListValues.forEach((d:any) =>{
        let item:any={};
        this.properties.forEach(i => {
          let val = getElementValue(i, this.mappings, d);
          if (val) item[i] = val ;
        });
        this.componentData.push(item);
      });
      
    }

    if ('bpmnList' === this.listData?.type){
      //Handling encoding
      if (this.listData?.encoded){
        // let buff = new Buffer(this.listData?.values, 'base64');
        this.selectionListValues = atob(this.listData?.values);
        this.selectionListValues = JSON.parse(this.selectionListValues);
      }else {
        this.selectionListValues = this.listData?.values;
      }

      console.log("bpmn data", this.selectionListValues)
      this.processResponse(this.selectionListValues)
      //handling mappings
      this.selectionListValues.forEach((d:any,index) =>{

        let item:any={};
        this.properties.forEach(i => {
          console.log("data", i)
          let val = getElementValue(i, this.mappings, d);
          if (val) item[i] = val ;
        });
        if(d.templateName) item["label"]=d.templateName
        this.componentData.push(item);
      });
      
    }
    //TODO: Need to think how to identify modified step
    if ( this.selectionListValues && this.selectionListValues.length ===1){
        this.previewUpdatedProcess();
    }
    this.subscription = this.data.currentMessage.subscribe((selectedProcessSteps:any) => this.selectedProcessSteps = selectedProcessSteps)
  }

  selectedCard(){
    this.response.emit({
      label: this.selectedItem.label, submitValue: this.selectedItem.submitValue
    });
  }

  userSelectedItem(label:string, submitValue:string, elem:any){
    this.selectedItem.label = label;
    this.selectedItem.submitValue= submitValue;
    if(elem.bpmnXml) this.previewResponse.emit(elem);
    this.previewSelectedProcess();
  }
  previewUpdatedProcess(){

    this.data.updateProcess(this.selectionListValues &&  this.selectionListValues[0]? this.selectionListValues[0]:{});
  }
  previewSelectedProcess(){
    let filter:any = this.selectionListValues?.filter((i:any) => this.selectedItem.submitValue === i[this.mappings?.submitValue] || this.selectedItem.submitValue === i?.submitValue)
    this.data.updateProcess(filter &&  filter[0]? filter[0]:{});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  processButtonAction(event:any){
    console.log('message list button action '+JSON.stringify(event))
    if (event?.submitValue?.toUpperCase() ==='SUBMIT'){
      //Selected one of the template
      this.selectedCard();

    }
    else  if (event?.submitValue?.toUpperCase() ==='OTHER'){
      //None of the above

      this.response.emit({
        label: event.label, submitValue: event.submitValue
      });
    }
  }

  async processResponse(response) {
    for (let index = 0; index < response.length; index++) {
      const item = atob(response[index].bpmnXml);
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.loadBpmnInTemplate(item, index);
    }
  }

  loadBpmnInTemplate(bpmnPath,index){
    setTimeout(() => {
      this.bpmnModeler = new BpmnJS({
        container: ".diagram_container-copilot_chat"+ + index,
      });
      this.bpmnModeler.importXML(bpmnPath, function (err) {
        if (err) {
          console.error("could not import BPMN EZFlow notation", err);
        }
      });
      setTimeout(() => {
        let canvas = this.bpmnModeler.get("canvas");
        canvas.zoom("fit-viewport");
      }, 500);
    }, 2000);
  }

}

