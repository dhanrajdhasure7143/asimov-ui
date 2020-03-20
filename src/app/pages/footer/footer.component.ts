import { Component, OnInit } from '@angular/core';
import { DataTransferService } from '../services/data-transfer.service';

import 'Kinetic';
import '../../../enjoyhint/src/jquery.enjoyhint.js';

declare var EnjoyHint: any; 

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  hints;

  constructor(private dt:DataTransferService) { }

  ngOnInit() {
    this.dt.current_hints.subscribe( res => this.hints = res);
  }

  showHint(){
    let enjoyhint_instance = new EnjoyHint({});
    enjoyhint_instance.setScript(this.hints);
    enjoyhint_instance.runScript();
  }

}
