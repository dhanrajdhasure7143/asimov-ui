import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService, ConfirmEventType } from "primeng/api";
import { RestApiService } from "src/app/pages/services/rest-api.service";
import { LoaderService } from "src/app/services/loader/loader.service";
import * as JSZip from "jszip";
import * as FileSaver from "file-saver";
import { Tree } from 'primeng/tree';
import moment from 'moment';
import { DataTransferService } from "src/app/pages/services/data-transfer.service";
import { asBlob } from "html-docx-js-typescript";
import { saveAs } from "file-saver";
declare const CKEDITOR: any;

@Component({
  selector: "app-projects-document",
  templateUrl: "./projects-document.component.html",
  styleUrls: ["./projects-document.component.css"],
  providers: [MessageService]
})
export class ProjectsDocumentComponent implements OnInit {
  files: any[]=[];
  createFolderPopUP: boolean = false;
  hiddenPopUp1: boolean = false;
  createTreeFolderOverlay: boolean = false;
  isSidebar: boolean = false;
  isDialog: boolean = false;
  subFolderDialog: boolean = false;
  entered_folder_name: string='';
  selectedFile: any;
  text: string;
  folder_name: string='';
  isDialogBox: boolean = false;
  isFolder : boolean = true;
  isSubFolder : boolean = false;
  sampleNode_object = {
    key :"",
    label: "",
    data: "Folder",
    // expandedIcon: "pi pi-folder-open",
    // collapsedIcon: "pi pi-folder",
    icon:"folder.svg",
    dataType:'folder'
  };
  folder_files:any=[];
  selectedFolder: any;
  selectedItem:any;
  // @ViewChild('op', {static: false}) model;
  @ViewChild('cm2', {static: false}) model2;
  @ViewChild('cm', {static: false}) cm;
  term:any;
  params_data:any;
  project_id:any;
  project_name:any;
  nodeMap:Object = {};
  selected_folder_rename:any;
  documents_resData:any[]=[];
  taskList:[]=[];
  selectedOne:any;
  breadcrumbItems:any[]=[];
  istaskFilterApplied:boolean = false;
  items:any[];
  items2:any[];
  @ViewChild('myTree') myTree: Tree;
  createItems:any = [{label: "Folder",command: (e) => {this.onCreateFolder()}}];
  selectedItem_new:any=[];
  selectedFolder_new:any;
  private clickTimeout: any;
  users_list: any = [];
  isEditor: boolean =false;
  public documentData: string;
  public projectName: string;
  public ckeConfig: any;
  public editorRef: any;
  navigarteURL: any;
  paramsData: any;
  enterDocumentName: string='';
  documentCreateDialog:boolean = false;
  selectedAction:any;
  breadcrumbSelectedIndex:any;
  renameDialog : boolean = false;
  dataSearchList:any[];

  columns_list = [
    {ColumnName: "label",DisplayName: "Name",ShowGrid: true,ShowFilter: false},
    {ColumnName: "uploadedDate",DisplayName: "Last Modified",ShowGrid: true,ShowFilter: false},
    {ColumnName: "uploadedBy",DisplayName: "Created By",ShowGrid: true,ShowFilter: false},
    {ColumnName: "convertedTime_new",DisplayName: "File Size",ShowFilter: false, ShowGrid: false},
];

  constructor(
    private rest_api : RestApiService,
    private route : ActivatedRoute,
    private router : Router,
    private loader: LoaderService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dt: DataTransferService,
    ) {

    this.route.queryParams.subscribe((data) => {
      this.params_data = data;
      this.project_id = this.params_data.project_id;
      this.project_name = this.params_data.project_name;
      if(this.params_data.folderView){
        this.isFolder=true;
      }
        if(this.params_data.treeView){
          this.isFolder=false;
        }
      
    });
  }

  ngOnInit(): void {
    this.loader.show();
    this.getUsersList();
    this.clickTimeout = null;
  }

  getTheListOfFolders(){
    let res_data:any=[];
    this.rest_api.getListOfFoldersByProjectId(this.project_id).subscribe((res:any)=>{
        res_data=res
        // this.documents_resData = res
        this.assignData(res_data);
        this.breadcrumbItems=[];
    })
  }

  getUsersList() {
    this.dt.tenantBased_UsersList.subscribe((res) => {
      if (res) {
        this.users_list = res;
        this.getTheListOfFolders();
      }
    });
  }

  assignData(resData){
    this.files = this.convertToTreeView(resData);
    if(localStorage.getItem("openedFoldrerKey")){
      this.folder_files = this.findNodeByKey(localStorage.getItem("openedFoldrerKey"),this.files).children
      this.breadcrumbItems = JSON.parse(localStorage.getItem("breadCrumb"));
      this.selectedFolder = this.findNodeByKey(localStorage.getItem("openedFoldrerKey"),this.files)
    }else{
      this.folder_files = this.files;
    }
    this.selectedAction = null;
    this.breadcrumbSelectedIndex = null;
    this.getTaskList();
    this.dataFormateforSearch(resData);
    this.loader.hide();
  }

  convertToTreeView(res_data){
    this.loader.hide();
    this.dataSearchList =[];
   this.documents_resData = res_data.map(data=> {
      if(data.dataType=='folder'){
        data["children"]=[];
      }
      data["is_selected"]=false;
      data["uploadedDate_new"]=moment(data.uploadedDate).format('lll');
      data.uploadedByUser = this.getUserName(data.uploadedBy)

      if(data.dataType == 'folder'){
        data['icon'] = "folder.svg"
      }else if(data.dataType == 'png' || data.dataType == 'jpg' || data.dataType == 'svg' ||data.dataType == 'PNG' || data.dataType == 'JPG'){
        data['icon'] = "Image-file.svg"
      }else if(data.dataType == 'pdf'){
        data['icon'] = "pdf-file.svg"
      }else if(data.dataType == 'txt'){
        data['icon'] = "txt-file.svg"
      }else if(data.dataType == 'mp4'|| data.dataType == 'gif'){
        data['icon'] = "video-file.svg"
      }else if(data.dataType == 'docx'){
        data['icon'] = "doc-file.svg"
      }else if(data.dataType == 'html'){
        data['icon'] = "html-file.svg"
      }else if(data.dataType == 'csv'||data.dataType == 'xlsx' ){
        data['icon'] = "xlsx-file.svg"
      }else if(data.dataType == 'ppt'){
        data['icon'] = "ppt-file.svg"
      }else{
        data['icon'] = "txt-file.svg"
      }
      return data;
    });

    let files=[];
  for (let obj of res_data) {
    let node = {
      key: obj.key,
      label: obj.label,
      data: obj.data,
      type:"default",
      uploadedByUser:this.getUserName(obj.uploadedBy),
      projectId:obj.projectId,
      id: obj.id,
      dataType:obj.dataType,
      children:obj.children,
      uploadedDate:obj.uploadedDate,
      is_selected:obj.is_selected,
      uploadedDate_new:obj.uploadedDate_new,
      fileSize: obj.fileSize,
      icon : obj.icon
    };

    this.nodeMap[obj.key] = node;
    if (obj.key.indexOf('-') === -1) {
      files.push(node);
    } else {
      let parentKey = obj.key.substring(0, obj.key.lastIndexOf('-'));
      let parent = this.nodeMap[parentKey];
      if (parent) {
        if(parent.children)
        parent.children.push(node);
      }
    }
  }
  files.forEach(item => {
    if (item.dataType === 'folder') {
      // item.size = this.formatBytes(this.calculateFolderSize(item));
      item.size = this.calculateFolderSize(item);
    }else{
      item.size = item.fileSize;
    }
  });
  // return files.sort((a, b) => parseFloat(a.key) - parseFloat(b.key));
  return files;
  }

