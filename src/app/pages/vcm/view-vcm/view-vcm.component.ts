import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-vcm',
  templateUrl: './view-vcm.component.html',
  styleUrls: ['./view-vcm.component.css']
})
export class ViewVcmComponent implements OnInit {

  vcmProcess:any[];

  vcmData= [
  {
  "type": "Process",
  "processOwner": "John Mustermann",
  "level": "L1",
  "description": "The implementation and generation of an appropriate strategy by the management requires a structured approach.",
  "title": "manage",
  "parent": "Management Process",
  "children":[]
  },
  
  {
  "type": "Process",
  "processOwner": "John Mustermann",
  "level": "L1",
  "description": "The implementation and generation of an appropriate strategy by the management requires a structured approach.",
  "title": "hr",
  "parent": "Management Process",
  "children":[]
  },
  {
  "type": "Process",
  "processOwner": "John Mustermann",
  "level": "L1",
  "description": "The implementation and generation of an appropriate strategy by the management requires a structured approach.",
  "title": "core",
  "parent": "Core Process",
  "children":[]
  },
  {
  "type": "Process",
  "processOwner": "John Mustermann",
  "level": "L1",
  "description": "The implementation and generation of an appropriate strategy by the management requires a structured approach.",
  "title": "support",
  "parent": "Support Process",
  "children":[]
  },
  {
  "type": "Process",
  "processOwner": "John Mustermann",
  "level": "L1",
  "description": "The implementation and generation of an appropriate strategy by the management requires a structured approach.",
  "title": "support1",
  "parent": "Support Process",
  "children":[]
  },
  {
  "type": "process",
  "processOwner": "John Mustermann",
  "level": "L2",
  "description": "The implementation and generation of an appropriate strategy by the management requires a structured.",
  "title": "manage the company finances",
  "parent": "Management Process",
  "parentl1": "manage"
  } 
  ]
  


  constructor(private router: Router) { }


  data={name: "Management Process",
  children: [{children: [],description: "",documents: [],level: "L1",parent: "Management Process",processOwner: "",title: "trest",type: "Process"},]
  }


  ngOnInit(): void {
    let objData=[{name:"Management Process",children:[]},
    {name:"Core Process",children:[]},
    {name:"Support Process",children:[]}
  ]

    this.vcmData.forEach(e=>{
      objData.forEach(e1=>{
        if(e.level == "L1"){
          if(e.parent == e1.name){
            console.log(e)
            e1["children"].push(e)
          }
        }
      })
    })

    this.vcmData.forEach(e=>{
      objData.forEach(e1=>{
        if(e.level == "L2"){
          if(e.parent == e1.name){
            console.log(e)
            e1.children.forEach(e2=>{
              if(e2.title == e.parentl1 ){
                e2['children'].push(e)
              }
            })
          }
        }
      })
    })
    console.log(objData)
    this.vcmProcess = [
      {vcmname:'Value Chain Mapping 1'},{vcmname:'Value Chain Mapping 2'},{vcmname:'Value Chain Mapping 3'},
      {vcmname:'Value Chain Mapping 4'}
    ]
  }

  createVcm(){
    sessionStorage.removeItem('vcmTree');
    this.router.navigateByUrl('/pages/vcm/create-vcm');
  }
  viewStructure(){
    this.router.navigateByUrl('/pages/vcm/vcm-structure');
  }

}
