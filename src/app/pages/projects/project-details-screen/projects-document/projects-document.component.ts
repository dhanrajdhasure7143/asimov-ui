import { Component, OnInit } from "@angular/core";
import { TreeNode } from "primeng/api";

@Component({
  selector: "app-projects-document",
  templateUrl: "./projects-document.component.html",
  styleUrls: ["./projects-document.component.css"],
})
export class ProjectsDocumentComponent implements OnInit {
  files: TreeNode[];
  hiddenPopUp: boolean = false;
  isSidebar: boolean = false;
  isDialog: boolean = false;
  isDialog1: boolean = false;
  entered_folder_name: any;
  selectedFile: TreeNode;
  text: string;
  folder_name: any;
  isDialogBox: boolean = false;
  isFolder : boolean = true;
  isTree : boolean = false;
  isSubFolder : boolean = false;
  example: TreeNode = {
    label: "example",
    data: "Movies Folder",
    expandedIcon: "pi pi-folder-open",
    collapsedIcon: "pi pi-folder-open",
  };
  folder_files:any=[];
  selectedFolder: TreeNode
  folderName : string;
  enteredFolderName : string;
  parentFolder : string;
  fileImage : './../../../../assets/images-n/projects/file.svg'
  folderImage : './../../../../assets/images-n/projects/folder.svg'


  constructor() {}

  ngOnInit(): void {
    this.files = [
      {
        key: "0",
        label: "Add Folder",
        data: "Movies Folder",
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder-open",
      },
      {
        key: "1",
        label: "Analysis",
        data: "Documents Folder",
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder",
        children: [
          {
            key: "1-0",
            label: "Add Folder / Document",
            data: "Work Folder",
            expandedIcon: "pi pi-folder-open",
            collapsedIcon: "pi pi-folder",
          },
          { key: "1-1", label: "Document 1", icon: "pi pi-file", data: "Document" },
          { key: "1-2", label: "Document 2", icon: "pi pi-file", data: "Document" },
          { key: "1-3", label: "Document 3", icon: "pi pi-file", data: "Document" },
        ],
      },
      {
        key: "2",
        label: "System Connectivity",
        data: "Pictures Folder",
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder",
        children: [
          {
            key: "2-0",
            label: "Add Folder / Document",
            data: "Work Folder",
            expandedIcon: "pi pi-folder-open",
            collapsedIcon: "pi pi-folder",
          },
          { key: "2-1", label: "Document 1", icon: "pi pi-file", data: "Document" },
          { key: "2-2",label: "Document 2", icon: "pi pi-file", data: "Document" },
          { key: "2-3", label: "Document 3", icon: "pi pi-file", data: "Document" },
        ],
      },
      {
        key: "3",
        label: "Process Documents",
        data: "Pictures Folder",
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder",
        children: [
          {
            key: "3-0",
            label: "Add Folder / Document",
            data: "Work Folder",
            expandedIcon: "pi pi-folder-open",
            collapsedIcon: "pi pi-folder",
          },
          { key: "3-1", label: "Document 1", icon: "pi pi-file", data: "Document" },
          { key: "3-2", label: "Document 2", icon: "pi pi-file", data: "Document" },
          { key: "3-3", label: "Document 3", icon: "pi pi-file", data: "Document" },
        ],
      },
      {
        key: "4",
        label: "Testing",
        data: "Movies Folder",
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder",
        children: [
          {
            key: "4-0",
            label: "Add Folder / Document",
            data: "Work Folder",
            expandedIcon: "pi pi-folder-open",
            collapsedIcon: "pi pi-folder",
          },
          { key: "4-1", label: "Document 1", icon: "pi pi-file", data: "Document" },
          { key: "4-2", label: "Document 2", icon: "pi pi-file", data: "Document" },
          { key: "4-3", label: "Document 3", icon: "pi pi-file", data: "Document" },
        ],
      },
      {
        key: "5",
        label: "References",
        data: "Movies Folder",
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder",
        children: [
          {
            key: "5-0",
            label: "Add Folder / Document",
            data: "Work Folder",
            expandedIcon: "pi pi-folder-open",
            collapsedIcon: "pi pi-folder",
          },
          { key: "5-1", label: "Document 1", icon: "pi pi-file", data: "Document" },
          { key: "5-2", label: "Document 2", icon: "pi pi-file", data: "Document" },
          { key: "5-3", label: "Document 3", icon: "pi pi-file", data: "Document" },
        ],
      },
      {
        key: "6",
        label: "New Folder",
        data: "Movies Folder",
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder-open",
        children: [
          { key: "6-0", label: "Create File", icon: "pi pi-file", data: "Document" },
        ],
      },
    ];
    this.folder_files = this.files
  }

