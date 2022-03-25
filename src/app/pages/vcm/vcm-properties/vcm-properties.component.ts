import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';
import { RestApiService } from '../../services/rest-api.service';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-vcm-properties',
  templateUrl: './vcm-properties.component.html',
  styleUrls: ['./vcm-properties.component.css']
})
export class VcmPropertiesComponent implements OnInit {

  @ViewChild('descriptionValue',{static:false})
  texarea: ElementRef;

  vcmProperties = [];
  attachments: any;
  fileName = [];
  managementOwner: any;
  coreOwner: any;
  supportOwner: any;
  managementDescription: any;
  coreDescription: any;
  supportDescription: any;
  levelType: any;
  descriptionEdit: any;
  descriptionviewonly = true;
  descriptionProcessName: any;
  processOwners_list:any[]=[];
  vcmData:any=[];
  isLoading:boolean=false;
  vcmName:any;
  process_ownerName:any;
  isEdit:boolean=false;
  vcm_id:any;
  fileDescription:any;
  uploadFilemodalref: BsModalRef;
  listOfFiles:any=[];
  filesData=[{fileDescription:""}];
  selectedObj:any;
  attachementsList:any=[];

  constructor(private router: Router, private route: ActivatedRoute, private rest_api:RestApiService, 
    private dt: DataTransferService, private modalService: BsModalService,) {
    this.route.queryParams.subscribe(res => {
      this.levelType = res.level
      if(res.isEdit)
      this.isEdit = res.isEdit
      if(res.id)
      this.vcm_id = res.id
    });
  }

  ngOnInit(): void {
    this.getProcessOwnersList();
    let res_data
    this.dt.getVcm_Data.subscribe(res=>{res_data=res
      if(res){
        this.vcmProperties=res_data.data;
        if(res_data.vName)this.vcmName=res_data.vName;
        if(res_data.pOwner)this.process_ownerName=res_data.pOwner;
      }
    })
    setTimeout(() => {
      let vData = localStorage.getItem("vcmData");
      this.vcmData = JSON.parse((vData));
    }, 2000);
  }


  descriptionView(name, i, level) {
      if (level == 'level1') {
        this.descriptionEdit = i;
        this.descriptionProcessName = name.parent;
        this.descriptionviewonly = false;
        this.texarea.nativeElement.focus();
      }
      else {
        this.descriptionEdit = i;
        this.descriptionProcessName = name.parent;
        this.descriptionviewonly = false;
        this.texarea.nativeElement.focus();
      }
    }

    descriptionSubmit(prop, level) {
      if (level == 'level1') {
        this.vcmProperties.filter((e) => e.name === prop.parent)[0].children
          .filter(n => n.uniqueId === prop.uniqueId)[0].description;
        this.descriptionEdit = '';
        this.descriptionProcessName = '';
        this.descriptionviewonly = true;
      }else {
        this.vcmProperties.filter((e) => e.name === prop.parent)[0].children
          .filter(n => n.uniqueId === prop.level1UniqueId)[0].children.filter(c => c.uniqueId === prop.uniqueId)[0]
          .description;
        this.descriptionEdit = '';
        this.descriptionProcessName = '';
        this.descriptionviewonly = true;
      }
    }
    descriptionCancel(data) {
      this.descriptionEdit = '';
      this.descriptionProcessName = '';
      this.descriptionviewonly = true;
    }

    documentsUpload(event, name ,level) {
      this.isLoading=true;

      this.fileName = [];
      const formdata = new FormData();

      for (var i = 0; i < event.target.files.length; i++) {
        event.target.files[i]['convertedsize'] = this.convertFileSize(event.target.files[i].size);
        event.target.files[i]['fileName'] = event.target.files[i]['name'];
        this.fileName.push();
        formdata.append("file", event.target.files[i]);
      }
      formdata.append("vcmLevel",name.level);
      formdata.append("uniqueId",name.uniqueId);
      formdata.append("masterId","000");
      formdata.append("parent",name.parent);

      if (level == 'level1') {
      formdata.append("vcmuniqueId",this.vcmProperties[0].uniqueId);
      }
      if (level == 'level2') {
        formdata.append("vcmuniqueId",this.vcmProperties[0].uniqueId);
        }
      this.rest_api.uploadVCMPropDocument(formdata).subscribe(res => {
        this.isLoading = false;
        for (var i = 0; i < event.target.files.length; i++) {
          this.fileName.push(event.target.files[i]);
        }

        if (level == 'level1') {
          this.vcmProperties.filter((e) => e.name === name.parent)[0].children
            .filter(n => n.title === name.title)[0].attachments = this.fileName;
        }
        if (level == 'level2') {
          this.vcmProperties.filter((e) => e.name === name.parent)[0].children
            .filter(n => n.uniqueId === name.level1UniqueId)[0].children.filter(c => c.uniqueId === name.uniqueId)[0]
            .attachments = this.fileName;
        }
      },err=>{
        this.isLoading=false;
        Swal.fire({
          title: 'Error',
          text: "File upload failed",
          position: 'center',
          icon: 'error',
          heightAuto: false,
        })

      });
    }
    
