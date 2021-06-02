import {ViewChild,Input, Component,Injectable, OnInit, ElementRef  } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { Options } from 'ng5-slider';
import { DataTransferService } from '../../services/data-transfer.service';
@Injectable()
@Component({
  selector: 'app-rpa-toolset',
  templateUrl: './rpa-toolset.component.html',
  styleUrls: ['./rpa-toolset.component.css']
})
export class RpaToolsetComponent implements OnInit {

  constructor(private rest:RestApiService,
    public dt:DataTransferService
    ) { }

  public userFilter:any={name:""};
  @ViewChild('section', {static: false}) section: ElementRef<any>;

  @Input('bot') public botState: any;
  toolSetData:any=[];
  userRole:any;
  templateNodes:any=[];
  search:any=false;
  ngOnInit() {

    this.dt.changeParentModule({"route":"/pages/rpautomation/home", "title":"RPA Studio"});
    this.dt.changeChildModule({"route":"/pages/rpautomation/home","title":"Designer"});
    this.gettoolset();
  }

  options: Options = {
    step:0.1,
    floor: 0,
    ceil: 1,
    // translate: (value: number): string => `${value}%`,
    translate: (value: number): string => `${value*100}`,
    hideLimitLabels: true,
    hidePointerLabels: false,
    vertical: true,
  }
  gettoolset()
  {
        this.toolSetData=[];
        let data1:any = [];

        this.userRole = localStorage.getItem("userRole")
        this.userRole = this.userRole.split(',');
        this.rest.toolSet().subscribe(data => {
          data1 = data
          data1.General.forEach(element => {
            let temp:any = {
              name : element.name,
              path : 'data:' + 'image/png' + ';base64,' + element.icon,
              tasks: element.taskList
            };
            if((this.userRole.includes('User') &&
                  (temp.name === 'Email' || temp.name === 'Excel' || temp.name === 'Database' || temp.name === 'Developer'))
                || !this.userRole.includes('User')){
              this.templateNodes.push(temp)
            }
          })
          if(!this.userRole.includes('User')){
            data1.Advanced.forEach(element => {
              let temp:any = {
                name : element.name,
                path : 'data:' + 'image/png' + ';base64,' + element.icon,
                tasks: element.taskList
              };
              this.templateNodes.push(temp)
            })
          }
        })
    }

    searchclear(){
      this.search=false
      this.userFilter.name=""
     // this.templateNodes=[]
    }

    public scrolltop(){
      this.section.nativeElement.scrollTo({ top: (this.section.nativeElement.scrollTop - 40), behavior: 'smooth' });
    }

    public scrollbottom() {
      this.section.nativeElement.scrollTo({ top: (this.section.nativeElement.scrollTop + 40), behavior: 'smooth' });
    }

  }




