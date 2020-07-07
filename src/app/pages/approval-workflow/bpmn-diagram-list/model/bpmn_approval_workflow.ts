export  class ApprovalHomeHints{
    public bpsApprovalHomeHints = [
        { selector:'#bpmn_list', description:'List of saved BPMN files for user', showNext:true },
        { selector:'#bpmn_list_item1', event:'click', description:'Click on each record to display it as diagram' },
        { selector:'.diagram_container1', description:'BPMN Diagram of the clicked record' }
      ];
}