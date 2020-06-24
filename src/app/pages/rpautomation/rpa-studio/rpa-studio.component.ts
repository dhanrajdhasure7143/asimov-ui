import { Component, OnInit, ViewChild } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { fromEvent } from 'rxjs';
import { jsPlumb } from 'jsplumb';
import { Router,ActivatedRoute } from '@angular/router';
import { DataTransferService } from "../../services/data-transfer.service";
import { element } from 'protractor';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { RestApiService } from '../../services/rest-api.service';
import { ContextMenuContentComponent } from 'ngx-contextmenu/lib/contextMenuContent.component';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RpaHints } from '../model/rpa-module-hints';



@Component({
  selector: 'app-rpa-studio',
  templateUrl: './rpa-studio.component.html',
  styleUrls: ['./rpa-studio.component.css']
})
export class RpaStudioComponent implements OnInit {
  model: any = {};
  public stud:any = [];
  public emailValue:any = []
  public databaseValue:any = [];
  public developercondValue:any = [];
  public excelValue:any = [];
  public optionsVisible : boolean = true;
  public state:any;
  result:any = [];
  jsPlumbInstance;
  nodes = [];
  zoomArr = [0.5,0.6,0.7,0.8,0.9,1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8];
  indexofArr = 6;
  templateNodes: any = [];
  show: number;
  toolSetData: void;
  
  listEnvironmentData:any =[];
  changePx: { x: number; y: number; };
  // forms
  public hiddenPopUp:boolean = false;
  public hiddenCreateBotPopUp:boolean = false;
  public form: FormGroup;
  public userFilter:any={name:""};
  public insertbot:FormGroup;
  unsubcribe: any;
  public fields: any[] = [];
  resp: any[] = [];
  formHeader: any[] = [];
  selectedNode: any= [];
  formVales:any[] = [];
  fieldValues: any[] = [];
  allFormValues: any[] = [];
  saveBotdata:any = [];
  selectedTasks: any[] = [];
  exectionValue: any;
  tabsArray: any[] = [];
  tabActiveId: string;
  constructor(public activatedRoute: ActivatedRoute, private router: Router, private dt:DataTransferService,private rest:RestApiService,
    private hints:RpaHints, private formBuilder:FormBuilder) { 
    this.show = 5;
    
    this.insertbot=this.formBuilder.group({
      botName:["", Validators.required],
      botDepartment:["", Validators.required],
      botDescription:[""],
      botType:["", Validators.required],
  });
  
  }

  ngOnInit() {
    if(localStorage.getItem("enablecreate"))
    {
      this.hiddenCreateBotPopUp=true;
      localStorage.removeItem("enablecreate");
      this.insertbot.reset();
    }
    else
    {
      this.hiddenCreateBotPopUp=false;
    }

    this.dt.changeParentModule({"route":"/pages/rpautomation/home", "title":"RPA Automation"});
    this.dt.changeChildModule("");
    this.dt.changeHints(this.hints.rpaHomeHints);
    this.rest.toolSet().subscribe(data => {
      console.log(data);
      let value:any = [];
      let subValue:any = []
      this.toolSetData;
      let data1:any = [];
      // data1 = this.nData
      data1 = data
      data1.General.forEach(element => {
        data1.Advanced.forEach(el => {
        subValue.push(el.NLP);
        subValue.push(el.OCR);
        subValue.push(element.Email);
        this.emailValue.push(element.Email);
        subValue.push(element.Database);
        this.databaseValue.push(element.Database);
        subValue.push(element["Developer Condition"]);
        //subValue.push(element["Database"])
        this.developercondValue.push(element["Developer Condition"]);
        subValue.push(element["Excel File"]);
        this.excelValue.push(element["Excel File"]);
        console.log(subValue)
        subValue.forEach(ele => {
          value.push(ele)
          console.log(value);
      // Object.keys(ele).forEach(function(key) {
      //   value.push(Object.keys(ele[key]));
      //   console.log(value)
      // })
    })
    });
  })
  value.forEach(element => {
    let temp:any = {
      name : element.name,
      path : 'data:' + 'image/png' + ';base64,' + element.icon,
      tasks: element.taskList
    };
    this.templateNodes.push(temp)
    })
  })
}
  increaseShow() {
    this.show += 5; 
  }

  public removeItem(item: any, list: any[]): void {
    list.splice(list.indexOf(item), 1);
  }

  onCreateSubmit() {
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model))
    this.hiddenCreateBotPopUp = false
    let temp : any={};
    this.model=this.insertbot.value;
    console.log(this.model);
    temp = this.model;

    this.model = {};
  
    this.tabsArray.push(temp);  
    this.tabActiveId = temp.botNamee
    console.log(this.tabsArray);
    this.insertbot.reset();
    
  }
  onCreate(){
    this.insertbot.reset();
    this.hiddenCreateBotPopUp = true
  }
  closeBot($event) {
    this.tabsArray = this.tabsArray.filter((bot): boolean => $event !== bot);
    this.tabActiveId = this.tabsArray.length > 0 ? this.tabsArray[this.tabsArray.length - 1].id : '';
  }
  closeFun(){
    this.hiddenCreateBotPopUp = false
  }
} 

