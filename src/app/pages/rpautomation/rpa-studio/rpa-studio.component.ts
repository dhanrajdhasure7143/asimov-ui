import { Component, OnInit, ViewChild, ElementRef, QueryList } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { DataTransferService } from "../../services/data-transfer.service";
import { RestApiService } from '../../services/rest-api.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { RpaStudioDesignerComponent } from '../rpa-studio-designer/rpa-studio-designer.component';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-rpa-studio',
  templateUrl: './rpa-studio.component.html',
  styleUrls: ['./rpa-studio.component.css']
})
export class RpaStudioComponent implements OnInit {
  model: any = {};
  public localstore:boolean = true;
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
  changescreen_rpa_model:Boolean =true;
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
  @ViewChild(RpaStudioDesignerComponent,{static:false}) designerInstance:RpaStudioDesignerComponent;
  constructor(public activatedRoute: ActivatedRoute, 
    private router: Router, 
    private dt:DataTransferService,
    private rest:RestApiService, 
    private formBuilder:FormBuilder,
    public spinner: NgxSpinnerService) 
    {
    this.show = 8;

    this.insertbot=this.formBuilder.group({
      botName: ["", Validators.compose([Validators.required, Validators.maxLength(30)])],
      botDepartment:["", Validators.required],
      botDescription:["", Validators.compose([Validators.maxLength(500)])],
      //botType:["", Validators.required],
      taskId:[""],
      predefinedBot:["false"],
      newCategoryName:[""]
  });
  this.loadbot=this.formBuilder.group({
   //botType:["",Validators.required],
   botDepartment:["",Validators.required],
   bot:["",Validators.required],

  })

  }


  ngOnInit()
  {



    let freeTrial=localStorage.getItem("freetrail")
    var data1:any = [];
    this.dt.changeParentModule({"route":"/pages/rpautomation/home", "title":"RPA"});
    this.dt.changeChildModule("");
    this.spinner.show();
    this.rest.toolSet().subscribe(data => {
      data1 = data
      this.userRole = localStorage.getItem("userRole")
      this.userRole = this.userRole.split(',');
      data1.General.forEach(element => {
        let temp:any = {
          name : element.name,
          path : 'data:' + 'image/png' + ';base64,' + element.icon,
          tasks: element.taskList,
        };
        // if((this.userRole.includes('User') && 
        // (temp.name === 'Email' || temp.name === 'Excel' || temp.name === 'Database' || temp.name === 'Developer')) || 
        // !this.userRole.includes('User')){
          this.templateNodes.push(temp)
        //}
      })
      if(!this.userRole.includes('User'))
      {
        data1.Advanced.forEach(element => {
          let temp:any = {
            name : element.name,
            path : 'data:' + 'image/png' + ';base64,' + element.icon,
            tasks: element.taskList
          };
          this.templateNodes.push(temp)
          // if(localStorage.getItem("tabsArray")!=undefined)
          // {
          //   let tabsData:any=[];
          //   tabsData=JSON.parse(localStorage.getItem("tabsArray"));
          //   tabsData.forEach(data=>{
          //       this.getloadbotdata(data.botId);
          //   })
          //   localStorage.removeItem("tabsArray");
          // }
          //this.spinner.hide();
        });
      }
          if(freeTrial=='true')
            this.templateNodes=this.templateNodes.filter(item=>item.name=="Email");
          this.activatedRoute.queryParams.subscribe(data=>{
            let params:any=data;
            if(params==undefined)
            {
              this.router.navigate(["home"])
            }
            else
            {
              let botId=params.botId;
              if(!(isNaN(botId)))
                this.getloadbotdata(botId)
              else
              {
                let BotData=JSON.parse(Base64.decode(botId));
            
                this.tabsArray.push(BotData)
                setTimeout(()=>{
                  this.designerInstance.bot_instances.forEach(item=>{
              
                      if(item.botState.botName==BotData.botName)
                      {
                        this.designerInstance.current_instance=item.rpa_actions_menu;
                        this.designerInstance.toolset_instance=item;
                        this.designerInstance.selected_tab_instance=item;
                        this.spinner.hide();
                      } 
                      
                   
                  });
                },2500)
              }
            }
          })
      
     

    })
  }