  convertFileSize(e) {
    let divided_size: any = String(e / 1024)
    if (e / 1024 <= 1024) {
      if (divided_size.includes('.')) {
        return divided_size.split('.')[0] + ' KB'
      } else {
        return divided_size + ' KB';
      }
    } else {
      let size1: any = String(divided_size / 1024)
      if (size1.includes('.')) {
        return size1.split('.')[0] + ' MB'
      } else {
        return size1 + ' MB';
      }
    }
  }

  RemoveFile(file, i: number, level,e) {
    this.isLoading=true;
    let req_body=[{"documentId":file.uniqueId}]
    this.rest_api.deleteAttachements(req_body).subscribe(res=>{
    this.isLoading=false;
    if (level == 'level1') {
      this.vcmProperties.filter((e) => e.name === file.parent)[0].children
        .filter(n => n.uniqueId === file.uniqueId)[0].attachments.splice(i, 1);
    }else {
      this.vcmProperties.filter((e) => e.name === file.parent)[0].children
        .filter(n => n.uniqueId === file.level1UniqueId)[0].children.filter(c => c.uniqueId === file.uniqueId)[0]
        .attachments.splice(i, 1);
    }
  })
  }


  saveProperties() {
    let obj={vName:this.vcmName,pOwner:this.process_ownerName,data:this.vcmProperties}
    this.dt.vcmDataTransfer(obj)
    this.router.navigate(['/pages/vcm/create-vcm']);

  }

  backToVcm(){

  }

  resetProperties(){
    let vData = localStorage.getItem("vcmData");
    this.vcmProperties = JSON.parse((vData));
    let obj={vName:this.vcmName,pOwner:this.process_ownerName,data:this.vcmData}
    this.dt.vcmDataTransfer(obj);

  }

  async getProcessOwnersList(){
    let roles={"roleNames": ["Process Owner"]}
    await this.rest_api.getmultipleApproverforusers(roles).subscribe( res =>  {
     if(Array.isArray(res))
       this.processOwners_list = res;
   });
  }
  
  onchangeowner(e,i,j){
    this.vcmProperties[j]["children"][i].processOwner=e
  }
  onchangeownerL2(e,i,j,k){
    this.vcmProperties[i]["children"][j]["children"][k].processOwner = e;
  }

  // owner(prop, owner) {
  //   if (prop.name == 'Management Process') {
  //     this.managementOwner = owner;
  //   }
  //   else if (prop.name == 'Core Process') {
  //     this.coreOwner = owner;
  //   }
  //   else if (prop.name == 'Support Process') {
  //     this.supportOwner = owner;
  //   }
  // }

  // documentsUpload(event) {
  //   for (var i = 0; i < event.target.files.length; i++) {
  //     event.target.files[i]['convertedsize'] = this.convertFileSize(event.target.files[i].size);
  //     this.fileName.push(event.target.files[i]);
  //   }
  //   const formdata = new FormData();
  //   for (var i = 0; i < this.fileName.length; i++) {
  //     formdata.append("file", this.fileName[i]);
  //   }
  // }
  // convertFileSize(e) {
  //   let divided_size: any = String(e / 1024)
  //   if (e / 1024 <= 1024) {
  //     if (divided_size.includes('.')) {
  //       return divided_size.split('.')[0] + ' KB'
  //     } else {
  //       return divided_size + ' KB';
  //     }
  //   } else {
  //     let size1: any = String(divided_size / 1024)
  //     if (size1.includes('.')) {
  //       return size1.split('.')[0] + ' MB'
  //     } else {
  //       return size1 + ' MB';
  //     }
  //   }
  // }

  // description(prop,value){
  //   if (prop.name == 'Management Process') {
  //     this.managementDescription = value;
  //   }
  //   else if (prop.name == 'Core Process') {
  //     this.coreDescription = value;
  //   }
  //   else if (prop.name == 'Support Process') {
  //     this.supportDescription = value;
  //   }
  // }
  // RemoveFile(file, i: number) {
  //   this.fileName.splice(i, 1);
  // }

  // saveProperties() {
  //   if (this.managementOwner) {
  //     this.vcmProperties[0].owner = this.managementOwner;
  //   }
  //   if (this.coreOwner) {
  //     this.vcmProperties[1].owner = this.coreOwner;
  //   }
  //   if (this.supportOwner) {
  //     this.vcmProperties[2].owner = this.supportOwner;
  //   }
  //   if (this.managementDescription) {
  //     this.vcmProperties[0].description = this.managementDescription;
  //   }
  //   if (this.coreDescription) {
  //     this.vcmProperties[1].description = this.coreDescription;
  //   }
  //   if (this.supportDescription) {
  //     this.vcmProperties[2].description = this.supportDescription;
  //   }
  //   const formdata = new FormData();
  //   for (var i = 0; i < this.fileName.length; i++) {
  //     formdata.append("file", this.fileName[i]);
  //   }
  //   this.vcmProperties[4].attachments = (this.fileName);
  //   this.router.navigate(['/pages/vcm/view-vcm']);
  // }