  calculateFolderSize(folder: any): number {
    let size = 0;
    folder.children.forEach(child => {
      if (child.fileSize) {
        size += child.fileSize;
      }
      if (child.dataType === 'folder') {
        child.size = this.calculateFolderSize(child);
        size += child.size;
      }
    });
    return size;
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) {
      return '0 B';
    }
    const k = 1024;
    const decimals = 2;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedValue = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));
    return `${formattedValue} ${sizes[i]}`;
  }

  dataFormateforSearch(res_data){
    const folders = {};
    let dataList=[];
    res_data.forEach(element => {
      element["children"] = [];
    });
      for (const file of res_data) {
        const key = file.key;
        if (file.dataType === 'folder') {
          if (!folders[key]) {
            folders[key] = file;
            dataList.push(file);
          }
        } else {
          const parentKey = key.substring(0, key.lastIndexOf('-'));
          if (folders[parentKey]) {
            folders[parentKey].children.push(file);
          }
        }
      };
      dataList.forEach(item => {
        if (item.dataType === 'folder') {
          item.size = this.calculateFolderSize(item);
        }else{
          item.size = item.fileSize;
        }
      });
      this.dataSearchList = [...dataList]
  }

  // treeChildFolderSave() {
  //   if (this.selectedFile && this.entered_folder_name) {
  //     let object = { ...{}, ...this.sampleNode_object };
  //     object.label = this.entered_folder_name;
  //     let objectKey = this.selectedFile.parent.children.length ? String(this.selectedFile.parent.children.length):"0";
  //     object.key = this.selectedFile.parent.key + "-" + objectKey;
  //     this.loader.show()
  //     let req_body = [{
  //       key: this.selectedFile.parent.key + "-" + objectKey,
  //       label: this.entered_folder_name,
  //       data: "folder",
  //       ChildId: "1",
  //       dataType: "folder",
  //       fileSize: "",
  //       task_id: "",
  //       projectId: this.project_id
  //     }];
    
  //     this.rest_api.createFolderByProject(req_body).subscribe(res=>{
  //       this.loader.hide();
  //       let res_data:any = res
  //     this.messageService.add({severity:'success', summary: 'Success', detail: 'Folder Created Successfully !'});
  //     let obj = res_data.data[0];
  //     // obj['expandedIcon'] = "pi pi-folder-open"
  //     // obj['collapsedIcon'] = "pi pi-folder";
  //     obj['icon'] = "folder.svg"
  //     obj["children"]= [
  //       {
  //         key: String(obj.key)+"-0" ,
  //         label: "Add Folder / Document",
  //         data: "Folder",
  //         dataType:"folder",
  //         // expandedIcon: "pi pi-folder",
  //         // collapsedIcon: "pi pi-folder",
  //         icon: 'folderadd.svg'
  //       }
  //     ]
  //       this.selectedFile.parent.children.push(obj);
  //       this.entered_folder_name = "";
  //       this.isDialog = false;
  //     },err=>{
  //       this.loader.hide();
  //       this.messageService.add({severity:'error', summary: 'Error', detail: "Folder Creation failed"});
  //     });
  //   }
  // }

  // nodeSelect(item) {
  //   this.selectedItem = item;
  //   if(this.selectedItem.node.label =="Add Folder / Document" || this.selectedItem.node.label =="Add Folder"){
  //     this.createTreeFolderOverlay = true;
  //     if(this.selectedItem.node.label =="Add Folder / Document")
  //     return this.hiddenPopUp1 = true;
  
  //     if(this.selectedItem.node.label =="Add Folder")
  //     return this.hiddenPopUp1 = false;
  //   }else{
  //   }
  // }

  // onCreateTreeFolder(){
  //   this.createTreeFolderOverlay = false;
  //   if (this.selectedItem.node.label == "Add Folder") {
  //     this.isDialogBox = true;
  //   }
  //     if (this.selectedItem.node.label == "Add Folder / Document") {
  //       this.isDialog = true;
  //     }
  // }

  showDialog() {
    this.isDialog = true;
  }

  folderView(){
    this.isFolder = true;
    this.term = '';
    this.folder_files = this.files;
    this.breadcrumbItems = [];
    this.folder_files.forEach(element => {
      element["is_selected"] = false;
    });
    this.selectedItem_new = [];
    const params={project_id:this.project_id,project_name:this.project_name,"folderView":true};
    this.router.navigate([],{ relativeTo:this.route, queryParams:params });
  }

  treeView(){
    this.selectedItem_new = [];
    this.term = '';
    this.isFolder = false;
    this.breadcrumbItems = [];
    this.folder_files = this.files;
    this.folder_files.forEach(element => {
      element["is_selected"] = false;
    });
    const params={project_id:this.project_id,project_name:this.project_name,"treeView":true};
    this.router.navigate([], {
        relativeTo: this.route,
        queryParams: params, 
      })
    this.loader.hide();
  }

  openAddFolderOverlay(item,clickType){
    this.selectedItem = item;
    if(this.selectedItem.label =="Add Folder / Document" || this.selectedItem.label =="Add Folder"){
      this.createFolderPopUP = true;
      if(this.selectedItem.label =="Add Folder / Document")
      return this.hiddenPopUp1 = true;
  
      if(this.selectedItem.label =="Add Folder")
      return this.hiddenPopUp1 = false;
    }else{
      if(clickType== 'dblclick' && this.selectedItem.dataType == 'folder'){
        this.onCreateFolder();
        if(this.selectedItem)this.selectedItem.type='default';
      }
    }
  }

  closeOverlay(event){
    this.createFolderPopUP = event;
    this.createTreeFolderOverlay = event;
  }

  onNodeClick(event){
    this.selected_folder_rename?this.selected_folder_rename.type = 'default':undefined;
    setTimeout(() => {
      this.selected_folder_rename = event.node;
  }, 100);
    // event.preventDefault();
    // this.model.hide();
    if(event.node.label != "Add Folder" && event.node.label != "Add Folder / Document"){
      // setTimeout(() => {
      //   this.model.show(event)
      //   }, 200);
        this.items=[
          {
            label: "Rename",
            command: event => this.onFolderRename("treeView")
          },
          {
            label: "Delete",
            command: event => this.onDeleteItem('treeView')
          },
          {
            label: "Download",
            command: event => this.onDownloadDocument('treeView')
          }
        ]
      if(event.node.dataType !='folder')
      this.items.splice(0,1)

    }else{
      this.items=[];
      this.cm.hide();
    }
  }

  getFileDetails() {
    this.rest_api.getFileDetails(this.project_id).subscribe(data => {
      // this.uploadedFiledata = data.uploadedFiles.reverse();

      // this.requestedFiledata = data.requestedFiles.reverse();

      // let loggedUser = localStorage.getItem("ProfileuserId")
      // let responseArray = this.requestedFiledata
      // this.filterdArray = []
      // responseArray.forEach(e => {
      //   if (e.requestTo == loggedUser || e.requestFrom == loggedUser) {
      //     this.filterdArray.push(e)
        // }
      // })
    })
  }

  backToProjectDetails() {
    this.router.navigate(["/pages/projects/projectdetails"], {
      queryParams: { project_id: this.project_id },
    });
  }

  navigateToCreateDocument(type){
    let url=this.router.url
    let objectKey;
    let folder_key;
    if(type == 'treeView'){
      objectKey = this.selectedFile.parent.children.length ? String(this.selectedFile.parent.children.length):"1";
      folder_key = this.selectedFile.parent.key + "-" + objectKey
    }else{
      objectKey = this.selectedFolder.children.length ? this.selectedFolder.children.length:1;
      folder_key = this.selectedFolder.key + "-" + objectKey

      setTimeout(() => {
        localStorage.setItem("openedFoldrerKey",this.selectedFolder.key)
        localStorage.setItem("breadCrumb",JSON.stringify(this.breadcrumbItems))
      }, 500);
    }
    let req_body = {
      key: folder_key,
      label: this.entered_folder_name,
      data: "folder",
      ChildId: "1",
      dataType: "folder",
      fileSize: "",
      task_id: "",
      projectId: this.project_id,
      url:url,
      projectName:this.project_name
    };
    this.router.navigate(['pages/projects/document-editor'],
    { queryParams: {id: btoa(JSON.stringify(req_body))} })
  }

  singleFileUpload(e){
    this.loader.show()
    let objectKey = this.selectedFile.parent.key
    var fileData = new FormData();
    const selectedFile = e.target.files;
    let fileKeys=[]
    for (let i = 0; i < selectedFile.length; i++) {
      fileData.append("filePath", selectedFile[i]);
      fileKeys.push(String(objectKey+'-'+(i+this.selectedFile.parent.children.length)))
    }
    fileData.append("projectId",this.project_id);
    fileData.append("taskId",'')
    fileData.append("ChildId",'1')

    // let obj=object.key
    fileData.append("fileUniqueIds",JSON.stringify(fileKeys))
    this.rest_api.uploadfilesByProject(fileData).subscribe((res:any)=>{
      this.createTreeFolderOverlay=false;
    // this.getTheListOfFolders();
    let res_data:any= res
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Uploaded successfully!'});
    // let obj = res_data.data[0]
    res_data.data.forEach(item=>{
      let obj = item
      if(obj.dataType == 'png' || obj.dataType == 'jpg' || obj.dataType == 'svg' || obj.dataType == 'gif'){
        // obj['icon']=  "pi pi-image"
        obj['icon']=  "img-file.svg"
      }else{
        // obj["collapsedIcon"]= "pi pi-file"
        obj["icon"]= "document-file.svg"
      }
      this.selectedFile.parent.children.push(obj);
    })

    this.loader.hide();
    // this.selectedFile.parent.children.push(obj)
    },err=>{
      this.loader.hide();
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to upload!'});
    })
  }

  onRightClick(event,node){
    const newEvent = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: event.clientX - 50,
      clientY: event.clientY - 50,
    });
    event.preventDefault();
    if(this.selectedItem)this.selectedItem.type='default';
    this.selectedItem=node;
    // this.model2.hide();
    if(node.label != "Add Folder" && node.label != "Add Folder / Document"){
      this.items2=[
        {
          label: "Rename",
          command: event => this.onFolderRename("folderView")
        },
        {
          label: "Delete",
          command: event => this.onDeleteItem('folderView')
        },
        {
          label: "Download",
          command: event => this.onDownloadDocument('folderView')
        }
      ]
    if(node.dataType !='folder')
    this.items2.splice(0,1)
    this.model2.show(newEvent)
  }
}

  onCancelFolderNameUpdate(type){
    if(type == 'folderView'){
      this.selectedItem_new[0].type ='default';
      this.renameDialog = false;
    }else{
      this.selected_folder_rename.type ='default';
    }
    this.entered_folder_name='';
  }

  onSaveFolderNameUpdate(type){
    let req_body:any;
    if(type == 'folderView'){
      if(this.checkDuplicateFolder(this.entered_folder_name)){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Folder name already exists!" });
        return;
      }
      req_body = this.selectedItem_new[0]
      req_body.label = this.entered_folder_name;
    }else{
      req_body = this.selected_folder_rename
      req_body.label = this.entered_folder_name;
    }
    
    this.rest_api.updateFolderNameByProject(req_body).subscribe(res=>{
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Updated successfully!'});
      this.renameDialog = false;
      if(type == 'folderView'){
        this.selectedItem_new[0].label = this.entered_folder_name;
        this.selectedItem_new[0].type ='default';
      }else{
        this.selectedItem.node.label = this.entered_folder_name;
        this.selectedItem.node.type ='default';
      }
    },err=>{
      this.messageService.add({severity:'error', summary: 'Error', detail: "Failed to update!"});
    })
  }


  onDeleteItem(type){
    let req_body=[];
    if(type =='folderView'){
      this.model2.hide();
      req_body=[this.selectedItem]
    }else{
      req_body=[this.selected_folder_rename]
      delete req_body[0]["parent"]; 
    }
    this.confirmationService.confirm({
      message: "Do you want to delete this? This can't be undone.",
      header: 'Are you sure?',
     
      accept: () => {
        this.rest_api.deleteSelectedFileFolder(req_body).subscribe(res=>{
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Deleted successfully!'});
          this.breadcrumbItems.length > 0 ? this.getTheListOfFolders1(): this.getTheListOfFolders();
        },err=>{
          this.messageService.add({severity:'error', summary: 'Error', detail: "Failed to delete!"});
        })
      },
      reject: (type) => {
      },
      key: "positionDialog"
  });
  }

  folderUpload(event: any,type) {
    // let _selectedFile:any;
    const files = event.target.files;
  // const filesWithModifiedPath = Array.from(files).map((file:any) => {
  //   // Create a new File object with a modified webkitRelativePath property
  //   return new File([file], file.name, { type: file.type, lastModified: file.lastModified });
  // });


    if (files.length > 0) {
      const folderName = files[0].webkitRelativePath.split('/')[0];
      let objectKey
      let folder_key
      if(type=='folderView'){
        if(this.selectedFolder_new){
          let finalKey=  this.getTheFileKey();
          folder_key= this.selectedFolder_new.key + "-" + finalKey;
        }else{
          folder_key= this.files.length+1;
        }
      }else{
        // if(this.selectedFile.parent){
        //   let objectKey = this.selectedFile.parent.children.length ? String(this.selectedFile.parent.children.length):"1";
        //   folder_key = this.selectedFile.parent.key + "-" + objectKey;
        // }else{
        //   folder_key= this.files.length+1;
        // }
      }
      if(this.checkDuplicateFolder(folderName)){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Folder name already exists!" });
        return;
      }
      let req_body = [{
        key: folder_key,
        label: folderName,
        data: "Folder",
        ChildId: "1",
        dataType: "folder",
        fileSize: "",
        task_id: "",
        projectId: this.project_id,
      }];

      this.loader.show();
      this.rest_api.createFolderByProject(req_body).subscribe(res=>{
        const fileData = new FormData();
        let fileKeys = [];
          const filesWithModifiedPath = Array.from(files).map((file:any) => {
            return new File([file], file.name, { type: file.type, lastModified: file.lastModified });
        });
        for (let i = 0; i < filesWithModifiedPath.length; i++) {
            fileData.append("filePath", filesWithModifiedPath[i]);
            fileKeys.push(String(folder_key+'-'+(i+1)))
        }
        fileData.append("projectId",this.project_id);
        fileData.append("taskId",'')
        fileData.append("ChildId",'1')
        fileData.append("fileUniqueIds",JSON.stringify(fileKeys));
      this.rest_api.uploadfilesByProject(fileData).subscribe(res=>{
        this.loader.hide();
        this.breadcrumbItems.length > 0 ? this.getTheListOfFolders1(): this.getTheListOfFolders();
        this.createFolderPopUP=false;
        this.createTreeFolderOverlay =false;
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Folder uploaded successfully!'});
      },err=>{
        this.loader.hide();
        this.messageService.add({severity:'error', summary: 'Error', detail: "Failed to upload!"});
      })
      },err=>{
        this.loader.hide();
        this.messageService.add({severity:'error', summary: 'Error', detail: "Failed to upload!"});
      })
    }
  }

  onDownloadDocument(type){
      let req_body = [];
      let _me = this;
      let folderName:string
      if(type =='folderView'){
        if(this.selectedItem.dataType == 'folder'){
          this.selectedItem.children.forEach(element => {
            if(element.dataType != 'folder'){
              req_body.push(element.id)
            }
          });
        } else {
          req_body.push(this.selectedItem.id)
        }
        this.model2.hide();
        folderName = this.selectedItem.label.split('.')[0]
      }else{
        if(this.selected_folder_rename.dataType == 'folder'){
        this.selected_folder_rename.children.forEach(element => {
          if(element.dataType != 'folder'){
            req_body.push(element.id)
          }
        });
      }else{
        req_body.push(this.selected_folder_rename.id)
      }
      folderName = this.selected_folder_rename.label.split('.')[0]
      }
      if(req_body.length == 0){
        this.messageService.add({severity:'info', summary: 'Info', detail: 'No documents in selected folder!'});
        return
      }
      this.loader.show();
      this.rest_api.dwnloadDocuments(req_body).subscribe((response: any) => {
      this.loader.hide();
        let resp_data = [];
        if(response.code == 4200){
        resp_data = response.data;
        if (resp_data.length > 0) {
          if (resp_data.length == 1) {
            let fileName = resp_data[0].label;
            var link = document.createElement("a");
            // let extension = fileName.toString().split("").reverse().join("").split(".")[0].split("").reverse().join("");
            let extension = resp_data[0].dataType;
            link.download = fileName;
            link.href =extension == "png" || extension == "jpg" || extension == "svg" || extension == "gif"
                ? `data:image/${extension};base64,${resp_data[0].data}`
                : `data:application/${extension};base64,${resp_data[0].data}`;
            link.click();
          } else {
            var zip = new JSZip();
            resp_data.forEach((value, i) => {
              let fileName = resp_data[i].label;
              // let extension = fileName.toString().split("").reverse().join("").split(".")[0].split("").reverse().join("");
              let extension = resp_data[i].dataType;
              if (extension == "jpg" || "PNG" || "svg" || "jpeg" || "png")
                zip.file(fileName, value.data, { base64: true });
              else zip.file(fileName, value.data);
            });
            zip.generateAsync({ type: "blob" }).then(function (content) {
              FileSaver.saveAs(content, folderName + ".zip");
            });
          }
        }
      }
      });
    }

    getTaskList(){
      this.rest_api.gettaskandComments(this.project_id).subscribe((data: any) => {
        this.taskList = data;
        localStorage.removeItem("openedFoldrerKey")
        localStorage.removeItem("breadCrumb")
      })
    }

    onchangesCheckBox(){
    this.breadcrumbItems=[];
      if(this.selectedOne.length>0){
      let filteredData:any=[];
      let filteredData1:any=[];
      this.selectedOne.forEach((element,index) => {
        this.documents_resData.forEach((ele,i) =>{
          // if(index == 0 && ele.dataType =="folder"){
          //   filteredData.push(ele)
          // }
          if(element.id == ele.taskId){
            filteredData.push(ele)
          }
        })

      });
      setTimeout(() => {
        this.files=[];
        filteredData.forEach(element => {
         this.documents_resData.forEach(ele=>{
          let splitKey =ele.key.includes("-")?ele.key.split("-")[0]:ele.key
          if(splitKey == element.key.split("-")[0]){
            filteredData1.push(ele)
          }
         })
          // filteredData1.push(element)
        });
        setTimeout(() => {
          const uniqueIds:any = [];
          const unique = filteredData1.filter(element => {
            const isDuplicate = uniqueIds.includes(element.id);
            if (!isDuplicate) {
              uniqueIds.push(element.id);
              return true;
            }
            return false;
          });
          this.convertToTreeView1(unique);
          this.istaskFilterApplied = true;
        }, 100);
      }, 100);
    }else{
      this.istaskFilterApplied = false;
      this.files=this.convertToTreeView(this.documents_resData);
      this.folder_files = this.files;
    }
    }

    
  convertToTreeView1(res_data){
    this.breadcrumbItems=[];
    this.files=[];
    this.dataSearchList =[];
    res_data.map(data=> {
      data["is_selected"]=false;
      data["uploadedDate_new"]=moment(data.uploadedDate).format('lll')
      data.uploadedByUser = this.getUserName(data.uploadedBy)
      if(data.dataType == 'folder'){
        data['icon'] = "folder.svg"
      }else if(data.dataType == 'png' || data.dataType == 'jpg' || data.dataType == 'svg' || data.dataType == 'gif'||data.dataType == 'PNG' || data.dataType == 'JPG'){
        data['icon'] = "img-file.svg"
      }else if(data.dataType == 'pdf'){
        data['icon'] = "pdf-file.svg"
      }else if(data.dataType == 'txt'){
        data['icon'] = "txt-file.svg"
      }else if(data.dataType == 'mp4'|| data.dataType == 'gif'){
        data['icon'] = "video-file.svg"
      }else if(data.dataType == 'docx'){
        data['icon'] = "doc-file.svg"
      }else if(data.dataType == 'html'){
        data['icon'] = "html-file.svg"
      }else if(data.dataType == 'csv'||data.dataType == 'xlsx' ){
        data['icon'] = "xlsx-file.svg"
      }else if(data.dataType == 'ppt'){
        data['icon'] = "ppt-file.svg"
      }else{
        data['icon'] = "txt-file.svg"
      }
      return data;
    });

    for (let obj of res_data) {
      let node = {
        key: obj.key,
        label: obj.label,
        data: obj.data,
        type:"default",
        uploadedByUser:this.getUserName(obj.uploadedBy),
        projectId:obj.projectId,
        id: obj.id,
        dataType:obj.dataType,
        children:obj.children,
        uploadedDate:obj.uploadedDate,
        is_selected:obj.is_selected,
        uploadedDate_new:obj.uploadedDate_new,
        fileSize: obj.fileSize,
        icon: obj.icon
      };

      if(obj.dataType != 'folder'){
        this.dataSearchList.push(obj);
      }
      this.nodeMap[obj.key] = node;
      if (obj.key.indexOf('-') === -1) {
        this.files.push(node);
      } else {
        let parentKey = obj.key.substring(0, obj.key.lastIndexOf('-'));
        let parent = this.nodeMap[parentKey];
        if (parent) {
          if(parent.children)
          parent.children.push(node);
        }
      }
    }
    this.files.sort((a, b) => parseFloat(a.key) - parseFloat(b.key));
    this.files.forEach(item => {
      if (item.dataType === 'folder') {
        item.size = this.calculateFolderSize(item);
      }else{
        item.size = item.fileSize;
      }
    });
    this.folder_files = this.files;
    this.dataFormateforSearch(res_data);
    this.loader.hide();
  }

  truncateDesc(data){
    if(data && data.length > 21)
      return data.substr(0,20)+'...';
    return data;
  }

  findNodeByKey(key: string, nodes: any[]) {
    let node: any = null;
    for (const n of nodes) {
      if (n.key === key) {
        node = n;
        break;
      } else if (n.children) {
        node = this.findNodeByKey(key, n.children);
        if (node) {
          break;
        }
      }
    }
    return node;
  }

  getTheListOfFolders1(){
    let res_data:any=[];
    this.rest_api.getListOfFoldersByProjectId(this.project_id).subscribe((res:any)=>{
        res_data=res
        this.documents_resData = res
        this.loader.hide()
        this.assignData2(res_data)
    });
  }

  assignData2(res_data){
    this.files = this.convertToTreeView(res_data);
    this.selectedFolder_new = this.findNodeByKey(this.breadcrumbItems[this.breadcrumbItems.length-1].key,this.files)
    this.folder_files = this.setFolderOrder(this.selectedFolder_new.children);
    this.getTaskList();
    this.loader.hide();
  };

  ngOnDestroy(){
    localStorage.removeItem("openedFoldrerKey");
    localStorage.removeItem("breadCrumb");
  }

  getTheFileKey(){
    let selected_folder:any = this.findNodeByKey(this.breadcrumbItems[this.breadcrumbItems.length-1].key,this.files)
    let filteredkey = selected_folder.children.length >0 ? selected_folder.children[selected_folder.children.length-1].key.split("-"):"1"
    return selected_folder.children.length >0?Number(filteredkey[filteredkey.length-1])+1:filteredkey;
  };

  // New changes

  onCreateFolder(){
    this.breadcrumbItems.length > 0 ? this.subFolderDialog = true : this.isDialogBox = true;
  };

  openFolderonDblClick(item){
    if(item.dataType === 'folder'){
    this.selectedItem_new = [];
    this.selectedFolder_new = item;
    this.folder_files = [];
      this.folder_files = this.setFolderOrder(item.children);
    let obj = {label:item.label,key:item.key,id:item.id}
    this.breadcrumbItems.push(obj);
    this.breadcrumbItems = [...this.breadcrumbItems];
    this.createItems = [];
    this.createItems = [
        {label: "Folder",command: () => {this.onCreateFolder()}},
        {label: "Document",command: () => {this.onCreateDocument()}}
      ];
    clearTimeout(this.clickTimeout);
    }
  }

  addParentFolder() {
     let existValue = this.folder_files.filter(e=> e.label.toLowerCase()=== this.folder_name.toLowerCase() && e.dataType == "folder");
     if(existValue.length > 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Folder name already exists!" });
      return;
     }
    let req_body = [{
      key: String(this.folder_files.length>0?Number(this.folder_files[this.folder_files.length - 1].key)+1:1),
      label: this.folder_name,
      data: "Folder",
      ChildId: "1",
      dataType: "folder",
      fileSize: "",
      task_id: "",
      projectId: this.project_id,
    }];
    this.createFolders(req_body);
  };

  addSubfolder() {
    let existValue = this.folder_files.filter(e=> e.label.toLowerCase()=== this.entered_folder_name.toLowerCase() && e.dataType == "folder") 
     if(existValue.length > 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Folder name already exists!" });
      return;
     }
    if (this.entered_folder_name) {
     let finalKey=  this.getTheFileKey();
      let req_body = [{
        key: this.selectedFolder_new.key + "-" +finalKey,
        label: this.entered_folder_name,
        data: "Folder",
        ChildId: "1",
        dataType: "folder",
        fileSize: "",
        task_id: "",
        projectId: this.project_id,
      }];  
      this.createFolders(req_body);
    }
  }

  createFolders(req_body){
    this.loader.show();
    this.rest_api.createFolderByProject(req_body).subscribe(res=>{
      let res_data:any = res;
      this.isDialogBox = false;
      this.selectedFolder_new={};
      this.folder_name='';
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Folder created successfully!'});
      let obj = res_data.data[0];
      obj['icon'] = "folder.svg"
      obj["children"]= []
      this.folder_files.push(obj);
      this.breadcrumbItems.length > 0 ? this.getTheListOfFolders1(): this.getTheListOfFolders();
      this.loader.hide();
      this.entered_folder_name = "";
      this.subFolderDialog = false;
    },err=>{
      this.loader.hide();
      this.messageService.add({severity:'error', summary: 'Error', detail: "Folder creation failed!"});
    })
  }

  deleteSelectedItems(type){
      let req_body=[];
      if(type =='folderView'){
        this.model2.hide();
        req_body=this.selectedItem_new
      }else{
        req_body=[this.selected_folder_rename]
        delete req_body[0]["parent"];
      }
      this.confirmationService.confirm({
        message: "Do you want to delete this? This can't be undone.",
        header: 'Are you sure?',
        accept: () => {
          this.loader.show();
          this.rest_api.deleteSelectedFileFolder(req_body).subscribe(res=>{
            this.messageService.add({severity:'success', summary: 'Success', detail: 'Deleted successfully!'});
            this.loader.hide();
            this.selectedItem_new = [];
            this.breadcrumbItems.length > 0 ? this.getTheListOfFolders1(): this.getTheListOfFolders();
          },err=>{
            this.messageService.add({severity:'error', summary: 'Error', detail: "Failed to delete!"});
            this.loader.hide();
          })
        },
        reject: (type) => {
        },
        key: "positionDialog"
    });
    }

  onChangeSelectFolder(){
    this.selectedItem_new=[];
    this.folder_files.forEach(element => {
      if(element.is_selected)
      this.selectedItem_new.push(element)
    });
  }

  onSelectFolder(event: MouseEvent , index){
    clearTimeout(this.clickTimeout);
    this.clickTimeout = setTimeout(() => {
      if(event.ctrlKey){
    this.folder_files[index].is_selected == true ? this.folder_files[index].is_selected = false : this.folder_files[index].is_selected = true;
    let selectedItems=[]
    this.folder_files.forEach(element => {
      if(element.is_selected)
      selectedItems.push(element);
    });
    this.selectedItem_new = selectedItems;
  }else{
    this.selectedItem_new=[];
    if(this.folder_files[index].is_selected){
      this.folder_files.forEach(element => {
        element.is_selected = false;
      });
    }else{
      this.folder_files.forEach(element => {
        element.is_selected = false;
      });
      this.folder_files[index].is_selected = true;
      this.selectedItem_new.push(this.folder_files[index]);
    }

  }
  }, 200);
  }

  readSelectedData(data){
    console.log(data)
  }

    singleFileUploadFolder(e){
      if(e.target.files.length>0){
      const selectedFile:any[] = e.target.files;
        let isFileExist = 0;
        let nonExistingFiles= [];
        let existingFiles= [];
        for (let i = 0; i < selectedFile.length; i++) {
          if(this.folder_files.find((ele:any) => selectedFile[i].name==ele.label && ele.dataType !='folder')==undefined)
            nonExistingFiles.push(selectedFile[i]);
          else{
            existingFiles.push(selectedFile[i]);
            isFileExist++;
          }
        }

        if(isFileExist == 1){
          this.messageService.add({ severity: 'error', summary: 'Error', detail: existingFiles[0].name +" already exists!"});
        }

        if(isFileExist > 1){
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Some files already exists!"});
        };
       if(nonExistingFiles.length == 0) return;

      let filteredkey = this.getTheFileKey();
      let objectKey = this.selectedFolder_new.key;
      const fileData = new FormData();
      let fileKeys=[];
      for (let i = 0; i < nonExistingFiles.length; i++) {
        fileData.append("filePath", nonExistingFiles[i]);
        let finalKey = Number(filteredkey)+i;
        fileKeys.push(String(objectKey+'-'+ finalKey))
      }
      fileData.append("projectId",this.project_id);
      fileData.append("taskId",'')
      fileData.append("ChildId",'1')
     
      fileData.append("fileUniqueIds",JSON.stringify(fileKeys))
      this.loader.show();
      this.rest_api.uploadfilesByProject(fileData).subscribe(res=>{
        this.createFolderPopUP=false;
        let res_data:any = res;
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Uploaded successfully!'});
      res_data.data.forEach(item=>{
        let obj = item
        if(obj.dataType == 'png' || obj.dataType == 'jpg' || obj.dataType == 'svg' || obj.dataType == 'gif'){
          obj['icon']=  "img-file.svg"
        }else{
          obj["icon"]= "document-file.svg"
        }
      })
      this.breadcrumbItems.length > 0 ? this.getTheListOfFolders1(): this.getTheListOfFolders();
      this.loader.hide();
        this.entered_folder_name = "";
        this.subFolderDialog = false;
      })
    }
    }

    onFolderRename(type){
      this.entered_folder_name="";
      this.renameDialog = true;
      // if(type =='folderView'){
      this.entered_folder_name = this.selectedItem_new[0].label;
      //   this.selectedItem_new[0].type ='textBox'
      // }else{
      //   this.entered_folder_name = this.selected_folder_rename.label
      //   this.selected_folder_rename.type ='textBox'
      // }
    }

  backToSelectedFolder(type){
      this.folder_files=[];
      this.selectedItem_new=[];
      this.term = '';
      if(type == 'main'){
          this.folder_files = this.files;
          this.folder_files.forEach(element => {
            element["is_selected"]=false;
          });
          this.createItems = [{label: "Folder",command: () => {this.onCreateFolder()}},];
          this.breadcrumbItems=[];
          this.createItems = [
            {label: "Folder",command: () => {this.onCreateFolder()}}
          ];
      } else {
        this.createItems = [
          {label: "Folder",command: () => {this.onCreateFolder()}},
          {label: "Document",command: () => {this.onCreateDocument()}}
        ];
        this.breadcrumbItems.splice(-1);
        this.breadcrumbItems = [...this.breadcrumbItems];
        if(this.breadcrumbItems.length >0){
        let filteredData = this.findNodeByKey(this.breadcrumbItems[this.breadcrumbItems.length-1].key,this.files).children;
          this.folder_files = this.setFolderOrder(filteredData);
        } else {
          this.folder_files = this.files;
          this.createItems = [{label: "Folder",command: () => {this.onCreateFolder()}}];
        }
      }
  }
  
  onBreadcrumbItemClick(event: any, index: number) {
    let filteredData= this.findNodeByKey(event.key,this.files).children;
      this.folder_files=[];
      this.folder_files = this.setFolderOrder(filteredData);
      this.breadcrumbItems.splice(index+1);
        this.createItems = [
          {label: "Folder",command: () => {this.onCreateFolder()}},
          {label: "Document",command: () => {this.onCreateDocument()}}
        ];
  }

  setFolderOrder(filteredData:any){
    let folder_files =[];
    this.selectedItem_new=[];
    this.selectedAction = null;
    this.breadcrumbSelectedIndex = null;
    filteredData.forEach(element => {
      element["is_selected"] = false;
      if(element.dataType === 'folder') {
        // element.size=this.formatBytes(element.size)
        folder_files.push(element)
      }
    });
    filteredData.forEach(element => {
      if(element.dataType != 'folder') folder_files.push(element)
    });
    return folder_files
  }

  getUserName(emailId){
    let user = this.users_list.find(item => item.user_email == emailId);
    if(user)
      return user["fullName"]
      else
      return '-';
  }

  async downloadZip() {
    let filesCount = 0;
    let foldersCount=0;
    let req_body=[]
    this.selectedItem_new.forEach(element => {
      if(element.dataType !='folder'){
        filesCount ++;
        req_body.push(element.id);
      }
      if(element.dataType =='folder'){
        foldersCount ++;
      }
    });

    if(filesCount == 1 && foldersCount == 0){
      const fileData = await this.getFileDataById([this.selectedItem_new[0].id]);
      let fileName = this.selectedItem_new[0].label;
      var link = document.createElement("a");
      // let extension = fileName.toString().split("").reverse().join("").split(".")[0].split("").reverse().join("");
      let extension = fileData[0].dataType;
      link.download = fileName;
      link.href =extension == "png" || extension == "jpg" || extension == "svg" || extension == "gif"
          ? `data:image/${extension};base64,${fileData[0].data}`
          : `data:application/${extension};base64,${fileData[0].data}`;
      link.click();
      return
    }
    var _me = this
    if(filesCount > 1 && foldersCount == 0){
      const fileData = await this.getFileDataById(req_body);
      var zip1 = new JSZip();
      fileData.forEach((value, i) => {
        let fileName = fileData[i].label;
        // let extension = fileName.toString().split("").reverse().join("").split(".")[0].split("").reverse().join("");
        let extension = fileData[i].dataType;
        if (extension == "jpg" || "PNG" || "svg" || "jpeg" || "png")
          zip1.file(fileName, value.data, { base64: true });
        else zip1.file(fileName, value.data);
      });
      zip1.generateAsync({ type: "blob" }).then(function (content) {
        FileSaver.saveAs(content,_me.project_name+'_'+_me.selectedFolder_new.label + ".zip");
      });
      return;
    }
    const zip = new JSZip();
    for (const folder of this.selectedItem_new) {
      if(folder.dataType == "folder"){
      const parentFolder = zip.folder(folder.label);
      await this.addFilesToZip(parentFolder, folder);
    }else{
      const fileData = await this.getFileDataById([folder.id]); // Replace with your API call to get file data
      let fileName = folder.label;
      let extension = fileData[0].dataType;
      if (extension == "jpg" || "PNG" || "svg" || "jpeg" || "png")
        zip.file(fileName, fileData[0].data, { base64: true });
      else zip.file(fileName, fileData[0].data);
    }
    }
    const zipContent = await zip.generateAsync({ type: 'blob' });
    let foldername=''
    if(filesCount>0 && foldersCount>0 || filesCount==0 && foldersCount > 1){
      foldername = this.project_name+'_'+new Date().toISOString().substring(0,10)
    }
    if(filesCount == 0 && foldersCount == 1)
    foldername = this.selectedItem_new[0].label
    saveAs(zipContent, foldername+'.zip');

  };

