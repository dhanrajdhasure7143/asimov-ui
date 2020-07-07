export class BpsHints{
    public bpsHomeHints = [
        { selector:'#upload_bpmn', description:'Drag/Drop or Upload BPMN File', showNext:true },
        { selector:'#create_bpmn', description:'Create BPMN diagram', showNext:true },
        { selector:'#bpmn_list', description:'List of saved BPMN files for user', showNext:true },
        { selector:'#bpmn_list_item0', event:'click', description:'Click on each record to display it as diagram' },
        { selector:'.diagram_container0', description:'BPMN Diagram of the clicked record' }
      ];

      public bpsUploadHints = [
        { selector:'#bpmnNotationList', description:'List of saved BPMN Diagrams', showNext:true },
        { selector:'#approversList', description:'List of approvers', showNext:true },
        { selector:'#canvas1', description:'BPMN workspace to create/edit diagrams', showNext:true },
        // { selector:'.djs-palette-entries', description:'Tool kit for generating BPMN Diagrams' , showNext:true },
        { selector:'#download', description:'Click to download the opened BPMN Diagram' , showNext:true },
        { selector:'#automate', description:'Click to automate the opened BPMN Diagram' , showNext:true },
        { selector:'#save', description:'Click to save the opened BPMN Diagram' , showNext:true },
        // { selector:'.upload_again_btn', description:'Click to upload the opened BPMN Diagram' , showNext:true },
        { selector:'#approvalSubmit', description:'Click to save and submit the opened BPMN Diagram for approval to selected approver' }
      ];

      public bpsCreateHints = [
        { selector:'#bpmnNotationList', description:'List of saved BPMN Diagrams', showNext:true },
        { selector:'#approversList', description:'List of approvers', showNext:true },
        { selector:'#canvas', description:'BPMN workspace to create/edit diagrams', showNext:true },
        // { selector:'.djs-palette-entries', description:'Tool kit for generating BPMN Diagrams' , showNext:true },
        { selector:'#download', description:'Click to download the opened BPMN Diagram' , showNext:true },
        { selector:'#automate', description:'Click to automate the opened BPMN Diagram' , showNext:true },
        { selector:'#save', description:'Click to save the opened BPMN Diagram' , showNext:true },
        // { selector:'.upload_again_btn', description:'Click to upload the opened BPMN Diagram' , showNext:true },
        { selector:'#approvalSubmit', description:'Click to save and submit the opened BPMN Diagram for approval to selected approver' }
      ];
}