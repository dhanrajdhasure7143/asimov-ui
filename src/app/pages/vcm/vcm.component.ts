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
    console.log(this.router.url);
    if(this.router.url == '/pages/vcm/properties?level=level1' || this.router.url == '/pages/vcm/properties?level=level2')
    {
    this.router.navigate(['/pages/vcm/create-vcm']); 
    sessionStorage.removeItem('vcmTree');
    }
  }

}