  saveFolder() {
    this.enteredFolderName = this.entered_folder_name
      console.log("testing...")
    if (this.selectedFile && this.entered_folder_name) {
      let object = { ...{}, ...this.example };
      object.label = this.entered_folder_name;
      let objectKey = this.selectedFile.parent.children.length ? String(this.selectedFile.parent.children.length):"0";
      object["key"] = this.selectedFile.parent.key + "-" + objectKey;
      object["children"] = [
        {
          key: this.selectedFile.parent.key + "-" + objectKey + "-0" ,
          label: "Add Folder / Document",
          data: "Work Folder",
          expandedIcon: "pi pi-folder-open",
          collapsedIcon: "pi pi-folder",
        },
      ]
      this.selectedFile.parent.children.push(object);
      this.entered_folder_name = "";
      this.isDialog = false;
    }
  }

  nodeSelect(event) {
    if (event.node.label == "Add Folder") {
      this.isDialogBox = true;
    }
      if (event.node.label == "Add Folder / Document") {
        this.isDialog = true;
      }
  }

  showDialog() {
    this.isDialog = true;
  }

  addParent() {
    this.parentFolder = this.folder_name
    this.files.push({
      key: String(this.files.length),
      label: this.folder_name,
      data: "Movies Folder",
      expandedIcon: "pi pi-folder-open",
      collapsedIcon: "pi pi-folder-open",
      children: [
        {
          key: String(this.files.length)+"-0" ,
          label: "Add Folder / Document",
          data: "Work Folder",
          expandedIcon: "pi pi-folder-open",
          collapsedIcon: "pi pi-folder",
        },
      ],
    });
    this.folder_name = "";
    this.isDialogBox = false;
  }

  folderView(){
    // for (let i = 0; i < 100; i++)
    // console.log(this.files[i].children[i]);
    this.folder_files = this.files
    this.isFolder = true;
    this.isTree = false;
  }

  treeView(){
    this.isTree = true;
    this.isFolder = false;
  }
  folderStructure1(){
    this.hiddenPopUp = true;

  }

  folderStructure(event){

    this.folderName = event.label;
    console.log(this.folderName,"folderName");
    if(event.label =="Add Folder / Document")
    return this.isDialog1 = true;

    if(event.label =="Add Folder")
    return this.isDialogBox = true;

    this.selectedFolder = event
    this.folder_files = event.children

  }

  addSubfolder() {
    console.log("testing..." ,this.selectedFolder)
    
  if (this.selectedFolder && this.entered_folder_name) {
    let object = { ...{}, ...this.example };
    object.label = this.entered_folder_name;
    let objectKey = this.selectedFolder.children.length ? String(this.selectedFolder.children.length):"0";
    object["key"] = this.selectedFolder.key + "-" + objectKey;
    object["children"] = [
      {
        key: this.selectedFolder.key + "-" + objectKey + "-0" ,
        label: "Add Folder / Document",
        data: "Work Folder",
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder",
      },
    ]
    console.log("object",object)
    this.selectedFolder.children.push(object);
    this.entered_folder_name = "";
    this.isDialog1 = false;
    console.log(this.files)
  }
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
    this.hiddenPopUp = event;
  }
}