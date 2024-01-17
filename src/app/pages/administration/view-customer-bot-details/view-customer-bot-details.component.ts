import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { columnList } from "src/app/shared/model/table_columns";

@Component({
  selector: 'app-view-customer-bot-details',
  templateUrl: './view-customer-bot-details.component.html',
  styleUrls: ['./view-customer-bot-details.component.css']
})
export class ViewCustomerBotDetailsComponent implements OnInit {
  selectedId: any;
  selectedName: any;
  table_searchFields:any[]=[];
  // viewData: any = [];
  representatives: any = [];
  columns_list: any = [];
  viewData:any = [
    { id: '1', fileName: 'Manual.doc', fileDetails: '24kb',createdBy:'' },
    { id: '2', fileName: 'Bot_data.doc', fileDetails: '224kb',createdBy:'' },
  ];
  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private columnList: columnList,
    ) { 
      this.route.queryParams.subscribe((data)=>{
        this.selectedId = data.id;
        this.selectedName = data.name
      })
    }

  ngOnInit(): void {
    this.columns_list = this.columnList.view_cutomer_support_bot_coloumns

  }

  backToManageBot(){
      this.router.navigate(["/pages/admin/manage-customer-bot"], {
      });
    }

    readSelectedData(data){

    }

    viewDetails(event){

    }

    deleteById(event){

    }
}
