import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-vcm',
  templateUrl: './view-vcm.component.html',
  styleUrls: ['./view-vcm.component.css']
})
export class ViewVcmComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  createVcm(){
    this.router.navigate(['/pages/vcm/create-vcm']);
  }

}
