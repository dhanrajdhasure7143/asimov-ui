import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-ai-agents',
  templateUrl: './ai-agents.component.html',
  styleUrls: ['./ai-agents.component.css']
})
export class AiAgentsComponent implements OnInit {
  chatBotUrl:SafeResourceUrl
  constructor(private sanitizer: DomSanitizer) {
    const dynamicUrl = environment.ezaskUrl;
    this.chatBotUrl = this.sanitizer.bypassSecurityTrustResourceUrl(dynamicUrl);
  }

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
