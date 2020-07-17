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
import Swal from 'sweetalert2';


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
  public botlist:any=[];
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
  public loadbot:FormGroup;
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
  public checkbotname:Boolean;
  constructor(public activatedRoute: ActivatedRoute, private router: Router, private dt:DataTransferService,private rest:RestApiService,
    private hints:RpaHints, private formBuilder:FormBuilder) { 
    this.show = 8;
    
    this.insertbot=this.formBuilder.group({
      botName:["", Validators.required],
      botDepartment:["", Validators.required],
      botDescription:[""],
      botType:["", Validators.required],
      predefinedBot:["false"]
  });
  this.loadbot=this.formBuilder.group({
   botType:["",Validators.required],
   botDepartment:["",Validators.required],
   bot:["",Validators.required],

  })
  
  }

  ngOnInit() 
  {
    console.log(this.insertbot.get("predefinedBot").value)
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
    this.toolSetData;
    let data1:any = [];
    this.dt.changeParentModule({"route":"/pages/rpautomation/home", "title":"RPA"});
    this.dt.changeChildModule("");
    this.dt.changeHints(this.hints.rpaHomeHints);
    this.rest.toolSet().subscribe(data => {
      console.log(data);
      data1 = data
      
      data1.General.forEach(element => {
        let temp:any = {
          name : element.name,
          path : 'data:' + 'image/png' + ';base64,' + element.icon,
          tasks: element.taskList
        };
        this.templateNodes.push(temp)
        })
        
      data1.Advanced.forEach(element => {
        let temp:any = {
          name : element.name,
          path : 'data:' + 'image/png' + ';base64,' + element.icon,
          tasks: element.taskList
        };
        this.templateNodes.push(temp)
        })
    })
  }

  checkBotnamevalidation()
  {
    let botname=this.insertbot.get("botName").value;
    
    this.rest.checkbotname(botname).subscribe(data=>{
    if(data==true && this.tabsArray.find(data=>data.botName==botname)==undefined)  
    { 
      this.checkbotname=false;
    }else
    {
      this.checkbotname=true;
    }
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
    
    document.getElementById("create-bot").style.display ="none";
    this.hiddenCreateBotPopUp = false
    let temp : any={};
    this.model=this.insertbot.value;
    console.log(this.model);
    temp = this.model;
    this.model = {};
    this.tabsArray.push(temp);  
    this.tabActiveId = temp.botName
    console.log(this.tabsArray);
    this.insertbot.reset();
    
  }

  onCreate(){
    this.insertbot.reset();
    this.insertbot.get("botDepartment").setValue("");
    this.insertbot.get("botType").setValue("");
    document.getElementById('create-bot').style.display='block';
  }

  closeBot($event) {
    this.tabsArray = this.tabsArray.filter((bot): boolean => $event !== bot);
    this.tabActiveId = this.tabsArray.length > 0 ? this.tabsArray[this.tabsArray.length - 1].id : '';
  }

  close(){
    document.getElementById("create-bot").style.display ="none";  
    document.getElementById("load-bot").style.display="none";
  }

  onLoad()
  {
    document.getElementById("load-bot").style.display="block";
  }


  loadbotdata()
  {
    this.botlist=[];
    let botType=this.loadbot.get("botType").value
    let botDepartment=this.loadbot.get("botDepartment").value
    if(botType!="" && botDepartment !="")
    {
      this.rest.getbotlist(botType,botDepartment).subscribe(data=>{
        this.botlist=data;
      })
    }
  }

  getbotdata()
  {
    let botid=this.loadbot.get("bot").value
    console.log(botid)
    let botdata:any;
    this.rest.getbotdata(botid).subscribe(data=>{
      botdata=data;
      if(this.tabsArray.find(data=>data.botName==botdata.botName)==undefined)
      {
        this.tabsArray.push(botdata);
        this.tabActiveId=botdata.botName;
      }
      else
      {
        Swal.fire({
          title: 'Selected Bot is already loaded', 
          icon: 'warning',
          showConfirmButton: false,
          timer: 2000
        });
      }  
      this.loadbot.reset();
      this.loadbot.get("bot").setValue("");
      this.loadbot.get("botType").setValue("");
      this.loadbot.get("botDepartment").setValue("");
      //this.loadbot.reset();
      document.getElementById("load-bot").style.display="none";
    })
  }

  predefined(event)
  {

    //console.log(event)
    console.log("data")
    console.log(this.insertbot.get("predefinedBot").value)
  
    /*if(this.insertbot.get("predefinedBot").value=="true")
    {
      this.insertbot.get("predefinedBot").setValue("false")
    }
    else
    {
      this.insertbot.get("predefinedBot").setValue("true")
    }*/
  }
} 