  // resetProperties(){
  //   this.managementOwner = "";
  //   this.coreOwner = "";
  //   this.supportOwner = "";
  //   this.managementDescription ="";
  //   this.coreDescription = "";
  //   this.supportDescription = "";
  //   this.fileName = []
  // }
  backToFullEdit(){
    this.router.navigate(["/pages/vcm/edit"], { queryParams: { id: this.vcm_id,"isEdit":"false" } });
  }
  
  updateProperties() {
    let obj={vName:this.vcmName,pOwner:this.process_ownerName,data:this.vcmProperties}
    this.dt.vcmDataTransfer(obj)
    this.router.navigate(["/pages/vcm/edit"], { queryParams: { id: this.vcm_id,"isEdit":"false" } });

  }

  uploadFilemodalCancel(){
    this.uploadFilemodalref.hide();
  }

  chnagefileUploadForm(e){
    this.listOfFiles = [];
    for (var i = 0; i < e.target.files.length; i++) {
      let randomId=  UUID.UUID() 
      e.target.files[i]['convertedsize'] = this.convertFileSize(e.target.files[i].size);
      e.target.files[i]['fileName'] =e.target.files[i]['name'];
      e.target.files[i]['uniqueId'] = randomId;
      e.target.files[i]['fileDescription'] = ''
      this.listOfFiles.push(e.target.files[i])
    } 
  }
  removeSelectedFile(index) {
    this.listOfFiles.splice(index, 1);
   }

   uploadFileModelOpen(template: TemplateRef<any>, obj){
    this.uploadFilemodalref = this.modalService.show(template,{class:"modal-lr"});
    this.listOfFiles=[];
    this.selectedObj= obj;
  }

  onSubmitUpload(){
    this.isLoading= true;
    this.attachementsList=[];
    let idsList=[];
    this.listOfFiles.forEach(e=>{
      idsList.push( e.uniqueId)
      let obj={
        name:e.name,
        fileName: e['name'],
        uniqueId : e.uniqueId,
        convertedsize : e['convertedsize'],
        fileDescription: e['fileDescription'],
        size: e['size'],
        lastModifiedDate: e['lastModifiedDate'],
        lastModified: e['fileDescription'],
      }
      this.attachementsList.push(obj)
    })
    
    let formdata = new FormData()
    for (var i = 0; i < this.listOfFiles.length; i++) {
      formdata.append("file", this.listOfFiles[i]);
    }
    formdata.append("vcmLevel",this.selectedObj.level);
    formdata.append("uniqueId",this.selectedObj.uniqueId);
    formdata.append("masterId","000");
    formdata.append("parent",this.selectedObj.parent);
    formdata.append("processName",this.selectedObj.title);
    formdata.append("vcmuniqueId",this.vcmProperties[0].uniqueId);
    formdata.append("fileUniqueIds",JSON.stringify(idsList));


    this.rest_api.uploadVCMPropDocument(formdata).subscribe(res => {
      this.isLoading = false;
  
      if (this.selectedObj.level == 'L1') {
        this.attachementsList.forEach(element => {
          this.vcmProperties.filter((e) => e.name === this.selectedObj.parent)[0].children
          .filter(n => n.uniqueId === this.selectedObj.uniqueId)[0].attachments.push(element);
        });
        // this.vcmProperties.filter((e) => e.name === this.selectedObj.parent)[0].children
        //   .filter(n => n.uniqueId === this.selectedObj.uniqueId)[0].attachments = this.attachementsList;
      }
  
      if (this.selectedObj.level == 'L2') {
        this.attachementsList.forEach(element => {
          this.vcmProperties.filter((e) => e.name ===this.selectedObj.parent)[0].children
        .filter(n => n.uniqueId === this.selectedObj.level1UniqueId)[0].children
        .filter(c => c.uniqueId === this.selectedObj.uniqueId)[0].attachments.push(element);
        });
        // this.vcmProperties.filter((e) => e.name ===this.selectedObj.parent)[0].children
        // .filter(n => n.uniqueId === this.selectedObj.level1UniqueId)[0].children
        // .filter(c => c.uniqueId === this.selectedObj.uniqueId)[0].attachments = this.attachementsList;
      }
      this.uploadFilemodalCancel();
    },err=>{
      this.isLoading=false;
      Swal.fire({
        title: 'Error',
        text: "File upload failed",
        position: 'center',
        icon: 'error',
        heightAuto: false,
      })

    });
  }
}
