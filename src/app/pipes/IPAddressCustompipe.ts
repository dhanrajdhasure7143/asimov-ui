import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ipcustompipe'
})
export class ipcustompipecreation implements PipeTransform {
    public countD:number = 0;
    public str: any;
    public str1: any;
    public str2: any;  
    public hostadd:any=[];
    transform(value: any): any {
    var ip = value;
    this.str ='';
    this.str1 ='';
    this.str2 =''; 
    this.countD = 0;
    for( let i=0;i<ip.length;i++)
    {
      if( this.countD < 3){
        this.str = (ip.charCodeAt(i) != 46 ? '*':'.');
        this.str1 = this.str1+ this.str;
        if(ip.charCodeAt(i) == 46 ){
          this.countD++;
        }
      }
      else
      {
        this.str2 = this.str2+ip[i];
      }
    }
    this.hostadd = this.str1+ this.str2;
    
    return this.hostadd;
  }

}
