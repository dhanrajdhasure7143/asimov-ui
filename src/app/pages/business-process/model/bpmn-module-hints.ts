export class BpsHints{
    public bpsHomeHints = [
        { selector:'#upload_bpmn', description:'Drag/Drop or Upload BPMN File', showNext:true },
        { selector:'#create_bpmn', description:'Create BPMN diagram', showNext:true },
        { selector:'#bpmn_list', description:'List of saved BPMN files for user', showNext:true },
        { selector:'#bpmn_list_item0', event:'click', description:'Click on each record to display it as diagram' },
        { selector:'.diagram_container0', description:'BPMN Diagram of the clicked record' },
      ];
}