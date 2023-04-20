import { Component, NgZone, OnInit,ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { SplitComponent } from 'angular-split';

@Component({
  selector: 'app-split-overlay',
  templateUrl: './split-overlay.component.html',
  styleUrls: ['./split-overlay.component.css']
})
export class SplitOverlayComponent implements OnInit {
  public areas = [
    { size: 50, order: 1 },
    { size: 50, order: 2 },
  ];
  isShowExpand: boolean = false;
  splitAreamin_size = "500";
  area_splitSize: any = {};
  @ViewChild("splitEl") splitEl: SplitComponent;
  @Output() closeOverlay:any= new EventEmitter<boolean>();

  constructor(private ngZone: NgZone) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.splitEl.dragProgress$.subscribe((x:any) => {
        this.ngZone.run(() => {
          this.area_splitSize = x;
          this.isShowExpand = false;
          if (x.sizes[1] < 50) {
            this.splitAreamin_size = "500";
          }
        });
      });
    }, 1000);
  }


  minimizeFullScreen() { // to minimize the full view for the overlay
    this.isShowExpand = false;
    this.splitAreamin_size = "500";
    this.areas = [
      { size: 50, order: 1 },
      { size: 50, order: 2 },
    ];
  }
  
  expandFullScreen() { // to view the full view for the overlay
    this.isShowExpand = true;
    this.splitAreamin_size = "null";
    this.areas = [
      { size: 0, order: 1 },
      { size: 100, order: 2 },
    ];
  }
  
  onDragEnd(e: { gutterNum: number; sizes: number[] }) {  // ondrag the splitter
    this.areas[0].size = e.sizes[0];
    this.areas[1].size = e.sizes[1];
    if (e.sizes[1] < 50) {
      this.splitAreamin_size = "500";
    } else {
      this.splitAreamin_size = "null";
    }
  }

  closeSplitOverlay(){ // close the splitter overlay
    this.minimizeFullScreen();
    this.closeOverlay.emit(false)
  }
  

}
