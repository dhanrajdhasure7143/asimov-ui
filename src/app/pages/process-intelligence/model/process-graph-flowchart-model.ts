export class ProcessGraphModel{
    public model1 = [
        {"key":-1, "loc":"455 -150", "category":"Start"},
        {"key":0,  "loc":"390 -65", "name":"Shopping",  tool:["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency"],toolCount:[1,342,58,40,40],count:20,clickCount: 0,"selected": "inactive" },
        {"key":1, "loc":"253 12", "name":"Browse Items",tool:["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency"],toolCount:[1,342,58,40,40],count:40,clickCount: 0,"selected": "inactive" },
        {"key":2, "loc":"253 146", "name":"Search Items",tool:["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency"],toolCount:[1,342,58,40,40],count:80,clickCount: 0,"selected": "inactive" },
        {"key":3, "loc":"412 112", "name":"View Item",  tool:["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency"],toolCount:[1,342,58,40,40],count:50,clickCount: 0,"selected": "inactive"},
        {"key":4, "loc":"561 -17", "name":"View Cart",  tool:["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency"],toolCount:[1,342,58,40,40],count:10,clickCount: 0,"selected": "inactive"},
        {"key":5, "loc":"494 171", "name":"Update Cart",tool:["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency"],toolCount:[1,342,58,40,40],count:5,clickCount: 0,"selected": "inactive"},
        {"key":6, "loc":"650 66", "name":"Checkout",    tool:["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency"],toolCount:[1,342,58,40,40],count:80,clickCount: 0,"selected": "inactive"},
        {"key":-2, "loc":"717 160", "category":"End"}
    ];

    public model2 = [
        { "from": -1, "to": 0,"curviness": 0 },
        { "from": 0, "to": 1,  "progress": "true", "text": 20 },
        { "from": 0, "to": 2,  "progress": "true", "text": 40 },
        { "from": 1, "to": 2,  "progress": "true", "text": 60 },
        { "from": 2, "to": 3,  "progress": "true", "text": 80 },
        { "from": 2, "to": 2,  "text": 65, "curviness": 20},
        { "from": 3, "to": 0,  "text": 10},
        { "from": 3, "to": 4,  "progress": "true","text": 7 },
        { "from": 4, "to": 6,  "text": 85, },
        { "from": 4, "to": 5,  "text": 22, "curviness": 0 },
        { "from": 6, "to": 5,  "text": 13 },
        { "from": 6, "to":-2,"curviness": 0},
      ];

      public data = [{ case:69, name:"of Cases", detail:"130 events per case on avarage", hours:72.00,varaintDetails:"5 of 25 Varaint",casesCovred:"80% cases Covered"},
      { case:82, name:"of Cases", detail:"160 events per case on avarage", hours:72.00,varaintDetails:"8 of 25 Varaint",casesCovred:"20% cases Covered"},
      { case:79, name:"of Cases", detail:"1130 events per case on avarage", hours:12.00,varaintDetails:"89 of 125 Varaint",casesCovred:"23% cases Covered"},
      { case:29, name:"of Cases", detail:"123 events per case on avarage", hours:32.00,varaintDetails:"35 of 225 Varaint",casesCovred:"80% cases Covered"},
      { case:19, name:"of Cases", detail:"130 events per case on avarage", hours:42.00,varaintDetails:"12 of 25 Varaint",casesCovred:"63% cases Covered"},
      { case:99, name:"of Cases", detail:"1389 events per case on avarage", hours:62.00,varaintDetails:"5 of 25 Varaint",casesCovred:"89% cases Covered"},
      { case:89, name:"of Cases", detail:"1389 events per case on avarage", hours:82.00,varaintDetails:"21 of 25 Varaint",casesCovred:"82% cases Covered"},
      { case:69, name:"of Cases", detail:"138 events per case on avarage", hours:78.00,varaintDetails:"3 of 25 Varaint",casesCovred:"35% cases Covered"},
      { case:81, name:"of Cases", detail:"10 events per case on avarage", hours:55.00,varaintDetails:"8 of 25 Varaint",casesCovred:"98% cases Covered"},
      { case:25, name:"of Cases", detail:"140 events per case on avarage", hours:64.00,varaintDetails:"8 of 25 Varaint",casesCovred:"12% cases Covered"},
      { case:55, name:"of Cases", detail:"90 events per case on avarage", hours:78.00,varaintDetails:"20 of 25 Varaint",casesCovred:"32% cases Covered"},
      { case:43, name:"of Cases", detail:"130 events per case on avarage", hours:63.00,varaintDetails:"5 of 25 Varaint",casesCovred:"69% cases Covered"},
      { case:12, name:"of Cases", detail:"130 events per case on avarage", hours:89.00,varaintDetails:"5 of 25 Varaint",casesCovred:"78% cases Covered"},
      { case:76, name:"of Cases", detail:"130 events per case on avarage", hours:12.00,varaintDetails:"5 of 25 Varaint",casesCovred:"12% cases Covered"},
      { case:32, name:"of Cases", detail:"130 events per case on avarage", hours:180.00,varaintDetails:"5 of 25 Varaint",casesCovred:"36% cases Covered"},
    ];

    public inactive_data = [
        { case:22, name:"of Cases", detail:"130 events per case on avarage", hours:52.00,varaintDetails:"4 of 25 Varaint",casesCovred:"80% cases Covered"},
        { case:69, name:"of Cases", detail:"130 events per case on avarage", hours:32.00,varaintDetails:"3 of 25 Varaint",casesCovred:"80% cases Covered"},
        { case:12, name:"of Cases", detail:"130 events per case on avarage", hours:72.00,varaintDetails:"105 of 125 Varaint",casesCovred:"80% cases Covered"},
        { case:76, name:"of Cases", detail:"130 events per case on avarage", hours:52.00,varaintDetails:"6 of 25 Varaint",casesCovred:"80% cases Covered"},
        { case:25, name:"of Cases", detail:"130 events per case on avarage", hours:32.00,varaintDetails:"6 of 125 Varaint",casesCovred:"80% cases Covered"},
        { case:55, name:"of Cases", detail:"130 events per case on avarage", hours:22.00,varaintDetails:"21 of 25 Varaint",casesCovred:"80% cases Covered"},
    ];

    public active_data = [
        { case:12, name:"of Cases", detail:"130 events per case on avarage", hours:52.00,varaintDetails:"4 of 25 Varaint",casesCovred:"90% cases Covered"},
        { case:79, name:"of Cases", detail:"120 events per case on avarage", hours:2.00,varaintDetails:"3 of 25 Varaint",casesCovred:"8% cases Covered"},
        { case:62, name:"of Cases", detail:"110 events per case on avarage", hours:92.00,varaintDetails:"23 of 25 Varaint",casesCovred:"60% cases Covered"},
        { case:46, name:"of Cases", detail:"30 events per case on avarage", hours:122.00,varaintDetails:"9 of 25 Varaint",casesCovred:"55% cases Covered"},
        { case:53, name:"of Cases", detail:"160 events per case on avarage", hours:342.00,varaintDetails:"6 of 25 Varaint",casesCovred:"25% cases Covered"},
        { case:50, name:"of Cases", detail:"190 events per case on avarage", hours:98.00,varaintDetails:"6 of 25 Varaint",casesCovred:"63% cases Covered"},
    ];

    public reports = [{cases:20,activities:50,roles:1053,resources:25,started:"06/03/2020",ended:"25/03/2020"}];
}