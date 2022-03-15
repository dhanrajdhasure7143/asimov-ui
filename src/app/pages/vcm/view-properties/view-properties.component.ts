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
  @Input() edit:any;
  isDisabled:boolean=true;
  attachments:any=[];
  prop_data:any=[];
  isLoading:boolean=false;

  constructor(private rest_api: RestApiService) { }

  ngOnInit(): void {
    console.log(this.edit);
  }

  ngOnChanges(){
    console.log("this.vcm_data",this.vcm_data)
    console.log("this.vcm_resData",this.vcm_resData)
    this.prop_data=[];
    this.getAttachements();
    this.vcm_data.forEach(element => {
      if(element.processOwner){
        this.prop_data.push(element)
      }
    })
    console.log("properties data",this.prop_data)
  }

  getAttachements(){
    if(this.vcm_resData){
      // this.isLoading=true;
      let reqBody={
        "masterId": this.vcm_resData.data.id,
        "parent": this.vcm_resData.mainParent
      }
      let res_data
      this.attachments=[];
    this.rest_api.getvcmAttachements(reqBody).subscribe(res=>{res_data=res
      console.log(res)
      this.attachments=res_data.data
      this.isLoading=false;
    })
    }
  }



}
