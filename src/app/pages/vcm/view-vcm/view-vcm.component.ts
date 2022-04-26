import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';
import { RestApiService } from '../../services/rest-api.service';

@Component({
  selector: 'app-view-vcm',
  templateUrl: './view-vcm.component.html',
  styleUrls: ['./view-vcm.component.css']
})
export class ViewVcmComponent implements OnInit {

  vcmProcess:any[];
  vcms_list:any=[];
  isLoading:boolean=false;
  vcm_id:any=[];
  

  constructor(private router: Router,private rest_api: RestApiService, private route: ActivatedRoute,
    private dt: DataTransferService) { }


  ngOnInit(): void {
    this.getListofVcms();
    localStorage.removeItem('vcmData');
    this.dt.vcmDataTransfer({data:[]})
  }

  createVcm(){
    this.router.navigateByUrl('/pages/vcm/create-vcm');
  }
  viewStructure(object){
    this.router.navigate(['/pages/vcm/vcm-structure'],{queryParams: {id: object.id}})
  }

  getListofVcms(){
    this.isLoading=true;
    let res_data
    this.rest_api.getAllvcms().subscribe(res=>{res_data=res
      this.vcms_list=res_data.data
      this.vcms_list.sort(function (a, b) {
        return b.convertedCreatedTime - a.convertedCreatedTime;
      });
      this.isLoading=false;
    })
  }

deleteVcm(){
  let body={"vcmId":3557}
  this.rest_api.deleteVcm(body).subscribe(res=>{
    this.getListofVcms();
  })
}

}
