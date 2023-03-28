import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeHtml'
})
export class SanitizeHtmlPipe implements PipeTransform {

  constructor(private _sanitizer:DomSanitizer) {
  }


  transform(message: any, usersList:any[]) {
    const regex = /\${([^\s}]+@[^\s}]+)}/g;
    const matches = message.match(regex);
    if(matches!=null){
      const emails = matches.map(m => m.replace(regex, "$1"));
      emails.forEach((email:any)=>{
          let user=usersList.find((userItem:any)=>userItem.user_email==email);
          message=message.replace("${"+email+"}", `<span class='icon-color'>${user.fullName}</span>`);
      })
    }
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    if(message)
      message=message.replace(urlRegex, function(url) {
        return '<a class="icon-color" href="' + url + '" target="_blank">' + url + '</a>';
      })
    return this._sanitizer.bypassSecurityTrustHtml(message);
  }

  // transform(v:string):SafeHtml {
  //   //return this._sanitizer.bypassSecurityTrustHtml(v);
  // }
}