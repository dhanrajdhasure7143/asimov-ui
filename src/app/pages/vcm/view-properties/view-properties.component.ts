import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-properties',
  templateUrl: './view-properties.component.html',
  styleUrls: ['./view-properties.component.css']
})
export class ViewPropertiesComponent implements OnInit {

  @Input() vcm_data:any;
  @Input() processOwners_list:any;
  isDisabled:boolean=true;
  attachements:any=[];
  prop_data:any=[]

  constructor() { }

  ngOnInit(): void {
    console.log(this.vcm_data)

  }

  ngOnChanges(){
    console.log(this.processOwners_list)
    this.vcm_data.forEach(element => {
      if(element.processOwner){
        this.prop_data.push(element)
      }
    })
    this.vcm_data.forEach(element => {
      if(element.attachements){
        element.attachements.forEach(ele => {
        this.attachements.push(ele)
          
        });
      }
      
    });
    console.log(this.attachements)
  }


}
