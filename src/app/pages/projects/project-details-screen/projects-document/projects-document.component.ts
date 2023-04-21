import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService, TreeNode } from "primeng/api";
import { RestApiService } from "src/app/pages/services/rest-api.service";
import { LoaderService } from "src/app/services/loader/loader.service";
import { Location} from '@angular/common'
import * as JSZip from "jszip";
import * as FileSaver from "file-saver";

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
  isDialog1: boolean = false;
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
    expandedIcon: "pi pi-folder-open",
    collapsedIcon: "pi pi-folder",
    dataType:'folder'
  };
  folder_files:any=[];
  selectedFolder: any;
  selectedItem:any;
  // @ViewChild('op', {static: false}) model;
  @ViewChild('op2', {static: false}) model2;
  @ViewChild('cm', {static: false}) cm;
  term:any;
  params_data:any;
  project_id:any;
  project_name:any;
  nodeMap:Object = {};
  opened_folders:any[]=[];
  selected_folder_rename:any;
  documents_resData:any[]=[];
  taskList:[]=[];
  selectedOne:any;
  breadcrumbItems:any[]=[];
  istaskFilterApplied:boolean = false;
  items:any[];

  constructor(private rest_api : RestApiService,
    private route : ActivatedRoute,
    private router : Router,
    private loader: LoaderService,
    private messageService: MessageService,
    private location:Location,
    private confirmationService: ConfirmationService) {

    this.route.queryParams.subscribe((data) => {
      this.params_data = data;
      this.project_id = this.params_data.project_id;
      this.project_name = this.params_data.project_name;
      if(this.params_data.folderView){
        this.isFolder=true;
      }
        if(this.params_data.treeView){
          this.isFolder=false
        }
      
    });
  }

  ngOnInit(): void {
    this.loader.show();
    this.getTheListOfFolders();
  }

  getTheListOfFolders(){
    let res_data:any=[];
    this.rest_api.getListOfFoldersByProjectId(this.project_id).subscribe((res:any)=>{
        res_data=res
        this.documents_resData = res
        this.loader.hide()
        this.files=[
          {
            key: "0",
            label: "Add Folder",
            data: "Add Folder",
            data_type:"addfolder",
            collapsedIcon: 'pi pi-folder',
            expandedIcon: 'pi pi-folder'
          },
        ];
        this.convertToTreeView(res_data)
    })
  }

  convertToTreeView(res_data){
    this.breadcrumbItems=[];
    res_data.map(data=> {
      if(data.dataType=='folder'){
        data["children"]=[{
          key: data.key+'-0',
          label: "Add Folder / Document",
          dataType:"folder",
          collapsedIcon: 'pi pi-folder',
          expandedIcon: 'pi pi-folder'
        }]
      }
      return data
    })

  for (let obj of res_data) {
    let node = {
      key: obj.key,
      label: obj.label,
      data: obj.data,
      type:"default",
      uploadedBy:obj.uploadedBy,
      projectId:obj.projectId,
      id: obj.id,
      dataType:obj.dataType,
      children:obj.children,
      uploadedDate:obj.uploadedDate
    };
      if(obj.dataType == 'folder'){
        node['collapsedIcon']=  "pi pi-folder"
        node["expandedIcon"]  ="pi pi-folder-open"
      }else if(obj.dataType == 'png' || obj.dataType == 'jpg' || obj.dataType == 'svg' || obj.dataType == 'gif'){
        node['icon']=  "pi pi-image"
    }else{
      node['icon']=  "pi pi-file"
    }
    this.nodeMap[obj.key] = node;
    if (obj.key.indexOf('-') === -1) {
      // node['children']=[
      // {
      //   key: obj.key+'-0',
      //   label: "Add Folder / Document",
      //   dataType:"folder",
      //   collapsedIcon: 'pi pi-folder',
      //   expandedIcon: 'pi pi-folder'
      // }]
      this.files.push(node);
    } else {
      let parentKey = obj.key.substring(0, obj.key.lastIndexOf('-'));
      let parent = this.nodeMap[parentKey];
      if (parent) {
        if (!parent.children) {
          // let obj1={
          //   key: obj.key+'-0',
          //   label: "Add Folder / Document",
          //   dataType:"folder",
          //   collapsedIcon: 'pi pi-folder',
          //   expandedIcon: 'pi pi-folder'
          // }
          // parent.children = [obj1];
        }else{
          // let obj1={
            
          //   key: obj.key+'-0',
          //   label: "Add Folder / Document",
          //   dataType:"folder",
          //   collapsedIcon: 'pi pi-folder',
          //   expandedIcon: 'pi pi-folder'
          // }
          // parent.children = [obj1];
        }
        if(parent.children)
        parent.children.push(node);
      }
    }
  }
  this.files.sort((a, b) => parseFloat(a.key) - parseFloat(b.key));
  this.folder_files = this.files;
  this.getTaskList();
  this.loader.hide();
  }

  getDataByParentId1(data, parent) {
    const result = data.filter(d => d.parentId === parent);
    if (!result && !result.length) {
      return null;
    }
  
    return result.map(({ dataId, name, description,parentId }) => 
      ({ dataId, name, description,parentId, children: this.getDataByParentId(data, dataId) }))
  }

  getDataByParentId(data, parent) {
    const result = data.filter(d => d.parentId === parent);
    if (!result && !result.length) {
      return null;
    }
  
    return result.map(({ dataId, name, description,parentId }) => 
      ({ dataId, name, description,parentId, children: this.getDataByParentId(data, dataId) }))
  }
  

  treeChildFolderSave() {
    if (this.selectedFile && this.entered_folder_name) {
      let object = { ...{}, ...this.sampleNode_object };
      object.label = this.entered_folder_name;
      let objectKey = this.selectedFile.parent.children.length ? String(this.selectedFile.parent.children.length):"0";
      object.key = this.selectedFile.parent.key + "-" + objectKey;
      this.loader.show()
      let req_body = [{
        key: this.selectedFile.parent.key + "-" + objectKey,
        label: this.entered_folder_name,
        data: "folder",
        ChildId: "1",
        dataType: "folder",
        fileSize: "",
        task_id: "",
        projectId: this.project_id
      }];
    
      this.rest_api.createFolderByProject(req_body).subscribe(res=>{
        this.loader.hide();
        let res_data:any = res
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Folder Created Successfully !!'});
      let obj = res_data.data[0];
      obj['expandedIcon'] = "pi pi-folder-open"
      obj['collapsedIcon'] = "pi pi-folder";
      obj["children"]= [
        {
          key: String(obj.key)+"-0" ,
          label: "Add Folder / Document",
          data: "Folder",
          dataType:"folder",
          expandedIcon: "pi pi-folder",
          collapsedIcon: "pi pi-folder",
        }
      ]
        this.selectedFile.parent.children.push(obj);
        this.entered_folder_name = "";
        this.isDialog = false;
      },err=>{
        this.loader.hide();
        this.messageService.add({severity:'error', summary: 'Error', detail: "Folder Creation failed"});
      });
    }
  }

  nodeSelect(item) {
    this.selectedItem = item;
    if(this.selectedItem.node.label =="Add Folder / Document" || this.selectedItem.node.label =="Add Folder"){
      this.createTreeFolderOverlay = true;
      if(this.selectedItem.node.label =="Add Folder / Document")
      return this.hiddenPopUp1 = true;
  
      if(this.selectedItem.node.label =="Add Folder")
      return this.hiddenPopUp1 = false;
    }else{
    }
  }

  onCreateTreeFolder(){
    this.createTreeFolderOverlay = false;
    if (this.selectedItem.node.label == "Add Folder") {
      this.isDialogBox = true;
    }
      if (this.selectedItem.node.label == "Add Folder / Document") {
        this.isDialog = true;
      }
  }

  showDialog() {
    this.isDialog = true;
  }

  folderView(){
    this.isFolder = true;
    const params={project_id:this.project_id,project_name:this.project_name,"folderView":true};
    this.router.navigate([],{ relativeTo:this.route, queryParams:params });
  }

  treeView(){
    this.isFolder = false;
    this.folder_files = this.files;
    this.opened_folders=[];
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

  onCreateFolder(){
    this.createFolderPopUP = false;
    if(this.selectedItem.label =="Add Folder / Document")
    return this.isDialog1 = true;

    if(this.selectedItem.label =="Add Folder")
    return this.isDialogBox = true;
    this.selectedFolder = this.selectedItem
    this.opened_folders.push(this.folder_files)
    this.folder_files = this.selectedItem.children
    let obj = {label:this.selectedItem.label}
    this.breadcrumbItems.push(obj)
    this.breadcrumbItems = [...this.breadcrumbItems];

  }

  addSubfolder() {
  if (this.selectedFolder && this.entered_folder_name) {
    let object = { ...{}, ...this.sampleNode_object };
    object.label = this.entered_folder_name;
    let objectKey = this.selectedFolder.children.length ? String(this.selectedFolder.children.length):"0";
    object.key = this.selectedFolder.key + "-" + objectKey;
    this.loader.show();
    let req_body = [{
      key: this.selectedFolder.key + "-" + objectKey,
      label: this.entered_folder_name,
      data: "Folder",
      ChildId: "1",
      dataType: "folder",
      fileSize: "",
      task_id: "",
      projectId: this.project_id,
    }];
  
    this.rest_api.createFolderByProject(req_body).subscribe(res=>{
      this.loader.hide();
      let res_data:any = res
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Folder Created Successfully !!'});
      let obj = res_data.data[0];
      obj['expandedIcon'] = "pi pi-folder-open"
      obj['collapsedIcon'] = "pi pi-folder";
      obj["children"]= [
        {
          key: String(obj.key)+"-0" ,
          label: "Add Folder / Document",
          data: "Folder",
          dataType:"folder",
          expandedIcon: "pi pi-folder",
          collapsedIcon: "pi pi-folder",
        }
      ]

      this.selectedFolder.children.push(obj);
      this.entered_folder_name = "";
      this.isDialog1 = false;
    },err=>{
      this.loader.hide();
      this.messageService.add({severity:'error', summary: 'Error', detail: "Folder Creation failed"});
    })

  }
}

addParentFolder() {
  this.loader.show();
  let req_body = [{
    key: String(this.files.length),
    label: this.folder_name,
    data: "Folder",
    ChildId: "1",
    dataType: "folder",
    fileSize: "",
    task_id: "",
    projectId: this.project_id,
  }];

  this.rest_api.createFolderByProject(req_body).subscribe(res=>{
    this.loader.hide();
    let res_data:any = res;
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Folder Created Successfully !!'});
    let obj = res_data.data[0];
    obj['expandedIcon'] = "pi pi-folder-open"
    obj['collapsedIcon'] = "pi pi-folder";
    obj["children"]= [
      {
        key: String(obj.key)+"-0" ,
        label: "Add Folder / Document",
        data: "Folder",
        dataType:"folder",
        expandedIcon: "pi pi-folder",
        collapsedIcon: "pi pi-folder",
      }
    ]
    this.files.push(obj);
    this.folder_name = "";
    this.isDialogBox = false;
  },err=>{
    this.loader.hide();
    this.messageService.add({severity:'error', summary: 'Error', detail: "Folder Creation failed"});
  })

}

  // removeRoute(node) {
  //   const parent: any = this.findById(this.files, node.parentId);
  //   const index = parent.children.findIndex((c) => c.id === node.id);
  //   parent.children.splice(index, 1);
  // }
  // public selected: any;

  // findById(data, id) {
  //   for (const node of data) {
  //     if (node.id === id) {
  //       return node;
  //     }

  //     if (node.children) {
  //       const desiredNode = this.findById(node.children, id);
  //       if (desiredNode) {
  //         return desiredNode;
  //       }
  //     }
  //   }
  //   return false;
  // }

  closeOverlay(event){
    this.createFolderPopUP = event;
    this.createTreeFolderOverlay = event;
  }

  nodeUnselect(){
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

  onFolderRename(type){
    this.entered_folder_name="";
    if(type =='folderView'){
      this.entered_folder_name = this.selectedItem.label
      this.selectedItem.type ='textBox'
      this.model2.hide();
    }else{
      this.entered_folder_name = this.selected_folder_rename.label
      this.selected_folder_rename.type ='textBox'
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
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Uploaded Successfully !!'});
    // let obj = res_data.data[0]
    res_data.data.forEach(item=>{
      let obj = item
      if(obj.dataType == 'png' || obj.dataType == 'jpg' || obj.dataType == 'svg' || obj.dataType == 'gif'){
        obj['icon']=  "pi pi-image"
      }else{
        obj["collapsedIcon"]= "pi pi-file"
      }
      this.selectedFile.parent.children.push(obj);
    })

    this.loader.hide();
    // this.selectedFile.parent.children.push(obj)
    },err=>{
      this.loader.hide();
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to Upload !!'});
    })
  }

  onRightClick(event,node){
    event.preventDefault();
    if(this.selectedItem)this.selectedItem.type='default';
    this.selectedItem=node;
    this.model2.hide();
    if(node.label != "Add Folder" && node.label != "Add Folder / Document"){
      setTimeout(() => {
        this.model2.show(event)
        }, 200);
  }
}

  onCancelFolderNameUpdate(type){
    if(type == 'folderView'){
      this.selectedItem.type ='default';
    }else{
      this.selected_folder_rename.type ='default';
    }
    this.entered_folder_name='';
  }

  onSaveFolderNameUpdate(type){
    let req_body:any;
    if(type == 'folderView'){
      req_body = this.selectedItem
      // this.selectedItem.label = this.entered_folder_name;
      req_body.label = this.entered_folder_name;
    }else{
      req_body = this.selected_folder_rename
      // this.selectedItem.node.label = this.entered_folder_name;
      req_body.label = this.entered_folder_name;
      // this.selectedItem.node.type ='default';
    }
    
    this.rest_api.updateFolderNameByProject(req_body).subscribe(res=>{
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Updated Successfully !!'});
      if(type == 'folderView'){
        this.selectedItem.label = this.entered_folder_name;
        this.selectedItem.type ='default';
      }else{
        this.selectedItem.node.label = this.entered_folder_name;
        this.selectedItem.node.type ='default';
      }
    },err=>{
      this.messageService.add({severity:'error', summary: 'Error', detail: "Failed to update !"});
    })
  }

  backToSelectedFolder(){
    this.folder_files = this.opened_folders[this.opened_folders.length-1];
    this.opened_folders.pop();
    this.breadcrumbItems.splice(-1)
    this.breadcrumbItems = [...this.breadcrumbItems];
  }

  singleFileUploadFolder(e){
    let object = { ...{}, ...this.sampleNode_object };
    object.label = this.entered_folder_name;
    // let objectKey = this.selectedFolder.children.length ? String(this.selectedFolder.children.length):"0";
    // object.key = this.selectedFolder.key + "-" + objectKey;
    let objectKey = this.selectedFolder.key
    // return
    this.loader.show();
    const fileData = new FormData();
    const selectedFile = e.target.files;

    let fileKeys=[]
    for (let i = 0; i < selectedFile.length; i++) {
      fileData.append("filePath", selectedFile[i]);
      fileKeys.push(String(objectKey+'-'+(i+1)))
  }
    // fileData.append("filePath", e.target.files[0]);
    fileData.append("projectId",this.project_id);
    fileData.append("taskId",'')
    fileData.append("ChildId",'1')
    let obj=object.key
   
    fileData.append("fileUniqueIds",JSON.stringify(fileKeys))

    this.rest_api.uploadfilesByProject(fileData).subscribe(res=>{
      this.loader.hide();
      this.createFolderPopUP=false;
      let res_data:any = res
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Uploaded Successfully !!'});
    // let obj = res_data.data[0];
    res_data.data.forEach(item=>{
      let obj = item
      if(obj.dataType == 'png' || obj.dataType == 'jpg' || obj.dataType == 'svg' || obj.dataType == 'gif'){
        obj['icon']=  "pi pi-image"
      }else{
        obj["collapsedIcon"]= "pi pi-file"
      }
      this.selectedFolder.children.push(obj);
    })
      this.entered_folder_name = "";
      this.isDialog1 = false;
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
      message: "Are you sure that you want to proceed?",
      header: 'Confirmation',
     
      accept: () => {
        this.rest_api.deleteSelectedFileFolder(req_body).subscribe(res=>{
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Deleted Successfully !!'});
          this.getTheListOfFolders();
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
        if(this.selectedFolder){
          objectKey = this.selectedFolder.children.length ? this.selectedFolder.children.length:1;
          folder_key= this.selectedFolder.key + "-" + String(objectKey)
        }else{
          folder_key= this.files.length+1;
        }
      }else{
        if(this.selectedFile.parent){
          let objectKey = this.selectedFile.parent.children.length ? String(this.selectedFile.parent.children.length):"1";
          folder_key = this.selectedFile.parent.key + "-" + objectKey;
        }else{
          folder_key= this.files.length+1;
        }
        
      }

      this.loader.show();
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
      this.rest_api.createFolderByProject(req_body).subscribe(res=>{
        const fileData = new FormData();
        let fileKeys = [];
          const filesWithModifiedPath = Array.from(files).map((file:any) => {
    // Create a new File object with a modified webkitRelativePath property
            return new File([file], file.name, { type: file.type, lastModified: file.lastModified });
        });
        for (let i = 0; i < filesWithModifiedPath.length; i++) {
            fileData.append("filePath", filesWithModifiedPath[i]);
            fileKeys.push(String(folder_key+'-'+(i+1)))
        }
        
        fileData.append("projectId",this.project_id);
        fileData.append("taskId",'')
        fileData.append("ChildId",'1')
        fileData.append("fileUniqueIds",JSON.stringify(fileKeys))
      this.rest_api.uploadfilesByProject(fileData).subscribe(res=>{
        this.loader.hide();
        this.getTheListOfFolders();
        this.createFolderPopUP=false;
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Folder Uploaded Successfully !!'});
      },err=>{
        this.loader.hide();
        this.messageService.add({severity:'error', summary: 'Error', detail: "Failed to upload !"});
      })
      },err=>{
        this.loader.hide();
        this.messageService.add({severity:'error', summary: 'Error', detail: "Failed to upload !"});
      })
    }

    //multiple files upload
    // console.log(this.selectedFolder)
    // let objectKey = this.selectedFolder.children.length ? this.selectedFolder.children.length:1;
    //   let folder_key= this.selectedFolder.key + "-" + String(objectKey)
    // const fileData = new FormData();
    //     let fileKeys = [];
    //     for (let i = 0; i < files.length; i++) {
    //         fileData.append("filePath", files[i]);
    //         fileKeys.push(String(this.selectedFolder.key + "-" + String(objectKey+i)))
    //     }
    //     fileData.append("projectId",this.project_id);
    //     fileData.append("taskId",'')
    //     fileData.append("ChildId",'1')
    //     fileData.append("fileUniqueIds",JSON.stringify(fileKeys))
    //   this.rest_api.uploadfilesByProject(fileData).subscribe(res=>{
    //     this.loader.hide();
    //     this.getTheListOfFolders();
    //     this.messageService.add({severity:'success', summary: 'Success', detail: 'Folder Created Successfully !!'});
    //   },err=>{
    //     this.loader.hide();
    //     this.messageService.add({severity:'error', summary: 'Error', detail: "Folder Creation failed"});
    //   })


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
        }else{
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
        this.messageService.add({severity:'info', summary: 'Info', detail: 'No documents in selected folder !'});
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
          const uniqueIds = [];
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
      this.files=[];
      this.files=[
        {
          key: "0",
          label: "Add Folder",
          data: "Add Folder",
          data_type:"addfolder",
          collapsedIcon: 'pi pi-folder',
          expandedIcon: 'pi pi-folder'
        },
      ];
      this.convertToTreeView(this.documents_resData)
    }
    }

    
  convertToTreeView1(res_data){
    this.breadcrumbItems=[];
    this.files=[];
    res_data.map(data=> {
      if(data.dataType=='folder'){
        data["children"]=[]
      }
      return data
    })

    for (let obj of res_data) {
      let node = {
        key: obj.key,
        label: obj.label,
        data: obj.data,
        type:"default",
        uploadedBy:obj.uploadedBy,
        projectId:obj.projectId,
        id: obj.id,
        dataType:obj.dataType,
        children:obj.children,
        uploadedDate:obj.uploadedDate
      };
        if(obj.dataType == 'folder'){
          node['collapsedIcon']=  "pi pi-folder"
          node["expandedIcon"]  ="pi pi-folder-open"
        }else if(obj.dataType == 'png' || obj.dataType == 'jpg' || obj.dataType == 'svg' || obj.dataType == 'gif'){
          node['icon']=  "pi pi-image"
      }else{
        node['icon']=  "pi pi-file"
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
    this.folder_files = this.files
    this.loader.hide();
  }

    truncateDesc(data){
      if(data && data.length > 51)
        return data.substr(0,50)+'...';
      return data;
    }
}