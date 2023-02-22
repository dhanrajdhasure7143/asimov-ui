import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TreeNode } from "primeng/api";
import { RestApiService } from "src/app/pages/services/rest-api.service";

@Component({
  selector: "app-projects-document",
  templateUrl: "./projects-document.component.html",
  styleUrls: ["./projects-document.component.css"],
})
export class ProjectsDocumentComponent implements OnInit {
  files: any[]=[];
  createFolderPopUP: boolean = false;
  hiddenPopUp1: boolean = false;
  createTreeFolderOverlay: boolean = false;
  isSidebar: boolean = false;
  isDialog: boolean = false;
  isDialog1: boolean = false;
  entered_folder_name: any;
  selectedFile: any;
  text: string;
  folder_name: any;
  isDialogBox: boolean = false;
  isFolder : boolean = true;
  isSubFolder : boolean = false;
  sampleNode_object = {
    key :"",
    label: "",
    data: "Movies Folder",
    expandedIcon: "pi pi-folder-open",
    collapsedIcon: "pi pi-folder",
  };
  folder_files:any=[];
  selectedFolder: any;
  selectedItem:any;
  @ViewChild('op', {static: false}) model;
  @ViewChild('op2', {static: false}) model2;
  isDialog2:boolean = false;
  term:any;
  params_data:any;
  project_id:any;
  project_name:any;
  nodeMap:Object = {};
  opened_folders:any[]=[];
  selected_folder_rename:any;

  constructor(private rest_api : RestApiService,
    private route : ActivatedRoute,
    private router : Router) {

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
    for (let obj of this.testData) {
      let node = {
        label: obj.label,
        data: obj.data,
        key: obj.key,
        type:"default"
      };
        if(obj.data_type == 'folder'){
          node['collapsedIcon']=  "pi pi-folder"
          node["expandedIcon"]  ="pi pi-folder-open"
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
          if (!parent.children) {
            let obj1={
              key: obj.key+'-0',
              label: "Add Folder / Document",
              data_type:"addfolder",
              collapsedIcon: 'pi pi-folder',
              expandedIcon: 'pi pi-folder'
            }
            parent.children = [obj1];
          }
          parent.children.push(node);
        }
      }
    }
    this.folder_files = this.files
    // setTimeout(()=>{
    //   // console.log(this.getDataByParentId(this.data, null));
    //   console.log("testing",this.treeData)
    // },1000)


  }
  

  

  

