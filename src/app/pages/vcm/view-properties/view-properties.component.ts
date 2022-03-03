import { Component, Input, OnInit } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';

@Component({
  selector: 'app-view-properties',
  templateUrl: './view-properties.component.html',
  styleUrls: ['./view-properties.component.css']
})
export class ViewPropertiesComponent implements OnInit {

  @Input() vcm_data:any;
  @Input() processOwners_list:any=[];
  @Input() vcm_resData:any;
  isDisabled:boolean=true;
  attachments:any=[];
  prop_data:any=[];
  isLoading:boolean=false;

  constructor(private rest_api: RestApiService) { }

  ngOnInit(): void {

  }

  ngOnChanges(){
    console.log("this.vcm_data",this.vcm_data)
    console.log("this.vcm_resData",this.vcm_resData)
    this.getAttachements();
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
  }

  getAttachements(){
    if(this.vcm_resData){
      this.isLoading=true;
      let reqBody={
        "masterId": this.vcm_resData.data.id,
        "parent": this.vcm_resData.mainParent
      }
    this.rest_api.getvcmAttachements(reqBody).subscribe(res=>{
      console.log(res)
      this.isLoading=false;
    })
    }
  }



}
