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
  folder: any;

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

  nodeSelect(event) {
    if (event.node.label == "Add Folder") {
      this.isSidebar = true;
    }
    for (let i = 0; i < 100; i++)
      if (event.node.children[i].label == "Add Folder / Document") {
        this.display = true;
        console.log(event);
      }
  }

  showDialog() {
    this.isDialog = true;
  }

  saveFolder(event) {
    console.log(event);
  }
}
