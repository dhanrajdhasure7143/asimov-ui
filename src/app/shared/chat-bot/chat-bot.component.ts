import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent implements OnInit {
  @Output() closeOverlay:any= new EventEmitter<boolean>();
  // buttonsHTML:any=[];
  constructor() { }
  
  payload = [
    {
      "uuid":"text_uuid1",
      "message":"This is sample text response"
    },
    {
      "uuid":"text_uuid2",
      "message":["This is sample text response"]
    },
    {
      "uuid":"text_uuid3",
      "message":[" <b>This</b> is sample text response2, <a href='wwww.epsoftinc.com'> click here </a>" ]
    }
  ];
  response: any[] = [
    {
      "uuid": "text_uuid1",
      "message": "This is sample text response",
      "components": ["Buttons"],
      "values": [
        [
          {
            "label": "button label",
            "submitValue": "submit value"
          },
          {
            "label": "button label2",
            "submitValue": "submit value2"
          }
        ]
      ]
    },
    {
      "uuid": "text_uuid2",
      "message": ["This is sample text response2"],
      "components": ["Buttons"],
      "values": [
        [
          {
            "label": "button label"
          },
          {
            "label": "button label2"
          }
        ]
      ]
    }
  ];
  ngOnInit(): void {
//   const payload = [
//     {
//       "uuid": "text_uuid1",
//       "message": "This is sample text response",
//       "components": ["Buttons"],
//       "values": [
//         [
//           {
//             "label": "button label",
//             "submitValue": " submit value"
//           },
//           {
//             "label": "button label2",
//             "submitValue": " submit value2"
//           }
//         ]
//       ]
//     },
//     {
//       "uuid": "text_uuid2",
//       "message": ["This is sample text response", "This is sample text response2"],
//       "components": ["Buttons"],
//       "values": [
//         [
//           {
//             "label": "button label"
//           },
//           {
//             "label": "button label2"
//           }
//         ]
//       ]
//     }
//   ];

// payload.forEach(item => {
//   if (item.components.includes("Buttons")) {
//     const buttonsHTML = item.values[0].map(button => {
//       this.buttonsHTML = button.label;
//       // const submitValue = button.submitValue || "";
//       // return `<button type="button" >${buttonsHTML}</button>`;
//     }).join('');
//   }
// });

}

  closeSplitOverlay(){ 
    this.closeOverlay.emit(false)
  }
}