testData =[

  {
    key: "1",
    label: "Analysis",
    data: "Documents Folder",
    data_type:"folder",},
      { key: "1-2", label: "Document 2", data: "Document",data_type:"file",fileSize:"",task_id:'',project_id:''},
      { key: "1-3", label: "Document 3", data: "Document",data_type:"file",fileSize:"",task_id:'',project_id:''},
      { key: "1-3", label: "Document 3", data: "Document",data_type:"file",fileSize:"" ,task_id:'',project_id:''},
  {
    key: "2",
    label: "System Connectivity",
    data: "Pictures Folder",
    data_type:"folder"},
      { key: "2-1", label: "Document 1", data: "Document",data_type:"file" },
      { key: "2-2",label: "Document 2", data: "Document",data_type:"file" },
      { key: "2-3", label: "Document 3", data: "Document",data_type:"file" },
  {
    key: "3",
    label: "Process Documents",
    data: "Pictures Folder",
    data_type:"folder"},
      { key: "3-1", label: "Document 1", data: "Document",data_type:"file" },
      { key: "3-2", label: "Document 2", data: "Document",data_type:"file" },
      { key: "3-3", label: "Document 3", data: "Document",data_type:"file" },

]

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
  

  treeChildSave() {
    if (this.selectedFile && this.entered_folder_name) {
      let object = { ...{}, ...this.sampleNode_object };
      object.label = this.entered_folder_name;
      let objectKey = this.selectedFile.parent.children.length ? String(this.selectedFile.parent.children.length):"0";
      object.key = this.selectedFile.parent.key + "-" + objectKey;
      object["children"] = [
        {
          key: this.selectedFile.parent.key + "-" + objectKey + "-0" ,
          label: "Add Folder / Document",
          data: "Work Folder",
          data_type:"addfolder",
          expandedIcon: "pi pi-folder",
          collapsedIcon: "pi pi-folder",
        },
      ]
      this.selectedFile.parent.children.push(object);
      this.entered_folder_name = "";
      this.isDialog = false;
    }
  }

  nodeSelect(item) {
    // this.model.toggle();
    // this.model.show();

    this.selectedItem = item;
    if(this.selectedItem.node.label =="Add Folder / Document" || this.selectedItem.node.label =="Add Folder"){
      this.createTreeFolderOverlay = true;
      if(this.selectedItem.node.label =="Add Folder / Document")
      return this.hiddenPopUp1 = true;
  
      if(this.selectedItem.node.label =="Add Folder")
      return this.hiddenPopUp1 = false;
    }else{
      // console.log(item,"open Doc")
    }

    // if (item.node.label == "Add Folder") {
    //   this.isDialogBox = true;
    // }
    //   if (item.node.label == "Add Folder / Document") {
    //     this.isDialog = true;
    //   }
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
    let params={project_id:this.project_id,project_name:this.project_name,"folderView":true};
    this.router.navigate([],{ relativeTo:this.route, queryParams:params });
  }

  treeView(){
    this.isFolder = false;
    this.folder_files = this.files;
    this.opened_folders=[];
    let params={project_id:this.project_id,project_name:this.project_name,"treeView":true};
    this.router.navigate([],{ relativeTo:this.route, queryParams:params });
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
      if(clickType== 'dblclick'){
        this.onCreateFolder();
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

  }

  addSubfolder() {
  if (this.selectedFolder && this.entered_folder_name) {
    let object = { ...{}, ...this.sampleNode_object };
    object.label = this.entered_folder_name;
    let objectKey = this.selectedFolder.children.length ? String(this.selectedFolder.children.length):"0";
    object.key = this.selectedFolder.key + "-" + objectKey;
    object["children"] = [
      {
        key: this.selectedFolder.key + "-" + objectKey + "-0" ,
        label: "Add Folder / Document",
        data: "Work Folder",
        data_type:"addfolder",
        expandedIcon: "pi pi-folder",
        collapsedIcon: "pi pi-folder",
      }
    ]
    console.log("object",object)
    this.selectedFolder.children.push(object);
    this.entered_folder_name = "";
    this.isDialog1 = false;
    console.log(this.selectedFile)

  }
}

addParentFolder() {
  let request_object=  {
    key: String(this.files.length),
    label: this.folder_name,
    data: "Folder",
    ChildId:1,
    DataType:"folder",
    ProjectId:this.project_id,
    fileSize:"",
    task_id:''
  }     
  var fileData = new FormData();
  // for (var i = 0; i < files.length; i++) {
  //   fileData.append("filePath", files[i]);
  // }
  fileData.append("key",String(this.files.length))
  fileData.append("label",this.folder_name)
  fileData.append("data","Folder")
  fileData.append("ChildId",'1')
  fileData.append("DataType",'folder')
  fileData.append("fileSize",'')
  fileData.append("task_id",'')
  fileData.append("projectId", this.project_id)

  this.rest_api.createFolderByProject(fileData).subscribe(res=>{
    console.log(res)
  })
  this.files.push({
    key: String(this.files.length),
    label: this.folder_name,
    data: "Movies Folder",
    expandedIcon: "pi pi-folder-open",
    collapsedIcon: "pi pi-folder",
    children: [
      {
        key: String(this.files.length)+"-0" ,
        label: "Add Folder / Document",
        data: "Work Folder",
        data_type:"addfolder",
        expandedIcon: "pi pi-folder",
        collapsedIcon: "pi pi-folder",
      }
    ],
  });
  this.folder_name = "";
  this.isDialogBox = false;
}

  // removeRoute(node) {
  //   const parent: any = this.findById(this.files, node.parentId);
  //   const index = parent.children.findIndex((c) => c.id === node.id);
  //   console.log(index, 1);
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
    console.log("testing")
  }

  onNodeClick(event,node){
    // console.log(node)
    console.log(this.selectedItem)
    this.model.hide();
    if(node.label != "Add Folder" && node.label != "Add Folder / Document"){
      setTimeout(() => {
        this.model.show(event)
        }, 200);
    }
  }

  onFolderRename(type){
    // this.isDialog2 = true;
    console.log(this.selectedItem)
    if(type =='folderView'){
      this.entered_folder_name = this.selectedItem.label
      this.selectedItem.type ='textBox'
      this.model2.hide();
    }else{
      this.entered_folder_name = this.selectedItem.node.label
      this.selectedItem.node.type ='textBox'
      this.model.hide();
    }
  }

  saveRenameFolder(){

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

  navigateToCreateDocument(){
    this.router.navigate(['pages/projects/document-editor'],
    { queryParams: { project_id:this.project_id, projectName:this.project_name  } })
  }

  singleFileUpload(e){
    let object = { ...{}, ...this.sampleNode_object };
    object.label = this.entered_folder_name;
    let objectKey = this.selectedFile.parent.children.length ? String(this.selectedFile.parent.children.length):"0";
    object.key = this.selectedFile.parent.key + "-" + objectKey;

    var fileData = new FormData();
    var selectedFile = e.target.files[0];
    console.log(selectedFile)
    fileData.append("filePath", e.target.files[0]);
    fileData.append("key",String(this.files.length))
    fileData.append("label",selectedFile.name.split('.')[0])
    fileData.append("data","file")
    fileData.append("ChildId",'1')
    fileData.append("DataType",selectedFile.name.split('.')[1])
    fileData.append("fileSize",selectedFile.size)
    fileData.append("task_id",'')
    fileData.append("projectId", this.project_id)
    this.rest_api.createFolderByProject(fileData).subscribe(res=>{
      console.log(res)
    })
      // for (var i = 0; i < files.length; i++) {
  //   fileData.append("filePath", files[i]);
  // }
  //   if(this.file_Category == "Template"){
  //     this.fileList=[];
  //     this.listOfFiles=[];
  //   }
  // for (var i = 0; i <= e.target.files.length - 1; i++) {
  //   var selectedFile = e.target.files[i];
  //   this.fileList.push(selectedFile);
  //   var value = {
  //     // File Name 
  //     name: selectedFile.name,
  //     //File Size 
  //     size: selectedFile.size,
  //   }
  //   this.listOfFiles.push(value)
  // }
  }

  onFolderSelect(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      const folderName = files[0].webkitRelativePath.split('/')[0];
      console.log('Selected folder:', folderName);
    }
    let fileFormArray:any=[];
    // console.log(files,event)
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.webkitRelativePath) {
        // The file is inside a folder
        let fileData=new FormData();
        console.log(file.webkitRelativePath);
        fileData.append("filePath", file);
        fileData.append("key",String("sample"))
        fileData.append("label",file.name.split('.')[0])
        fileData.append("data","file")
        fileData.append("ChildId",'1')
        fileData.append("DataType",file.name.split('.')[1])
        fileData.append("fileSize",file.size)
        fileData.append("task_id",'')
        fileData.append("projectId", this.project_id);
        fileFormArray.push(fileData)
        // Upload the file as desired
      } else {
 
        // The file is not inside a folder
        console.log(file.name);
        // Upload the file as desired
      }
    }
    console.log(fileFormArray)
    console.log(fileFormArray[0].get("label"))
    // this.rest_api.createFolderByProject(fileFormArray).subscribe(res=>{
    //   console.log(res)
    // })
  }

  onRightClick(event,node){
    event.preventDefault();
    if(this.selectedItem)this.selectedItem.type='default';
    this.selectedItem=node;
    console.log(this.selectedItem)
    this.model2.hide();
    if(node.label != "Add Folder" && node.label != "Add Folder / Document"){
      setTimeout(() => {
        this.model2.show(event)
        }, 200);
  }
}

  onCancelFolderNameUpdate(){
    this.selectedItem.node.type ='default';
    this.entered_folder_name='';
  }

  onSaveFolderNameUpdate(){
    console.log(this.selectedItem)
    console.log(this.entered_folder_name)
    this.selectedItem.node.label = this.entered_folder_name;
    this.selectedItem.node.type ='default';
  }
  backToSelectedFolder(){
    this.folder_files = this.opened_folders[this.opened_folders.length-1];
    this.opened_folders.pop()
    console.log(this.opened_folders)
  }
  
}