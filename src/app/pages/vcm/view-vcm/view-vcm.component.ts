import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-vcm',
  templateUrl: './view-vcm.component.html',
  styleUrls: ['./view-vcm.component.css']
})
export class ViewVcmComponent implements OnInit {

  vcmProcess:any[];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.vcmProcess = [
      {vcmname:'Value Chain Mapping 1'},{vcmname:'Value Chain Mapping 2'},{vcmname:'Value Chain Mapping 3'},
      {vcmname:'Value Chain Mapping 4'}
    ]
  }

  createVcm(){
    sessionStorage.removeItem('vcmTree');
    this.router.navigate(['/pages/vcm/create-vcm']);
  }

}
