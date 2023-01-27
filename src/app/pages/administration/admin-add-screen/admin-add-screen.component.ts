import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { RestApiService } from '../../services/rest-api.service';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';




@Component({
  selector: 'app-admin-add-screen',
  templateUrl: './admin-add-screen.component.html',
  styleUrls: ['./admin-add-screen.component.css']
})
export class AdminAddScreenComponent implements OnInit {
  public insertForm: FormGroup;
  public updateColumnForm: FormGroup;
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  
  dataSource: MatTableDataSource<any>;
  data: any = []
  columnNames: any;
  tabledata: any = [];
  textAlign: any = ["Right", "Left", "Center"]
  loading: boolean = false;
  tablehide:boolean = false;
  screen_id:any;
  isDisabled:boolean = false;
  screenId:any;
  savedata: any =[];
  elementId: any;
  updateColumndata: any=[];
  buttonDisable:boolean=false;
  editbutton:boolean=false;
  displayData: any;
  elementData: any=[];
  showCheckbox:boolean = false
  modalref:BsModalRef;
  labelupdate:boolean = false;


  constructor(private formBuilder: FormBuilder, private router: Router, private rest: RestApiService,
    private modalservice:BsModalService, private route: ActivatedRoute) {
      this.route.queryParams.subscribe((res:any) => {
        this.screen_id = res.id
      
      });
     }


  ngOnInit(): void {
    this.updateColumnForm = this.formBuilder.group({
      ColumnName: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
      DisplayName: ["", Validators.compose([Validators.required])],
      widget_type: ["", Validators.compose([Validators.required])],
      ShowGrid: [false],
      ShowSearch: [false],
      ShowForm: [false],
      read_only: [false],
      mandatory: [false],
      length: ["", Validators.compose([Validators.required])],
      default_type: ["", Validators.compose([Validators.required])],
      data_type: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
      DefaultValue: [""],
      ColumnOrder: ["", Validators.compose([Validators.required])],
      text_align: ["", Validators.compose([Validators.required])],
      width: ["", Validators.compose([Validators.required])],
      tooltip: ["", Validators.compose([Validators.required])],
      placeholder: ["", Validators.compose([Validators.required])],
     
    });
    


    this.insertForm = this.formBuilder.group({
      screen_Name: ["", Validators.compose([Validators.required])],
      table_Name: ["", Validators.compose([Validators.required])],
      allow_Insert: [false],
      allow_Edit: [false],
      allow_Delete: [false],
      show_As_Child: [false],
      default_Sort: [""],
      default_Filter_Clause: [""],
      preferences: [""],
      row_Count: [0],
      insights: [""],
      //  Role: ["", Validators.compose([Validators.required])],
      formType: [""],
      screenType:["", Validators.compose([Validators.required])]

    })

    this.getListofTables();
    if(this.screen_id)
    this.getScreenDetail();
  }



  backToScreenList() {
    this.router.navigate(['./pages/admin/admin-screen-list'])
    
  }
  
delete() {

  }

  edit(content: TemplateRef<any>,row:any) {
    this.elementId= row.ElementId
    this.screenId = row.ScreenId
    this.modalref = this.modalservice.show(content);
    this.updateColumnForm.controls['ColumnName'].setValue(row['ColumnName']);
    this.updateColumnForm.controls['DisplayName'].setValue(row['DisplayName']);
    this.updateColumnForm.controls['widget_type'].setValue(row['widget_type']);
    this.updateColumnForm.controls['ShowGrid'].setValue(row['ShowGrid']=="t" ?true : false);
    this.updateColumnForm.controls['ShowSearch'].setValue(row['ShowSearch']=="t" ?true : false);
    this.updateColumnForm.controls['ShowForm'].setValue(row['ShowForm']=="t" ?true : false);
    this.updateColumnForm.controls['read_only'].setValue(row['read_only']=="t" ?true : false);
    this.updateColumnForm.controls['mandatory'].setValue(row['mandatory']=="t" ?true : false);
    this.updateColumnForm.controls['length'].setValue(row['length']);
    this.updateColumnForm.controls['default_type'].setValue(row['default_type']);
    this.updateColumnForm.controls['DefaultValue'].setValue(row['DefaultValue']);
    this.updateColumnForm.controls['ColumnOrder'].setValue(row['ColumnOrder']);
    this.updateColumnForm.controls['text_align'].setValue(row['text_align']);
    this.updateColumnForm.controls['width'].setValue(row['width']);
    this.updateColumnForm.controls['tooltip'].setValue(row['width']);
    this.updateColumnForm.controls['placeholder'].setValue(row['placeholder']);
    this.updateColumnForm.controls['data_type'].setValue(row['data_type']);
  }

