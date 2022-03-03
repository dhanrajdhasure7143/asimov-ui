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
  attachments:any=[];
  prop_data:any=[]

  constructor() { }

  ngOnInit(): void {
    console.log(this.vcm_data)

  }

  ngOnChanges(){
    console.log("this.vcm_data",this.vcm_data)
    this.vcm_data.forEach(element => {
      if(element.processOwner){
        this.prop_data.push(element)
      }
    })
    this.vcm_data.forEach(element => {
      if(element.attachments.length>0){
        element.attachments.forEach(ele => {
        this.attachments.push(ele)
          
        });
      }
      
    });
    console.log("this.attachements",this.attachments)
  }


}
