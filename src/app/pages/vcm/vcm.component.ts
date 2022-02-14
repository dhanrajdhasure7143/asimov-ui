import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vcm',
  templateUrl: './vcm.component.html',
  styleUrls: ['./vcm.component.css']
})
export class VcmComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.navigate(['/pages/vcm/create-vcm']);
    sessionStorage.removeItem('vcmTree');
  }

}