  updateColumn() {
    this.modalref.hide();
    let payload = this.updateColumnForm.value
    let val = {
      "objects": [ payload ]
    }
    this.loading = true;
    this.rest.updateColumn(this.elementId,this.screenId,val).subscribe(data => {
      this.updateColumndata=data
      this.dataSource = new MatTableDataSource(this.updateColumndata);
      Swal.fire("Success", "Screen Updated Successfully!", "success")
      this.loading = false;
    })
      
  }

 
  getListofTables() {
    this.loading = true;
    this.rest.getListOfTables().subscribe(data => {
    this.tabledata = data;
    this.loading = false;
    })
  }

  onChangeTableName(tablename:any) {
    this.loading= true;
    this.tablehide = true;
    this.rest.getTabledataAdmin(tablename.value).subscribe(data => {
      this.data = data;
      this.data = this.data.map((item: any) => {
        item["actions"] = "actions";
        return item;
      })
      this.columnNames = Object.keys(this.data[0]);  
      this.dataSource = new MatTableDataSource(this.data);
      this.editbutton = true;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator
      }, 500);
      this.loading = false;
    })

  }

  getScreenDetail(){
    this.labelupdate = true;
    let screenList:any
    this.rest.getScreenList().subscribe(data=>{
      screenList = data
      this.isDisabled=true;
      let filterData = screenList.find((data:any) => data.Screen_ID == this.screen_id);
      this.insertForm = this.formBuilder.group({
        screen_Name: [filterData.Screen_Name, Validators.compose([Validators.required])],
        table_Name: [filterData.Table_Name],
        allow_Insert: [filterData.Allow_Insert],
        allow_Edit: [filterData.Allow_Edit],
        allow_Delete: [filterData.Allow_Delete],
        show_As_Child: [filterData.Show_As_Child],
        default_Sort: [""],
        default_Filter_Clause: [""],
        preferences: [""],
        row_Count: [filterData.Row_Count],
        insights: [""],
        //  Role: ["", Validators.compose([Validators.required])],
        formType: [""],
        screenType:[filterData.ScreenType]

  
      })
        this.tablehide = true;
      this.rest.getElementTable(this.screen_id).subscribe(data => {
        this.elementData = data;
        this.columnNames = [
          "ColumnName", "DisplayName", "data_type", "actions"
        ]
        this.dataSource = new MatTableDataSource(this.elementData);
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      })
        
        // this.rest.getTabledataAdmin(filterData.Table_Name).subscribe(data => {
        //   this.data = data;
        //   this.data = this.data.map((item: any) => {
        //     item["actions"] = "actions";
        //     return item;
        //   })
        //   this.columnNames = Object.keys(this.data[0]);
        //   this.dataSource = new MatTableDataSource(this.data);
        //   setTimeout(() => {
        //     this.dataSource.paginator = this.paginator
        //   }, 500);
        //   this.loading = false;
        // })
    
    })
  }

  updateData() {
    let payload= this.insertForm.value
    payload["status"]=false;
    payload["fields"]="";
    this.loading = true;
    this.rest.updateScreenData(payload,this.screen_id).subscribe(data => {
      Swal.fire("Success", "Screen Updated Successfully", "success")
      this.backToScreenList();
      this.loading=false;
    }),(err:any)=>{
      Swal.fire("Error", "Unable to Update Screen Details", "error")
    }
  }

  save() {
    this.loading = true;
    let payload= this.insertForm.value
    payload["status"]=false;
    payload["fields"]="";
    this.rest.saveScreenData(payload).subscribe(data => {
      this.savedata = data;
      this.savedata = this.savedata.map((item: any) => {
        item["actions"] = "actions";
        return item;
      })
      this.columnNames = [
        "ColumnName","DisplayName","data_type","actions"
      ]
      this.dataSource = new MatTableDataSource(this.savedata);
      Swal.fire("Success", "Screen Saved successfully !", "success")
      this.loading = false;
      this.buttonDisable=true;
     this.editbutton = false;
    }),(err: any) => {
      Swal.fire("Error", "Unable to Save!", "error")
    }
  }

//   getElementTable(){
//   this.rest.getElementTable(this.screen_id).subscribe(data => {
//     this.elementData= data;
//     this.columnNames = [
//       "ColumnName","DisplayName","data_type","actions"
//     ]
//     this.dataSource = new MatTableDataSource(this.elementData);
//     setTimeout(() => {
//       this.dataSource.paginator = this.paginator
//     }, 3000);
//     this.loading = false;
// })
// }
}









