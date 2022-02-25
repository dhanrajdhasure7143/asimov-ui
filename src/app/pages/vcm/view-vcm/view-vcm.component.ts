import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  

  constructor(private router: Router,private rest_api: RestApiService, private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.getListofVcms();
  }

  createVcm(){
    this.router.navigateByUrl('/pages/vcm/create-vcm');
  }
  viewStructure(object){
    this.router.navigate(['/pages/vcm/vcm-structure'],{queryParams: {id: object.id}})
  }

  getListofVcms(){
    this.isLoading=true;
    this.rest_api.getAllvcms().subscribe(res=>{this.vcms_list=res
      this.isLoading=false;
    })
  }
  delete(){
    let body={"vcmId":1994}
  this.rest_api.deleteVcm(body).subscribe(res=>{
    console.log(res);
  });
}

}
