import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTreeNestedDataSource  } from '@angular/material';
import { MatTree } from '@angular/material/tree';
import { Router } from '@angular/router';

let TREE_DATA: any[] = [
  {
    name: 'Management Process',
    children:[]
  },
  {
    name: 'Core Process',
    children:[]
  },
  {
    name: 'Support Process',
    children:[]
  },
  {
    vcmname:''
  }
];

@Component({
  selector: 'app-vcm-structure',
  templateUrl: './vcm-structure.component.html',
  styleUrls: ['./vcm-structure.component.css']
})
export class VcmStructureComponent implements OnInit {
  @ViewChild('tree',{static: false}) tree : MatTree<any>;
  treeControl = new NestedTreeControl<any>(node => node.children);
  dataSource = new MatTreeNestedDataSource<any>();
  vcmProcess:any;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.dataSource.data = [{"name":"Management Process","children":[{"processname":"Management Process","name":"Manage","description":"","owner":"","documents":[],"children":[{"name":"Sample","processname":"Management Process","level1child":"Manage","description":"","owner":"","documents":[]}]},{"processname":"Management Process","name":"Process","description":"","owner":"","documents":[],"children":[{"name":"Sample Manage","processname":"Management Process","level1child":"Process","description":"","owner":"","documents":[]}]}]},{"name":"Core Process","children":[{"processname":"Core Process","name":"Core ","description":"","owner":"","documents":[],"children":[{"name":"Sample Core","processname":"Core Process","level1child":"Core ","description":"","owner":"","documents":[]},{"name":"Testing Core","processname":"Core Process","level1child":"Core ","description":"","owner":"","documents":[]}]},{"processname":"Core Process","name":"Core Support","description":"","owner":"","documents":[],"children":[{"name":"Sample Core","processname":"Core Process","level1child":"Core Support","description":"","owner":"","documents":[]},{"name":"Sample Core 1","processname":"Core Process","level1child":"Core Support","description":"","owner":"","documents":[]}]}]},{"name":"Support Process","children":[{"processname":"Support Process","name":"Support","description":"","owner":"","documents":[]},{"processname":"Support Process","name":"Support Module","description":"","owner":"","documents":[],"children":[{"name":"Sample Support","processname":"Support Process","level1child":"Support Module","description":"","owner":"","documents":[]}]}]},{"vcmname":"ORC Value Chain"}];
    this.vcmProcess = this.dataSource.data;
  }
  ngAfterViewInit() {
    // this.treeControl.dataNodes = this.dataSource.data; 
    // this.treeControl.expandAll();
  }

  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

  edit(){
    // sessionStorage.setItem('vcmTree',JSON.stringify(this.vcmProcess));
    // this.router.navigate(['/pages/vcm/create-vcm']);
  }

}

