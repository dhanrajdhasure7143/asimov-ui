import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { DataTransferService } from "../../services/data-transfer.service";
import { RestApiService } from '../../services/rest-api.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-rpa-studio',
  templateUrl: './rpa-studio.component.html',
  styleUrls: ['./rpa-studio.component.css']
})
export class RpaStudioComponent implements OnInit {
  model: any = {};
  public count:number;
  public botNamespace:boolean;
  public stud:any = [];
  public emailValue:any = []
  public databaseValue:any = [];
  public developercondValue:any = [];
  public excelValue:any = [];
  public optionsVisible : boolean = true;
  public state:any;
  public botlist:any=[];
  public rpaCategory:any;
  public newRpaCategory:any;
  public categaoryList:any=[];
  result:any = [];
  jsPlumbInstance;
  nodes = [];
  zoomArr = [0.5,0.6,0.7,0.8,0.9,1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8];
  indexofArr = 6;
  templateNodes: any = [];
  show: number;
  toolSetData: void;

  changerpa_screen:Boolean;
  changescreen_rpa_model:Boolean =false;
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
  userRole;
  public checkbotname:Boolean;
  @ViewChild('section', {static: false}) section: ElementRef<any>;
  constructor(public activatedRoute: ActivatedRoute, private router: Router, private dt:DataTransferService,private rest:RestApiService, private formBuilder:FormBuilder,public spinner: NgxSpinnerService) {
    this.show = 8;

    this.insertbot=this.formBuilder.group({
      botName:["", Validators.required],
      botDepartment:["", Validators.required],
      botDescription:[""],
      botType:["", Validators.required],
      taskId:[""],
      predefinedBot:["false"],
      newCategoryName:[""]
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
    this.rest.toolSet().subscribe(data => {
      console.log(data);
      data1 = data
      this.userRole = localStorage.getItem("userRole")
      this.userRole = this.userRole.split(',');
      data1.General.forEach(element => {
        let temp:any = {
          name : element.name,
          path : 'data:' + 'image/png' + ';base64,' + element.icon,
          tasks: element.taskList
        };
        if((this.userRole.includes('User') &&
              (temp.name === 'Email' || temp.name === 'Excel' || temp.name === 'Database' || temp.name === 'Developer'))
            || !this.userRole.includes('User')){
          this.templateNodes.push(temp)
        }
      })
      if(!this.userRole.includes('User')){
        data1.Advanced.forEach(element => {
          let temp:any = {
            name : element.name,
            path : 'data:' + 'image/png' + ';base64,' + element.icon,
            tasks: element.taskList
          };
          this.templateNodes.push(temp)
          if(localStorage.getItem("tabsArray")!=undefined)
          {
            let tabsData:any=[];
            tabsData=JSON.parse(localStorage.getItem("tabsArray"));
            tabsData.forEach(data=>{
                this.getloadbotdata(data.botId);
            })
            localStorage.removeItem("tabsArray");
          }
          this.spinner.hide();
        })
      }
    })
  }

  validate(code){
    let validate = code;
    console.log(validate);
    this.count = 0;
    for(let i=0;i < validate.length -1; i++){
      if(validate.charAt(i) == String.fromCharCode(32)){
        this.count= this.count+1;
        console.log(this.count);
      }
    }
    if(this.count !== 0)
    {
      this.botNamespace = true;
      console.log(this.botNamespace);
    }
    else{
      this.botNamespace = false;
    }
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


  public scrolltop(){
    this.section.nativeElement.scrollTo({ top: (this.section.nativeElement.scrollTop - 40), behavior: 'smooth' });
  }

  public scrollbottom() {
    this.section.nativeElement.scrollTo({ top: (this.section.nativeElement.scrollTop + 40), behavior: 'smooth' });
  }

  increaseShow() {
    this.show += 5;
  }

  public removeItem(item: any, list: any[]): void {
    list.splice(list.indexOf(item), 1);
  }

  onCreateSubmit() {
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model))
    this.userFilter.name = "";
    document.getElementById("create-bot").style.display ="none";
    this.model=this.insertbot.value;
    if(this.model.botDepartment=="others"){
      this.saveRpaCategory().subscribe(data=>{
        let catResponse : any;
        catResponse=data;
        this.model.botDepartment=catResponse.data.categoryId;
        this.tabsArray.push(this.model);
      });
    }else{
      this.tabsArray.push(this.model);
    }
    this.tabActiveId = this.model.botName;
    this.insertbot.reset();

  }

  onCreate(taskId){
    this.getCategoryList();
    this.insertbot.reset();
    this.insertbot.get("botDepartment").setValue("");
    this.insertbot.get("botType").setValue("");
    this.insertbot.get("taskId").setValue(taskId);
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
    this.getCategoryList();
    this.loadbot.reset();
    this.loadbot.get("bot").setValue("");
    this.loadbot.get("botType").setValue("");
    this.loadbot.get("botDepartment").setValue("");
    document.getElementById("load-bot").style.display="block";
  }


  loadbotdata()
  {
    this.botlist=[];
    let botType=this.loadbot.get("botType").value
    let botDepartment=this.loadbot.get("botDepartment").value
    if(botType!="" && botDepartment !="")
    {
      let response:any;
      this.spinner.show();
      this.rest.getbotlist(botType,botDepartment).subscribe(data=>{
         response=data
        if(response.errorMessage==undefined){
        this.botlist=data;
        this.spinner.hide();
        }else{
          this.spinner.hide();
        }
      })
    }
  }

  getbotdata()
  {
    let botid=this.loadbot.get("bot").value
    console.log(botid)
    this.getloadbotdata(botid);

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


  getloadbotdata(botid)
  {
    let botdata:any;
    this.spinner.show()
    this.rest.getbotdata(botid).subscribe(data=>{
       botdata=data;
      if(this.tabsArray.find(data=>data.botName==botdata.botName)==undefined)
      {
        this.userFilter.name="";
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

saveRpaCategory(){
  let rpaCategory:any={"categoryName":"","categoryId":0, "createdAt":""};
   rpaCategory["categoryName"] =this.insertbot.value.newCategoryName;
 return this.rest.addCategory(rpaCategory);
}

getCategoryList(){
  this.rest.getCategoriesList().subscribe(data=>{
    let catResponse : any;
    catResponse=data
    this.categaoryList=catResponse.data;
  });
}
}

