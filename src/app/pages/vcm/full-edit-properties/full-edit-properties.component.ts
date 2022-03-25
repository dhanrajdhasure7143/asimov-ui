import { Component, ElementRef, OnInit, ViewChild,Input, TemplateRef, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';
import { RestApiService } from '../../services/rest-api.service';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-full-edit-properties',
  templateUrl: './full-edit-properties.component.html',
  styleUrls: ['./full-edit-properties.component.css']
})
export class FullEditPropertiesComponent implements OnInit {

  @ViewChild('descriptionValue',{static:false})
  texarea: ElementRef;
 @Input() vcmProcess:any=[];
 @Input() propertiesLevel:any;
 @Input() selectedVcm:any;
 @Output() isUpdateProperties = new EventEmitter<any>()
  vcmProperties = [];
  attachments: any;
  fileName = [];
  managementOwner: any;
  coreOwner: any;
  supportOwner: any;
  managementDescription: any;
  coreDescription: any;
  supportDescription: any;
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
  }


  ngOnInit(): void {
    this.getProcessOwnersList();
  }

  ngOnChanges(){
    this.vcmProperties=this.vcmProcess;
    console.log(this.vcmProperties)
  }

  ngAfterViewInit(){
    this.getAttachementsBycategory()
  }


  descriptionView(name, i, level) {
      if (level == 'level1') {
        this.descriptionEdit = i;
        console.log(name, i);
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
      console.log(prop,this.vcmProperties)
      if (level == 'level1') {
        this.vcmProperties.filter((e) => e.name === prop.parent)[0].children
          .filter(n => n.title === prop.title)[0].description;
        console.log(this.vcmProperties);
        this.descriptionEdit = '';
        this.descriptionProcessName = '';
        this.descriptionviewonly = true;
      }else {
        this.vcmProperties.filter((e) => e.name === prop.parent)[0].children
          .filter(n => n.title === prop.level1UniqueId)[0].children.filter(c => c.uniqueId === prop.uniqueId)[0]
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

  RemoveFile(file, i: number, level) {
    console.log(file, i);
    if (level == 'level1') {
      this.vcmProperties.filter((e) => e.name === file.parent)[0].children
        .filter(n => n.uniqueId === file.uniqueId)[0].attachments.splice(i, 1);
    }else {
      this.vcmProperties.filter((e) => e.name === file.parent)[0].children
        .filter(n => n.uniqueId === file.level1UniqueId)[0].children.filter(c => c.uniqueId === file.uniqueId)[0]
        .attachments.splice(i, 1);
    }
  }

  async getProcessOwnersList(){
    let roles={"roleNames": ["Process Owner"]}
    await this.rest_api.getmultipleApproverforusers(roles).subscribe( res =>  {
     if(Array.isArray(res))
       this.processOwners_list = res;
   });
  }

  backToFullEdit(){
    let obj={
      updateStatus:false
    }
    this.isUpdateProperties.emit(obj);
  }
  
  updateProperties() {
    let obj={
      data:this.vcmProperties,
      updateStatus:true
    }
    this.isUpdateProperties.emit(obj);
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
    console.log(this.listOfFiles,this.attachementsList)
  }
  removeSelectedFile(index) {
    this.listOfFiles.splice(index, 1);
   }

   uploadFileModelOpen(template: TemplateRef<any>, obj){
    this.uploadFilemodalref = this.modalService.show(template,{class:"modal-lr"});
    this.selectedObj= obj;
  }

  onSubmitUpload(){
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
    console.log(this.listOfFiles,this.attachementsList)

    console.log(this.vcmProperties)
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
      this.listOfFiles=[];
      if (this.selectedObj.level == 'L1') {
        this.attachementsList.forEach(element => {
          this.vcmProperties.filter((e) => e.name === this.selectedObj.parent)[0].children
          .filter(n => n.uniqueId === this.selectedObj.uniqueId)[0].attachments.push(element);
        });
      }
  
      if (this.selectedObj.level == 'L2') {
        this.attachementsList.forEach(element => {
          this.vcmProperties.filter((e) => e.name ===this.selectedObj.parent)[0].children
        .filter(n => n.uniqueId === this.selectedObj.level1UniqueId)[0].children
        .filter(c => c.uniqueId === this.selectedObj.uniqueId)[0].attachments.push(element);
        });
      }
      this.listOfFiles = [];
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
    console.log(this.vcmProperties);
  }

  getAttachementsBycategory(){
    console.log(this.propertiesLevel)
    this.isLoading=true;
    let level=this.propertiesLevel=='level1'?"L1":"L2"
     let request={"masterId":this.selectedVcm.data.id,"parent":level}
    let res_data:any;
    this.isLoading=false;
    this.rest_api.getAttachementsBycategory(request).subscribe(res=>{res_data=res
      if(res_data.data)
      this.attachementsList=res_data.data
      console.log(this.attachementsList)
    })
  }
}
