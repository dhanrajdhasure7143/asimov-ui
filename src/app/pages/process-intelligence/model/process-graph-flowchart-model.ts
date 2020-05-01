export class ProcessGraphModel{

    public flowchartData=[{41:{"nodeDataArraycase": [{
        "key": -1,
        "name": "Start"
        },
        {
        "key": 0,
        "name": "Vendor Creates Invoice",
        "count": 80,
        "linkArray": ["Scan Invoice"],
        "tool": ["Absolute Frequency", "Case Frequency", "Max Repititons", "Start Frequency", "End Frequency", "Throughput", "Frequency", "Max Repititons"],
        "toolCount": [1, 342, 58, 40, 40, 91, 42, 58]
        },
        {
        "key": 1,
        "name": "Scan Invoice",
        "count": 80,
        "linkArray": ["Clear Invoice"],
        "tool": ["Absolute Frequency", "Case Frequency", "Max Repititons","Start Frequency", "End Frequency", "Throughput", "Frequency", "Max Repititons"],
        "toolCount": [1, 342, 58, 40, 40, 91,24,65]
        },
        {
        "key": 2,
        "name": "Enter in SAP",
        "count": 80,
        "linkArray": ["Due Date Passed"],
        "tool": ["Absolute Frequency", "Case Frequency", "Max Repititons", "Start Frequency", "End Frequency", "Throughput", "Frequency", "Max Repititons"],
        "toolCount": [1, 342, 58, 40, 0, 91, 42, 58]
        },
        {
        "key": 3,
        "name": "Book Invoice",
        "count": 80,
        "linkArray": ["Clear Invoice"],
        "tool": ["Absolute Frequency", "Case Frequency", "Max Repititons", "Start Frequency", "End Frequency", "Throughput", "Frequency", "Max Repititons"],
        "toolCount": [2, 342, 58, 40, 40, 91, 42, 58]
        },
        {
        "key": 4,
        "name": "Clear Invoice",
        "count": 80,
        "linkArray": ["Due Date Passed"],
        "tool": ["Absolute Frequency", "Case Frequency", "Max Repititons", "Start Frequency", "End Frequency", "Throughput", "Frequency", "Max Repititons"],
        "toolCount": [2, 342, 58, 0, 40, 91, 42, 58]
        },
        {
        "key": 5,
        "name": "Due Date Passed",
        "count": 80,
        "linkArray": [],
        "tool": ["Absolute Frequency", "Case Frequency", "Max Repititons", "Start Frequency", "End Frequency", "Throughput", "Frequency", "Max Repititons"],
        "toolCount": [1, 342, 58, 0, 0, 42, 58, 66]
        },
        {
        "key": -2,
        "name": "End"
        }
        ]
    },
           14:{ "nodeDataArraycase": [{
            "key": -1,
            "name": "Start"
            },
            {
            "key": 0,
            "name": "Vendor Creates Invoice",
            "count": 80,
            "linkArray": ["Scan Invoice", "Book Invoice"],
            "tool": ["Absolute Frequency", "Case Frequency", "Max Repititons","Start Frequency", "End Frequency", "Throughput", "Frequency", "Max Repititons"],
            "toolCount": [1, 342, 58, 40, 40, 91, 42, 58]
            },
            {
            "key": 1,
            "name": "Scan Invoice",
            "count": 80,
            "linkArray": ["Enter in SAP"],
            "tool": ["Absolute Frequency", "Case Frequency", "Max Repititons","Start Frequency", "End Frequency", "Throughput", "Frequency", "Max Repititons"],
            "toolCount": [1, 342, 58, 40, 40, 91,24,65]
            },
            {
            "key": 2,
            "name": "Enter in SAP",
            "count": 80,
            "linkArray": ["Due Date Passed", "Clear Invoice"],
            "tool": ["Absolute Frequency", "Case Frequency", "Max Repititons", "Start Frequency", "End Frequency", "Throughput", "Frequency", "Max Repititons"],
            "toolCount": [1, 342, 58, 40, 0, 91, 42, 58]
            },
            {
            "key": 3,
            "name": "Book Invoice",
            "count": 80,
            "linkArray": ["Clear Invoice"],
            "tool": ["Absolute Frequency", "Case Frequency", "Max Repititons", "Start Frequency", "End Frequency", "Throughput", "Frequency", "Max Repititons"],
            "toolCount": [2, 342, 58, 40, 40, 91, 42, 58]
            },
            {
            "key": 4,
            "name": "Clear Invoice",
            "count": 80,
            "linkArray": ["Book Invoice"],
            "tool": ["Absolute Frequency", "Case Frequency", "Max Repititons", "Start Frequency", "End Frequency", "Throughput", "Frequency", "Max Repititons"],
            "toolCount": [2, 342, 58, 0, 40, 91, 42, 58]
            },
            {
            "key": 5,
            "name": "Due Date Passed",
            "count": 80,
            "linkArray": [],
            "tool": ["Absolute Frequency", "Case Frequency", "Max Repititons", "Start Frequency", "End Frequency", "Throughput", "Frequency", "Max Repititons"],
            "toolCount": [1, 342, 58, 0, 0, 42, 58, 66]
            },
            {
            "key": -2,
            "name": "End"
            }
            ]
           },
    
           13:{ "nodeDataArraycase": [{
            "key": -1,
            "name": "Start"
            },
            {
            "key": 0,
            "name": "Vendor Creates Invoice",
            "count": 80,
            "linkArray": [ "Book Invoice"],
            "tool": ["Absolute Frequency", "Case Frequency", "Max Repititons", "Start Frequency","End Frequency", "Throughput", "Frequency", "Max Repititons"],
            "toolCount": [20, 342, 58, 40, 40, 91, 42, 58]
            },
            {
            "key": 1,
            "name": "Scan Invoice",
            "count": 80,
            "linkArray": ["Enter in SAP"],
            "tool": ["Absolute Frequency", "Case Frequency", "Max Repititons","Start Frequency", "End Frequency", "Throughput", "Frequency", "Max Repititons"],
            "toolCount": [1, 342, 58, 40, 40, 91,24,65]
            },
            {
            "key": 2,
            "name": "Enter in SAP",
            "count": 80,
            "linkArray": [],
            "tool": ["Absolute Frequency", "Case Frequency", "Max Repititons", "Start Frequency", "End Frequency", "Throughput", "Frequency", "Max Repititons"],
            "toolCount": [21, 342, 58, 40, 0, 91, 42, 58]
            },
            {
            "key": 3,
            "name": "Book Invoice",
            "count": 80,
            "linkArray": ["Clear Invoice"],
            "tool": ["Absolute Frequency", "Case Frequency", "Max Repititons", "Start Frequency", "End Frequency", "Throughput", "Frequency", "Max Repititons"],
            "toolCount": [62, 342, 58, 40, 40, 91, 42, 58]
            },
            {
            "key": 4,
            "name": "Clear Invoice",
            "count": 80,
            "linkArray": [],
            "tool": ["Absolute Frequency", "Case Frequency", "Max Repititons", "Start Frequency", "End Frequency", "Throughput", "Frequency", "Max Repititons"],
            "toolCount": [23, 342, 58, 0, 40, 91, 42, 58]
            },
            {
            "key": 5,
            "name": "Due Date Passed",
            "count": 80,
            "linkArray": [],
            "tool": ["Absolute Frequency", "Case Frequency", "Max Repititons", "Start Frequency", "End Frequency", "Throughput", "Frequency", "Max Repititons"],
            "toolCount": [66, 342, 58, 0, 0, 42, 58, 66]
            },
            {
            "key": -2,
            "name": "End"
            }
            ]
           },
    }];
    
    public data =[
        { case:"case1",casepercent:"41", name:"of Cases", detail:"6 events per case on average", Days:4.60, varaintDetails:"1 of 8 Variant", casesCovred:"41% cases Covered","selected": "inactive"},
        { case:"case2",casepercent:"14", name:"of Cases", detail:"7 events per case on average", Days:3.50, varaintDetails:"2 of 8 Variant", casesCovred:"14% cases Covered","selected": "inactive"},
        { case:"case3",casepercent:"13", name:"of Cases", detail:"7 events per case on average", Days:4.30, varaintDetails:"3 of 8 Variant", casesCovred:"13% cases Covered","selected": "inactive"},
        { case:"case4",casepercent:"12", name:"of Cases", detail:"6 events per case on average", Days:3.00, varaintDetails:"4 of 8 Variant", casesCovred:"12% cases Covered","selected": "inactive"},
        { case:"case5",casepercent:"10", name:"of Cases", detail:"6 events per case on average", Days:4.50, varaintDetails:"5 of 8 Variant", casesCovred:"10% cases Covered","selected": "inactive"},
        { case:"case6",casepercent:"8", name:"of Cases", detail:"5 events per case on average", Days:4.90, varaintDetails:"6 of 8 Variant", casesCovred:"8% cases Covered","selected": "inactive"},
        { case:"case7",casepercent:"1", name:"of Cases", detail:"7 events per case on average", Days:5.10, varaintDetails:"7 of 8 Variant", casesCovred:"1% cases Covered","selected": "inactive"},
        { case:"case8",casepercent:"1", name:"of Cases", detail:"12 events per case on average", Days:61.90, varaintDetails:"8 of 8 Variant", casesCovred:"1% cases Covered","selected": "inactive"}
       ]
    
        public reports = [{cases:20,activities:50,roles:1053,resources:25,started:"06/03/2020",ended:"25/03/2020"}];
    }