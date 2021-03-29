export class BpsHints{
    public bpsHomeHints = [
        { selector:'#upload_bpmn', description:'Drag/Drop or Upload BPMN/CMMN/DMN File', showNext:true },
        { selector:'#create_bpmn-box', description:'Create BPMN/CMMN/DMN notation', showNext:true },
        { selector:'#bpmn_list', description:'List of saved BPMN/CMMN/DMN files for user', showNext:true },
        { selector:'#bpmn_list_item0', event:'click', description:'Click on each notation to preview' },
        { selector:'.diagram_container0', description:'BPMN/CMMN/DMN notation of the clicked record' }
      ];

      public bpsUploadHints = [
        { selector:'#bpmnNotationList', description:'List of saved BPMN/CMMN/DMN notations', showNext:true },
        { selector:'#approversList', description:'List of approvers', showNext:true },
        { selector:'#canvas1', description:'BPMN/CMMN/DMN workspace to create/edit notations', showNext:true },
        // { selector:'.djs-palette-entries', description:'Tool kit for generating BPMN Diagrams' , showNext:true },
        { selector:'#download', description:'Click to download selected format of opened BPMN/CMMN/DMN notation' , showNext:true },
        { selector:'#automate', description:'Click to automate the opened BPMN/CMMN/DMN notation' , showNext:true },
        { selector:'#save', description:'Click to save the opened BPMN/CMMN/DMN notation' , showNext:true },
        // { selector:'.upload_again_btn', description:'Click to upload the opened BPMN/CMMN/DMN notation' , showNext:true },
        { selector:'#approvalSubmit', description:'Click to save and submit the opened BPMN/CMMN/DMN notation for approval to selected approver' }
      ];

      public bpsCreateHints = [
        { selector:'#bpmnNotationList', description:'List of saved BPMN/CMMN/DMN notations', showNext:true },
        { selector:'#approversList', description:'List of approvers', showNext:true },
        { selector:'#canvas', description:'BPMN/CMMN/DMN workspace to create/edit diagrams', showNext:true },
        // { selector:'.djs-palette-entries', description:'Tool kit for generating BPMN Diagrams' , showNext:true },
        { selector:'#download', description:'Click to download the opened BPMN/CMMN/DMN notation' , showNext:true },
        { selector:'#automate', description:'Click to automate the opened BPMN/CMMN/DMN notation' , showNext:true },
        { selector:'#save', description:'Click to save the opened BPMN/CMMN/DMN notation' , showNext:true },
        { selector:'#approvalSubmit', description:'Click to save and submit the opened BPMN/CMMN/DMN notation for approval to selected approver' }
      ];
}