  validate(code,event){
    let validate = code;
    let botname = event.target.value;
    this.count = 0;
    // for(let i=0;i < validate.length; i++){
    //   if(validate.charAt(i) == String.fromCharCode(32)||validate.charAt(i) == String.fromCharCode(46)){
    //     this.count= this.count+1;
    //   }
    // }
    var regex = new RegExp("^[a-zA-Z0-9_-]*$");

   

      if(!(regex.test(botname))){

        this.count=1;

      }
    if(this.count !== 0)
    {
      this.botNamespace = true;
    }
    else{
      this.botNamespace = false;
      this.checkbotname=false;
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
   
    this.model=this.insertbot.getRawValue();
    let createbot={
      "botName":this.model.botName,
      "department":this.model.botDepartment
     }
    if(this.model.botDepartment=="others"){
      let rpaCategory:any={"categoryName":this.insertbot.value.newCategoryName,"categoryId":0, "createdAt":""};
      this.rest.addCategory(rpaCategory).subscribe(data=>{
        let catResponse : any;
        catResponse=data;
        this.model.botDepartment=catResponse.data.categoryId;
        this.tabsArray.push(this.model);
        this.spinner.show();
          this.rest.createBot(createbot).subscribe((res:any)=>{
            this.spinner.hide()     
           },err=>{
            this.spinner.hide();
            Swal.fire("Error","error");
          });
       
      });
    }else{
        
        this.tabsArray.push(this.model);
        localStorage.setItem("isHeader","true");
        this.spinner.show();
        this.rest.createBot(createbot).subscribe((res:any)=>{
          this.spinner.hide()     
         },err=>{
          this.spinner.hide();
          Swal.fire("Error","error");
        });
    }
    this.tabActiveId = this.model.botName;
    this.insertbot.reset();

  }

  onCreate(taskId){
    this.getCategoryList();
    this.insertbot.reset();
    //this.insertbot.get("botType").setValue("");
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
    //this.loadbot.get("botType").setValue("");
    this.loadbot.get("botDepartment").setValue("");
    document.getElementById("load-bot").style.display="block";
  }


  loadbotdata()
  {
    this.botlist=[];
    //let botType=this.loadbot.get("botType").value
    let botDepartment=this.loadbot.get("botDepartment").value
    //if(botType!="" && botDepartment !="")
    if(botDepartment !="")
    {
      let response:any;
      this.spinner.show();
      this.rest.getbotlist('0',botDepartment).subscribe(data=>{
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
    let botid=this.loadbot.get("bot").value;
    this.getloadbotdata(botid);

  }

  predefined(event)
  {

    //console.log(event)
    

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
    var botdata:any;
    this.spinner.show()
    this.rest.getbotdata(botid).subscribe(data=>{
       botdata=data;
      if(this.tabsArray.find(data=>data.botName==botdata.botName)==undefined)
      {
        this.userFilter.name="";
        this.tabsArray.push(botdata);
        this.tabActiveId=botdata.botName;
        setTimeout(()=>{
          this.designerInstance.bot_instances.forEach(item=>{
            if(item.botState.botId==botdata.botId)
            {
              this.designerInstance.current_instance=item.rpa_actions_menu;
              this.designerInstance.toolset_instance=item;
              this.designerInstance.selected_tab_instance=item;
              let url=window.location.hash;
              window.history.pushState("", "", url.split("botId=")[0]+"botId="+botdata.botId);
           }
            // if(item.botId==botdata.botId)
            // {
            //   this.designerInstance.current_instance=item.
            // }
            
            //
          });
        },2500)

        this.spinner.hide();
      }
      else
      {
        
        this.spinner.hide();
        if(localStorage.getItem('bot_id')=="null")
        Swal.fire("Warning","Selected Bot is already loaded","warning");
      }
      this.loadbot.reset();
      this.loadbot.get("bot").setValue("");
      //this.loadbot.get("botType").setValue("");
      this.loadbot.get("botDepartment").setValue("");
      //this.loadbot.reset();
      document.getElementById("load-bot").style.display="none";
      this.localstore = true;
    },(err)=>{
      this.spinner.hide();
      Swal.fire("Error","Unable to load bot","error");
      this.router.navigate(["/home"])
    })
  }


getCategoryList(){
  this.rest.getCategoriesList().subscribe(data=>{
    let catResponse : any;
    catResponse=data
    // this.categaoryList=catResponse.data;
    this.categaoryList=catResponse.data.sort((a, b) => (a.categoryName.toLowerCase() > b.categoryName.toLowerCase()) ? 1 : ((b.categoryName.toLowerCase() > a.categoryName.toLowerCase()) ? -1 : 0)); 
    if(this.categaoryList.length==1){
    this.rpaCategory=this.categaoryList[0].categoryId;
      let Id=this.categaoryList[0].categoryId
     // this.categoryName=this.categaoriesList[0].categoryName;       
        this.insertbot.get('botDepartment').setValue(Id)
       this.insertbot.controls.botDepartment.disable();   
    }
    else{
      this.insertbot.get('botDepartment').setValue('')
      this.insertbot.controls.botDepartment.enable();
    }
  });
}
}

