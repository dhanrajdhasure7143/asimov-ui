import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material';
import { MatTree } from '@angular/material/tree';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigationExtras, Router } from "@angular/router";

let TREE_DATA: any[] = [
  {
    name: 'Management Process',
    children: []
  },
  {
    name: 'Core Process',
    children: []
  },
  {
    name: 'Support Process',
    children: []
  },
  {
    vcmname: ''
  }
];


@Component({
  selector: 'app-create-vcm',
  templateUrl: './create-vcm.component.html',
  styleUrls: ['./create-vcm.component.css']
})
export class CreateVcmComponent implements OnInit {
  @ViewChild('tree', { static: false }) tree: MatTree<any>;
  @ViewChild('drawer', { static: false }) drawer: MatDrawer;


  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();

  level1process: any;
  addLevel2 = '';
  levelName = 'level1';
  vcmProcess: any[];
  manageinput = '';
  coreinput = '';
  supportinput = '';
  vcmName = '';
  // properties
  editProcessDescription: any;
  editProcessOwner: any;
  editProcessName: any;
  propertiesName: any;
  editLevelProperties: number;
  level1child: any;
  fileName = [];

  constructor(private router: Router) {
    this.dataSource.data = TREE_DATA;
    this.vcmProcess = TREE_DATA;
  }

  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    let checkProperties = JSON.parse(sessionStorage.getItem('vcmTree'));
    if (checkProperties) {
      this.vcmProcess = null;
      this.vcmProcess = checkProperties;
      this.dataSource.data = null;
      this.dataSource.data = checkProperties;
      console.log(this.vcmProcess);
    }
  }

  addManageProcess() {
    let record = {
      processname: 'Management Process',
      name: this.manageinput,
      description: '',
      owner: '',
      documents: []
    }
    TREE_DATA.filter(e => e.name == 'Management Process')[0].children.push(record);
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.manageinput = '';
  }

  addCoreProcess() {
    let record = {
      processname: 'Core Process',
      name: this.coreinput,
      description: '',
      owner: '',
      documents: []
    }
    TREE_DATA.filter(e => e.name == 'Core Process')[0].children.push(record);
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.coreinput = '';
  }

  addSupportProcess() {
    let record = {
      processname: 'Support Process',
      name: this.supportinput,
      description: '',
      owner: '',
      documents: []

    }
    TREE_DATA.filter(e => e.name == 'Support Process')[0].children.push(record);
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.supportinput = '';
  }

  removeChild(name) {
    console.log(name);
    var index = TREE_DATA.filter(e => e.name === name.processname)[0]
      .children.findIndex(c => c.name === name.name);
    TREE_DATA.filter(e => e.name == name.processname)[0].children.splice(index, 1);
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.drawer.close();
    console.log(this.vcmProcess);
  }

  // 

  addNewLevel2() {
    console.log(this.addLevel2);
    console.log(this.level1process);
    let record = {
      name: this.addLevel2,
      processname: this.level1process.processname,
      level1child: this.level1process.name,
      description: '',
      owner: '',
      documents: []
    };
    var index = TREE_DATA.filter(e => e.name === this.level1process.processname)[0]
      .children.findIndex(c => c.name === this.level1process.name);

    if (TREE_DATA.filter(e => e.name == this.level1process.processname)[0]
      .children[index].children) {
      TREE_DATA.filter(e => e.name == this.level1process.processname)[0]
        .children[index].children.push(record);
      this.vcmProcess = null;
      this.vcmProcess = TREE_DATA;
      this.dataSource.data = null;
      this.dataSource.data = TREE_DATA;
      this.addLevel2 = '';
    }
    else {
      TREE_DATA.filter(e => e.name == this.level1process.processname)[0]
        .children[index]['children'] = [];
      TREE_DATA.filter(e => e.name == this.level1process.processname)[0]
        .children[index].children.push(record);
      this.vcmProcess = null;
      this.vcmProcess = TREE_DATA;
      this.dataSource.data = null;
      this.dataSource.data = TREE_DATA;
      this.addLevel2 = '';
    }
    console.log(this.vcmProcess);
  }

  level2removeChild(name) {
    console.log(name);
    var processIndex = TREE_DATA.findIndex(e => e.name === name.processname);
    var processData = TREE_DATA[processIndex]['children'];
    var parentIndex = processData.findIndex(e => e.name === name.level1child);
    var parentData = processData[parentIndex]['children'];
    var childIndex = parentData.findIndex(e => e.name === name.name);
    TREE_DATA[processIndex]['children'][parentIndex]['children'].splice(childIndex, 1);
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.drawer.close();
    console.log(this.vcmProcess);
  }

  resetLevel1() {
    TREE_DATA = [
      {
        name: 'Management Process',
        children: []
      },
      {
        name: 'Core Process',
        children: []
      },
      {
        name: 'Support Process',
        children: []
      },
      {
        vcmname: ''
      }
    ];
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    this.vcmName = '';
    sessionStorage.removeItem('vcmTree');
  }

  editProcess(item, name, level) {
    this.drawer.open();
    this.editLevelProperties = level;
    console.log(this.editLevelProperties);
    this.editProcessDescription = '';
    this.editProcessOwner = '';
    console.log(item, name);
    this.propertiesName = name.processname;
    if (name.description) {
      this.editProcessDescription = name.description;
    }
    if (name.owner) {
      this.editProcessOwner = name.owner;
    }
    if (name.documents) {
      this.fileName = name.documents;
    }
    this.editProcessName = name.name;
  }

  editProperties() {
    TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
      .filter(n => n.name === this.editProcessName)[0].description = this.editProcessDescription;
    TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
      .filter(n => n.name === this.editProcessName)[0].owner = this.editProcessOwner;
    console.log(TREE_DATA);
    this.drawer.close();
  }
  editLevel2(name, level2, level) {
    this.drawer.open();
    this.editProcessDescription = '';
    this.editProcessOwner = '';
    this.editLevelProperties = level;
    console.log(name, level2);
    this.level1child = level2.level1child;
    this.propertiesName = level2.processname;
    if (level2.description) {
      this.editProcessDescription = level2.description;
    }
    if (level2.owner) {
      this.editProcessOwner = level2.owner;
    }
    if (level2.documents) {
      this.fileName = level2.documents;
    }
    this.editProcessName = level2.name;
  }
  editProcessLevel2() {
    TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
      .filter(n => n.name === this.level1child)[0].children.filter(c => c.name === this.editProcessName)[0]
      .description = this.editProcessDescription;
    TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
      .filter(n => n.name === this.level1child)[0].children.filter(c => c.name === this.editProcessName)[0]
      .owner = this.editProcessOwner;
    console.log(TREE_DATA);
    this.drawer.close();
  }

  documentsUpload(event) {
    this.fileName = []
    console.log(event);
    for (var i = 0; i < event.target.files.length; i++) {
      event.target.files[i]['convertedsize'] = this.convertFileSize(event.target.files[i].size);
      event.target.files[i]['filename'] = event.target.files[i]['name'];
      this.fileName.push(event.target.files[i]);
    }
    const formdata = new FormData();
    for (var i = 0; i < this.fileName.length; i++) {
      formdata.append("file", this.fileName[i]);
    }
    if (this.editLevelProperties == 1) {
      console.log(this.fileName);
      TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
        .filter(n => n.name === this.editProcessName)[0].documents = this.fileName;
      this.dataSource.data = null;
      this.dataSource.data = TREE_DATA;
      this.vcmProcess = null;
      this.vcmProcess = TREE_DATA;
    }
    if (this.editLevelProperties == 2) {
      TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
        .filter(n => n.name === this.level1child)[0].children.filter(c => c.name === this.editProcessName)[0]
        .documents = this.fileName;
      this.dataSource.data = null;
      this.dataSource.data = TREE_DATA;
      this.vcmProcess = null;
      this.vcmProcess = TREE_DATA;
    }
    console.log(this.fileName);
    console.log(TREE_DATA);
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
  RemoveFile(file, i: number) {
    this.fileName.splice(i, 1);
    if (this.editLevelProperties == 1) {
      TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
        .filter(n => n.name === this.editProcessName)[0].documents = this.fileName;
    }
    if (this.editLevelProperties == 2) {
      TREE_DATA.filter((e) => e.name === this.propertiesName)[0].children
        .filter(n => n.name === this.level1child)[0].children.filter(c => c.name === this.editProcessName)[0]
        .documents = this.fileName;
    }
    console.log(TREE_DATA);
  }

  saveLevel1() {
    TREE_DATA[3].vcmname = this.vcmName;
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
  }
  vcmHeading() {
    TREE_DATA[3].vcmname = this.vcmName;
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
  }
  goToProperties(level) {
    let nav: NavigationExtras = {
      queryParams: {
        level: level
      }
    }
    console.log(this.vcmProcess);
    if (this.vcmProcess[0].children.length != 0 || this.vcmProcess[1].children.length != 0 || this.vcmProcess[2].children.length != 0) {
      this.router.navigate(['/pages/vcm/properties'], nav);
      TREE_DATA[3].vcmname = this.vcmName;
      this.vcmProcess = TREE_DATA;
      console.log(this.vcmProcess);
      sessionStorage.setItem('vcmTree', JSON.stringify(this.vcmProcess));
    }
  }

  resetProperties(){    
    this.editProcessDescription = '';
    this.editProcessOwner = '';
  }

}
