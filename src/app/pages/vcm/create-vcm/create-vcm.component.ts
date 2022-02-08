import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material';
import { MatTree } from '@angular/material/tree';
import {Router} from "@angular/router"

let TREE_DATA: any[] = [
  {
    name: 'Management Process',
    description:'',
    owner:'',
    children: []
  },
  {
    name: 'Core Process',
    description:'',
    owner:'',
    children: []
  },
  {
    name: 'Support Process',
    description:'',
    owner:'',
    children: []
  },
  {
    vcmname: ''
  },
  {
    documents:[]
  }
];


@Component({
  selector: 'app-create-vcm',
  templateUrl: './create-vcm.component.html',
  styleUrls: ['./create-vcm.component.css']
})
export class CreateVcmComponent implements OnInit {
  @ViewChild('tree', { static: false }) tree: MatTree<any>;


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

  constructor(private router: Router) {
    this.dataSource.data = TREE_DATA;
    this.vcmProcess = TREE_DATA;
  }

  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    let checkProperties = JSON.parse(sessionStorage.getItem('vcmTree'));
    if(checkProperties){
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
      name: this.manageinput
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
      name: this.coreinput
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
      name: this.supportinput
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
    console.log(this.vcmProcess);
  }

  // 

  addNewLevel2() {
    console.log(this.addLevel2);
    console.log(this.level1process);
    let record = {
      name: this.addLevel2,
      processname: this.level1process.processname,
      level1child: this.level1process.name
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
    console.log(this.vcmProcess);
  }

  resetLevel1() {
    TREE_DATA = [
      {
        name: 'Management Process',
        description:'',
        owner:'',
        children: []
      },
      {
        name: 'Core Process',
        description:'',
        owner:'',
        children: []
      },
      {
        name: 'Support Process',
        description:'',
        owner:'',
        children: []
      },
      {
        vcmname: ''
      },
      {
        documents:[]
      }
    ];
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
    this.vcmName = '';
    sessionStorage.removeItem('vcmTree');
  }

  saveLevel1() {
    TREE_DATA[3].vcmname = this.vcmName;
    this.dataSource.data = null;
    this.dataSource.data = TREE_DATA;
    this.vcmProcess = null;
    this.vcmProcess = TREE_DATA;
  }

  goToProperties(){
    if(this.vcmProcess[0].children.length != 0 || this.vcmProcess[1].children.length != 0 || this.vcmProcess[2].children.length != 0){
    this.router.navigate(['/pages/vcm/properties']);
    TREE_DATA[3].vcmname = this.vcmName;
    sessionStorage.setItem('vcmTree',JSON.stringify(this.vcmProcess));
    }
  }

}
