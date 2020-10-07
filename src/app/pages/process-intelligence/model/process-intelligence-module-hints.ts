export class PiHints{
    public dataDocumentHints = [
        { selector:'#process_data', description:'Uploaded file data', showNext:true },
        { selector:'#search_process_data', description:'Search Process Data', showNext:true },
        { selector:'#generateGraph', description:'Proceed to Data Mapping.' },
        { selector:'#process_data1', description:'Case ID, Actvity Resource Mapping'}
      ];

    public dataSelectionHints = [
        { selector:'#DataDocTableForm', description:'Case ID, Actvity Resource Mapping', showNext:true},
        { selector:'#generateGraph1', description:'Click here to generate process graph.' },
    ];

    public processGraphHints = [
        { selector:'#process_graph_list', description:'Select process graphs list', showNext:true },
        { selector:'#myDiagramDiv', description:'Process Graph', showNext:true },
        { selector:'#zoom_in', description:'Zoom In', showNext:true },
        { selector:'#zoom_out', description:'Zoom Out', showNext:true },
        { selector:'#zoom_reset', description:'Reset Zoom', showNext:true },
        { selector:'#variants', description:'Click to filter the metrics', showNext:true },
        { selector:'.down_btn', description:'Click to download process graph', showNext:true },
        { selector:'#play_btn', description:'Click to play process graph', showNext:true },
        //{ selector:'.zoom_label', description:'Zoom selection for process graph', showNext:true },
        { selector:'#act_slider', description:'Activities slider', showNext:true },
        { selector:'#path_slider', description:'Paths slider', showNext:true },
        { selector:'#variant_list', description:'Click here to see the variants', showNext:true },
        //{ selector:'#variant_drpdwn', description:'Select particular variant', showNext:true },
        //{ selector:'.details_box', description:'Case details list', showNext:true  },
        { selector:'#kpi_btn', description:'Click to view KPI', showNext:true  },
        { selector:'#generate_btn', description:'Click to generate BPMN' }
      ];

    public uploadHints = [
        { selector:'#upload_xl', description:'Upload Excel or CSV File', showNext:true },
        { selector:'#upload_xes', description:'Upload XES file', showNext:true },
        { selector:'#upload_db', description:'Upload DB Event logs', showNext:true },
        { selector:'#my_workspace', description: 'User Workspace', showNext:true},
        { selector:'#download_template', description:'Download Sample Template'}
      ];
}