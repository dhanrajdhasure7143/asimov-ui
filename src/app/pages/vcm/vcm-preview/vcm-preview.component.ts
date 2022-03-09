import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTreeNestedDataSource  } from '@angular/material';
import { MatTree } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
// import { SharebpmndiagramService } from './pages/services/sharebpmndiagram.service';
import { SharebpmndiagramService } from './../../../pages/services/sharebpmndiagram.service';
// import { GlobalScript } from '../global-script';
import { UUID } from 'angular2-uuid';
import { BpmnModel } from './../../../pages/business-process/model/bpmn-autosave-model';
import Swal from 'sweetalert2';
import { APP_CONFIG } from 'src/app/app.config';
import { RestApiService } from '../../services/rest-api.service';
import { MatDrawer } from '@angular/material/sidenav';
import { DataTransferService } from '../../services/data-transfer.service';

let TREE_DATA: any[] = [
  {
    name: 'Management Process',
    children:[]
  },
  {
    name: 'Core Process',
    children:[]
  },
  {
    name: 'Support Process',
    children:[]
  },
  {
    vcmname:''
  }
];

@Component({
  selector: 'app-vcm-preview',
  templateUrl: './vcm-preview.component.html',
  styleUrls: ['./vcm-preview.component.css']
})
export class VcmPreviewComponent implements OnInit {
  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();
  vcmTreeData:any;
  user_details:any;
  vcmName:any;
  processName:any;
  processOwner:any;
  processDesc:any;
  attachments:any=[];
  isPropDisabled:boolean=true;
  isViewProperties:boolean=false;
  requestBody:any;
  isLoading:boolean=false;

  @ViewChild('drawer', { static: false }) drawer: MatDrawer;


  constructor(private router: Router,private rest_api : RestApiService, private dt: DataTransferService,
    private route:ActivatedRoute) {

    }

ngOnInit(): void {
    this.treeControl.dataNodes = this.dataSource.data; 
    this.dt.logged_userData.subscribe(res=>{this.user_details=res})  
    let res_data
    this.dt.getVcm_Data.subscribe(res=>{res_data=res
      console.log(res_data)
      if(res){
        if(res_data.data.length>0){
          this.vcmTreeData=res_data.data;

          this.vcmTreeData.forEach(e=>{
            e['title']=e.name
          })
          this.dataSource.data=this.vcmTreeData;
          this.treeControl.dataNodes = this.dataSource.data;
          this.treeControl.expandAll();
          console.log(this.vcmTreeData)
        }
        if(res.requestBody)
        this.requestBody=res.requestBody
      }else{
        this.router.navigate(['/pages/vcm/create-vcm'])
      }
    });
  }



  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

  viewProperties(node){

  }


  openNodeProperties(node){
    this.processName=node.title;
    this.processOwner=node.processOwner;
    this.processDesc=node.description;
    this.drawer.open();
  }

  editVcm(){
    this.router.navigate(['/pages/vcm/create-vcm'])
  }

  closeOverlay(){
    this.drawer.close();
  }

  saveCreatedVcm(){
    console.log("request body",this.requestBody)
    this.isLoading=true;
    this.rest_api.createVcm(this.requestBody).subscribe((res:any)=>{
      this.isLoading=false;

      Swal.fire({
        title: 'Success',
        text: res.message,
        position: 'center',
        icon: 'success',
        showCancelButton: false,
        heightAuto: false,
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.value) {
          this.router.navigate(['/pages/vcm/view-vcm']);
          localStorage.removeItem('vcmData');
        }
      })

    })
  }


}