// Function to recursively add files to the zip
async addFilesToZip(zip, folder){
  for (const item of folder.children) {
    if (item.dataType !== 'folder') {
      const fileData = await this.getFileDataById([item.id]); // Replace with your API call to get file data
      let fileName = item.label;
      let extension = fileData[0].dataType;
      if (extension == "jpg" || "PNG" || "svg" || "jpeg" || "png")
        zip.file(fileName, fileData[0].data, { base64: true });
      else zip.file(fileName, fileData[0].data);
      // zip.file(item.label, fileData);
    } else {
      const childFolder = zip.folder(item.label);
      await this.addFilesToZip(childFolder, item);
    }
  }
  // }else{
  //   // const fileData = await this.getFileDataById([folder.id]); // Replace with your API call to get file data
  //   // let fileName = folder.label;
  //   // let extension = fileData[0].dataType;
  //   // if (extension == "jpg" || "PNG" || "svg" || "jpeg" || "png")
  //   //   zip.file(fileName, fileData[0].data, { base64: true });
  //   // else zip.file(fileName, fileData[0].data);
  // }
};

async getFileDataById(fileId) {
  try {
    const response:any = await this.rest_api.dwnloadDocuments(fileId).toPromise();
    const fileData = response.data;
    return fileData;
  } catch (error) {
    console.error('Error fetching file data:', error);
    throw error;
  }
}

    onDownloadSelctedFiles(type){
      let req_body = [];
      let _me = this;
      let folderName:string
      if(type =='folderView'){
        if(this.selectedItem.dataType == 'folder'){
          this.selectedItem.children.forEach(element => {
            if(element.dataType != 'folder'){
              req_body.push(element.id)
            }
          });
        } else {
          req_body.push(this.selectedItem.id)
        }
        this.model2.hide();
        folderName = this.selectedItem.label.split('.')[0]
      }

      if(req_body.length == 0){
        this.messageService.add({severity:'info', summary: 'Info', detail: 'No documents in selected folder!'});
        return
      }
      this.loader.show();
      this.rest_api.dwnloadDocuments(req_body).subscribe((response: any) => {
      this.loader.hide();
        let resp_data = [];
        if(response.code == 4200){
        resp_data = response.data;
        if (resp_data.length > 0) {
          if (resp_data.length == 1) {
            let fileName = resp_data[0].label;
            var link = document.createElement("a");
            // let extension = fileName.toString().split("").reverse().join("").split(".")[0].split("").reverse().join("");
            let extension = resp_data[0].dataType;
            link.download = fileName;
            link.href =extension == "png" || extension == "jpg" || extension == "svg" || extension == "gif"
                ? `data:image/${extension};base64,${resp_data[0].data}`
                : `data:application/${extension};base64,${resp_data[0].data}`;
            link.click();
          } else {
            var zip = new JSZip();
            resp_data.forEach((value, i) => {
              let fileName = resp_data[i].label;
              // let extension = fileName.toString().split("").reverse().join("").split(".")[0].split("").reverse().join("");
              let extension = resp_data[i].dataType;
              if (extension == "jpg" || "PNG" || "svg" || "jpeg" || "png")
                zip.file(fileName, value.data, { base64: true });
              else zip.file(fileName, value.data);
            });
            zip.generateAsync({ type: "blob" }).then(function (content) {
              FileSaver.saveAs(content, folderName + ".zip");
            });
          }
        }
      }
      });
    }

  checkDuplicateFolder(value){
    let isDuplicate = false;
    let existValue = this.folder_files.filter(e=> e.label.toLowerCase()=== value.toLowerCase() && e.dataType == "folder");
    if(existValue.length > 0) isDuplicate = true
    else isDuplicate = false;
     return isDuplicate
    }

    downloadDocument() {
     // this.documentData = this.editorRef.getData();
      this.documentData=CKEDITOR.instances["project-document-editor"].getData()??"";
      asBlob(this.documentData).then((data: any) => {
          saveAs(data, "file.docx"); // save as docx file
      });
    }

    onCreateDocument(){
      this.isEditor = true;
      setTimeout(() => {
        CKEDITOR.replace("project-document-editor",{
          height: 250,
          extraPlugins: 'colorbutton',
          removeButtons: 'PasteFromWord'
        }).catch((error) => {
          console.error("There was a problem initializing the editor.", error);
        });      
      }, 250);

    }

    openDialogTosaveDocument() {
      this.documentCreateDialog = true;
      this.enterDocumentName= "";
      this.selectedAction = null;
      this.breadcrumbSelectedIndex = null;
    }

    uploadCreatedDocument(){
    let existValue = this.folder_files.filter(e=> (e.label.toLowerCase() == (this.enterDocumentName+'.docx').toLowerCase()) && (e.dataType != "folder"));
    if(existValue.length > 0){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "File name already exists!" });
      return;
    };

    let filteredkey = this.getTheFileKey();
    let objectKey = this.selectedFolder_new.key;
   // this.documentData = this.editorRef.getData();
   this.documentData=CKEDITOR.instances["project-document-editor"].getData()??"";
    asBlob(this.documentData).then((data: any) => {
      const formData = new FormData();
      formData.append("filePath", data, this.enterDocumentName+'.docx');
      formData.append("projectId", this.project_id);
      formData.append("taskId", "");
      formData.append("ChildId", "1");
      formData.append("fileUniqueIds", JSON.stringify([objectKey+'-'+ filteredkey+1]));
      this.loader.show();
      this.rest_api.uploadfilesByProject(formData).subscribe((res) => {
        this.loader.hide();
        this.isDialog = false;
        this.isEditor = false;
        this.documentCreateDialog = false;
        this.enterDocumentName= "";

        if(this.selectedAction == 'main' || this.selectedAction == 'subfolders'){
          this.backToSelectedFolder(this.selectedAction);
        }
        if(this.breadcrumbSelectedIndex){
          this.onBreadcrumbItemClick(this.selectedAction,this.breadcrumbSelectedIndex);
        }

        if(!this.selectedAction){
          this.getTheListOfFolders1()
        }
          this.messageService.add({severity:'success', summary: 'Success', detail: 'File uploaded successfully!'});
      },err=>{
        this.loader.hide();
          this.messageService.add({severity:'error', summary: 'Error', detail: "Failed to upload!"});
      });
    });
  }

  documentSaveConfirmation(value,index?:number){
    if(value == 'main'){
      this.createItems = [
        {label: "Folder",command: () => {this.onCreateFolder()}}
      ];
    }else{
      this.createItems = [
        {label: "Folder",command: () => {this.onCreateFolder()}},
        {label: "Document",command: () => {this.onCreateDocument()}}
      ];
    }
    if(this.isEditor){
      this.term = '';
      this.confirmationService.confirm({
        message: "Your changes will be lost if you don't save them.",
        header: 'Do you want to save the changes?',
        accept: () => {
          this.documentCreateDialog = true;
          this.breadcrumbSelectedIndex = index;
          this.selectedAction = value;
          this.enterDocumentName= "";
        },
        reject: (type) => {
          switch(type) {
            case ConfirmEventType.REJECT:
              this.isEditor=false;
              this.documentCreateDialog = false;
              if(value == 'main' || value == 'subfolders'){
                this.backToSelectedFolder(value);
              }
              if(index){
                this.onBreadcrumbItemClick(value,index);
              }
            break;
            case ConfirmEventType.CANCEL:
            break;
        }

        },
        key: "documentDialog"
    });
    } else{

    }
  }

  searchByName(searchTerm: string): void {
    const searchTermLowerCase = searchTerm.toLowerCase();
    let searchResults = this.dataSearchList.filter(item =>
      item.label.toLowerCase().includes(searchTermLowerCase)
    );
    if(searchResults.length > 0){
      searchResults.map(data=> {
        data["is_selected"]=false;
      });
      this.createItems = [
        {label: "Folder",command: () => {this.onCreateFolder()}}
      ];
      //   if(data.dataType=='folder'){
      //     data["children"]=[];
      //   }
      //   data["is_selected"]=false;
      //   data["uploadedDate_new"]=moment(data.uploadedDate).format('lll');
      //   data.uploadedByUser=this.getUserName(data.uploadedBy)
      //   data.type="default"
      //   if(data.dataType == 'folder'){
      //     data['icon'] = "folder.svg"
      //   }else if(data.dataType == 'png' || data.dataType == 'jpg' || data.dataType == 'svg' || data.dataType == 'gif'||data.dataType == 'PNG' || data.dataType == 'JPG'){
      //     data['icon'] = "img-file.svg"
      //   }else{
      //     data['icon'] = "document-file.svg"
      //   }
      //   return data;
      // });
      this.folder_files = searchResults;
    };
    if(searchTerm.length == 0){
        this.folder_files = this.files;
        this.createItems = [
          {label: "Folder",command: () => {this.onCreateFolder()}},
          {label: "Document",command: () => {this.onCreateDocument()}}
        ];
      }
  }
}
