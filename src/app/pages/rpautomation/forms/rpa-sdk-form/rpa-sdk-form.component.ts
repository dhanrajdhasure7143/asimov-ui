import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';

@Component({
  selector: 'app-rpa-sdk-form',
  templateUrl: './rpa-sdk-form.component.html',
  styleUrls: ['./rpa-sdk-form.component.css']
})
export class RpaSdkFormComponent implements OnInit {
  @Input() isCreateForm:boolean;
  @Input() hideLabels:boolean;
  @Input() credupdatedata:any=[];
  @Output() refreshTable = new EventEmitter<any>();
  categoryList: any;
  public customTaskForm: FormGroup;
  public Credupdateflag: Boolean;
  public Creddeleteflag: Boolean;
  public passwordtype1: Boolean;
  public passwordtype2: Boolean;
  submitted: boolean;
  languages : any[] = [];
  categories: any[] = [
    { name: 'Path', key: 'A' },
    { name: 'Code', key: 'M' }
  ];
  constructor(private api:RestApiService,
    private formBuilder: FormBuilder,
    private chanref:ChangeDetectorRef,
    private spinner: LoaderService,
    private cryptoService:CryptoService,
    private toastService: ToasterService,
    private toastMessages: toastMessages
    ) {

      this.customTaskForm=this.formBuilder.group({
        //Removed email validator because we can also add organization name
        // userName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        // password: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
        // categoryId:["", Validators.compose([Validators.required])],
        // serverName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        inputRef:[""],
        taskName:[""],
        languageType:[""],
        selectedCategory:[""],
        executablePath:[""],
        codeEditor:[""],
        outputRef:[""]
    })

      this.Credupdateflag=false;
      this.Creddeleteflag=false;
     }

  ngOnInit(): void {
   this.languages = ["Java", "Phyton", "Javascript"];
   this.categories
  }

  inputNumberOnly(event){
    let numArray= ["0","1","2","3","4","5","6","7","8","9","Backspace","Tab"]
    let temp =numArray.includes(event.key); //gives true or false
   if(!temp){
    event.preventDefault();
   }
  }

 
  getCategories() {
    this.api.getCategoriesList().subscribe(data => {
      let response: any = data;
      this.categoryList = response.data;
    })
  }

  radioChange(event : any){
    console.log(event.value,"event")
  }


  resetCredForm(){}

  saveCredentials(){

  }

}
