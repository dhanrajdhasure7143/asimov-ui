import { Component, OnInit } from "@angular/core";
import { TreeNode } from "primeng/api";

@Component({
  selector: "app-projects-document",
  templateUrl: "./projects-document.component.html",
  styleUrls: ["./projects-document.component.css"],
})
export class ProjectsDocumentComponent implements OnInit {
  files: TreeNode[];
  display: boolean = false;
  isSidebar: boolean = false;
  isDialog: boolean = false;
  entered_folder_name: any;
  selectedFile: TreeNode;
  text: string;
  folder_name: any;
  isDialogBox: boolean = false;
  example: TreeNode = {
    label: "example",
    data: "Movies Folder",
    expandedIcon: "pi pi-folder-open",
    collapsedIcon: "pi pi-folder-open",
  };

  constructor() {}

  ngOnInit(): void {
    this.files = [
      {
        label: "Add Folder",
        data: "Movies Folder",
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder-open",
      },
      {
        label: "Analysis",
        data: "Documents Folder",
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder",
        children: [
          {
            label: "Add Folder / Document",
            data: "Work Folder",
            expandedIcon: "pi pi-folder-open",
            collapsedIcon: "pi pi-folder",
          },
          { label: "Document 1", icon: "pi pi-file", data: "Document" },
          { label: "Document 2", icon: "pi pi-file", data: "Document" },
          { label: "Document 3", icon: "pi pi-file", data: "Document" },
        ],
      },
      {
        label: "System Connectivity",
        data: "Pictures Folder",
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder",
        children: [
          {
            label: "Add Folder / Document",
            data: "Work Folder",
            expandedIcon: "pi pi-folder-open",
            collapsedIcon: "pi pi-folder",
          },
          { label: "Document 1", icon: "pi pi-file", data: "Document" },
          { label: "Document 2", icon: "pi pi-file", data: "Document" },
          { label: "Document 3", icon: "pi pi-file", data: "Document" },
        ],
      },
      {
        label: "Process Documents",
        data: "Pictures Folder",
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder",
        children: [
          {
            label: "Add Folder / Document",
            data: "Work Folder",
            expandedIcon: "pi pi-folder-open",
            collapsedIcon: "pi pi-folder",
          },
          { label: "Document 1", icon: "pi pi-file", data: "Document" },
          { label: "Document 2", icon: "pi pi-file", data: "Document" },
          { label: "Document 3", icon: "pi pi-file", data: "Document" },
        ],
      },
      {
        label: "Testing",
        data: "Movies Folder",
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder",
        children: [
          {
            label: "Add Folder / Document",
            data: "Work Folder",
            expandedIcon: "pi pi-folder-open",
            collapsedIcon: "pi pi-folder",
          },
          { label: "Document 1", icon: "pi pi-file", data: "Document" },
          { label: "Document 2", icon: "pi pi-file", data: "Document" },
          { label: "Document 3", icon: "pi pi-file", data: "Document" },
        ],
      },
      {
        label: "References",
        data: "Movies Folder",
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder",
        children: [
          {
            label: "Add Folder / Document",
            data: "Work Folder",
            expandedIcon: "pi pi-folder-open",
            collapsedIcon: "pi pi-folder",
          },
          { label: "Document 1", icon: "pi pi-file", data: "Document" },
          { label: "Document 2", icon: "pi pi-file", data: "Document" },
          { label: "Document 3", icon: "pi pi-file", data: "Document" },
        ],
      },
      {
        label: "New Folder",
        data: "Movies Folder",
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder-open",
        children: [
          { label: "Create File", icon: "pi pi-file", data: "Document" },
        ],
      },
    ];
  }

  saveFolder() {
    if (this.selectedFile && this.entered_folder_name) {
      let object = { ...{}, ...this.example };
      object.label = this.entered_folder_name;
      this.selectedFile.children.push(object);
      this.entered_folder_name = "";
      console.log(
        "Added child in ",
        this.selectedFile,
        "you can find in",
        this.files
      );
      this.isDialog = false;
    }
  }

  nodeSelect(event) {
    if (event.node.label == "Add Folder") {
      this.isDialogBox = true;
    }
    for (let i = 0; i < 100; i++)
      if (event.node.children[i].label == "Add Folder / Document") {
        this.isDialog = true;
      }
  }

  showDialog() {
    this.isDialog = true;
  }

  addParent() {
    this.files.push({
      label: this.folder_name,
      data: "Movies Folder",
      expandedIcon: "pi pi-folder-open",
      collapsedIcon: "pi pi-folder-open",
      children: [
        {
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
}