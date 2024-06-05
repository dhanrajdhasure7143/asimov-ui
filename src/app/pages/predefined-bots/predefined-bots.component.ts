import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-predefined-bots',
  templateUrl: './predefined-bots.component.html',
  styleUrls: ['./predefined-bots.component.css']
})
export class PredefinedBotsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

    setTimeout(() => {
      const iframe = document.getElementById('iframeRef') as HTMLIFrameElement;
      if(iframe){
        console.log("testing.........iframe enabled")
      iframe.contentWindow.postMessage({ action: 'botKey', bot_key: environment.ezChatBotKey,accesstoken:localStorage.getItem("accessToken") }, '*');
      }
    }, 2000);
    
    window.addEventListener('message', event => {
      const message = event.data;
      const iframe = document.getElementById('iframeRef') as HTMLIFrameElement;
      if(iframe){
          iframe.style.height = message.height;
          iframe.style.width = message.width;
      }
  });

}

}
