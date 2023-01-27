import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2'
import { DataTransferService } from '../../services/data-transfer.service';
import { RestApiService } from '../../services/rest-api.service';


@Component({
  selector: 'app-user-screen',
  templateUrl: './user-screen.component.html',
  styleUrls: ['./user-screen.component.css'],
})
export class UserScreenComponent implements OnInit {
  tableData: any = [];
  constructor(
    private rest: RestApiService,
    private datatransfer: DataTransferService,
    private route: ActivatedRoute
  ) {}
  screensList: any;
  primaryKey: any;
  updateDetails: any;
  formDetails: any = [];
  loading: boolean = false;

  selectedScreen: any = {};
  displayFlag: string;
  dash_board_list:any[]=[];


  ngOnInit(): void {
    // this.selectedScreen=this.screensList[0];
    this.route.queryParams.subscribe((res: any) => {
      localStorage.setItem('screenId', res.Screen_ID);
      this.getUserScreen_List(res.Screen_ID);
    });
    this.getDashboardScreens();
    //  this.getUserScreenList();
    //   this.displayTable();
  }

  // onClickScreen(screen:any){
  //   this.loading=true;
  //   this.selectedScreen.emit(screen)
  //   localStorage.setItem("screenId",screen.Screen_ID)
  //   this.getFormFields(screen.Screen_ID);
  //   this.getUserScreenData();
  //   this.displayTable();
  // }

  getUserScreen_List(screen_id: any) {
    this.loading = true;
    this.rest.getUserScreenList().subscribe((data: any) => {
      this.screensList = data;
      this.screensList.forEach((element: any) => {
        if (element.Screen_ID == screen_id) {
          this.selectedScreen = element;
          console.log('selected Screen', this.selectedScreen);
          this.getUserScreenData();
        }
      });
      this.getFormFields(screen_id);
      this.displayTable();
    });
  }

  getFormFields(screenId: any) {
    let res_data;
    this.rest.getFormDetails(screenId).subscribe((response: any) => {
      res_data = response;
      this.formDetails = res_data.filter((data: any) => {
        return data.ShowForm == true;
      });
      // this.formDetails=response;
    });
  }

  displayTable() {
    this.displayFlag = DisplayEnum.DISPLAYTABLE;
  }

  createForm() {
    this.updateDetails = undefined;
    this.displayFlag = DisplayEnum.CREATEFORM;
  }

  editForm(data: any) {
    this.updateDetails = data;
    this.displayFlag = DisplayEnum.EDITFORM;
  }

  deleteRecord(data: any) {
    this.loading = true;
    this.rest
      .deleteRecord(
        this.selectedScreen.Table_Name,
        this.primaryKey,
        data[this.primaryKey]
      )
      .subscribe(
        (response: any) => {
          Swal.fire('Success', 'Record deleted successfully', 'success');
          this.getUserScreenData();
          // this.loading = false;
        },
        (err: any) => {
          Swal.fire('Error', 'Unable to delete record', 'error');
        }
      );
  }

  caputreFormValues(values: any) {
    if(this.selectedScreen.Table_Name == "KPI"){
      let selectedDashboardId:any
      console.log(values)
      console.log(this.dash_board_list)
      this.dash_board_list.forEach(e=>{
        if(e.dashbord_name == values.PortalName)
        selectedDashboardId=e.dashbord_id
      })
    let val: any;
    let payload = {objects: [values]};
      if (this.updateDetails == undefined) {
        this.loading = true;
        this.rest.createKPIserscreenData(selectedDashboardId,payload)
          .subscribe((data) => {
            Swal.fire('Success', 'Record saved successfully', 'success');
            this.getUserScreenData();
            this.loading = false;
            this.displayFlag = DisplayEnum.DISPLAYTABLE;
          });
      } else {
        this.loading = true;
        this.rest.updateFormDetails(this.selectedScreen.Table_Name,this.primaryKey,this.updateDetails[this.primaryKey],(val = {objects: [values],}))
          .subscribe((response: any) => {
            Swal.fire('Success', 'Record updated successfully', 'success');
            this.getUserScreenData();
            // this.loading = false;
            this.displayFlag = DisplayEnum.DISPLAYTABLE;
          });
      }
    }else{
    let val: any;
    if (this.updateDetails == undefined) {
      this.loading = true;
      this.rest.postUserscreenData(this.selectedScreen.Table_Name,(val = {objects: [values],}))
        .subscribe((data) => {
          Swal.fire('Success', 'Record saved successfully', 'success');
          this.getUserScreenData();
          // this.loading = false;
          this.displayFlag = DisplayEnum.DISPLAYTABLE;
        });
    } else {
      let payload = {
        objects: [values],
      };
      // values[this.primaryKey]=this.updateDetails[this.primaryKey];
      this.loading = true;
      this.rest.updateFormDetails(this.selectedScreen.Table_Name,this.primaryKey,this.updateDetails[this.primaryKey],(val = {objects: [values],}))
        .subscribe((response: any) => {
          Swal.fire('Success', 'Record updated successfully', 'success');
          this.getUserScreenData();
          // this.loading = false;
          this.displayFlag = DisplayEnum.DISPLAYTABLE;
        });
    }
  }
  }

  getUserScreenData() {
    this.tableData = [];
    this.rest
      .getUserScreenData(
        this.selectedScreen.Table_Name,
        this.selectedScreen.Screen_ID
      )
      .subscribe((data: any) => {
        if (data.length != 0) {
          let keys = Object.keys(data[0]);
          this.primaryKey = keys[0];
        } else {
          this.primaryKey = '';
        }
        let res_data = data;
        this.tableData = res_data;
        this.loading = false;
        this.displayTable();
      });
  }

  getUserScreenList() {
    this.loading = true;
    this.datatransfer.screelistObservable.subscribe((data: any) => {
      this.selectedScreen = data;
      localStorage.setItem('screenId', data.Screen_ID);
      this.getFormFields(data.Screen_ID);
      this.getUserScreenData();
      this.displayTable();
      //  this.loading = false;
    });
  }

  getDashboardScreens(){
    this.rest.getDashBoardScreens().subscribe((data:any)=>{
      this.dash_board_list = data
      console.log("data",this.dash_board_list)
    });
  }
}
enum DisplayEnum{
  DISPLAYTABLE='DisplayTable',
  EDITFORM='EditForm',
  CREATEFORM='CreateForm'
}

