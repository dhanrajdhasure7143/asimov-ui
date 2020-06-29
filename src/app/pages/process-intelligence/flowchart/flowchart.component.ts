import { Component, OnInit, AfterViewInit,ViewChild,EventEmitter,ElementRef, Renderer2,Output ,HostListener} from '@angular/core';
import { Options } from 'ng5-slider';
import { Router, ActivatedRoute } from '@angular/router';
import { ZoomSlider } from '../../../zoomSlider';
import { ProcessGraphModel } from '../model/process-graph-flowchart-model';
import { DataTransferService } from '../../services/data-transfer.service';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { PiHints } from '../model/process-intelligence-module-hints';
import { createLoweredSymbol, ThrowStmt } from '@angular/compiler';
import { NgControl } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { RestApiService } from '../../services/rest-api.service';
import Swal from 'sweetalert2';
import { Location} from '@angular/common'

enum ProcessGraphList {
  'Accounts_payable_04-07-2020',
  'Accounts_payable_03-07-2020',
  'Accounts_payable_02-07-2020',
  'Accounts_payable_01-07-2020'
}

enum VariantList {
  'Most Common',
  'Least Common',
  'Fastest Throughput',
  'Slowest Throughput'
}

@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.css'],
  providers: [ProcessGraphModel]
})
export class FlowchartComponent implements OnInit {
  // @ViewChild('toggleButton') toggleButton: ElementRef;

  public select_varaint: any = 0;
  public model1;
  public model2;
  // public mymodel= this.pgModel.testdata[0].nodeDataArraycase1;
  public data = (this.pgModel.data);
  public reports = this.pgModel.reports;
  public filterLength: number;
  public dataValues: any[];
  public varaint_data: any=[];
  public rangevalue: any;
  pathvalue: number = 0;
  public isplay: boolean = false;
  isselected: number;
  activityValue: number = 0;
  public checkboxValue: boolean = false;
  public selectedCaseArry: any[];
  public isfrequency: boolean = false;
  public caselength: number;
  public isdownload: boolean = false;
  public isDefaultData: boolean = true;
  public nodeArray: any[];
  public linkdata: any;
  public arrayLink: any;
  linkData = [];
  linkdataArray = [];
  public nestedArray:any[]=[];
  options: Options = {
    floor: 0,
    ceil: 100,
    translate: (value: number): string => `${value}%`,
    hideLimitLabels: false,
    hidePointerLabels: true,
    vertical: true,
  }
  process_graph_list:any=[];
  process_graph_options;
  variant_list_options;
  variant_list;
  public isfrequencymetrics:boolean=false;
  public isperformancemetrics:boolean=false;
  fullgraph:any;
  graphIds:any;
  isvaraintPlay:boolean=false;
  varaint_GraphData:any=[];
  varaint_GraphDataArray:any[]=[];
  piIdNumber:any;
  public isedgespinner:boolean=false;
  spinMetrics0:any="absoluteFrequency";
  wpiIdNumber:any;
  startLinkvalue:boolean;
  @ViewChild("toogleBtn",{static: false}) toogleBtn;
  

  testVariant={
    "status": 4200,
    "message": "Inserted To Reddis Successfully.",
    "data": [
        {
            "case0": {
                "nodeDataArraycase": [
                    {
                        "key": -1,
                        "category": "Start",
                        "count": 80
                    },
                    {
                        "key": 0,
                        "name": "Vendor Creates Invoice",
                        "traceNo": -1632194889,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Scan Invoice",
                                "traceNumber": -1632194889,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    80,
                                    80,
                                    1,
                                    0,
                                    0,
                                    3605280000,
                                    44610000,
                                    45066000,
                                    85560000,
                                    10200000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            80,
                            80,
                            1,
                            80,
                            0,
                            180000000,
                            2310000,
                            2250000,
                            3300000,
                            780000
                        ]
                    },
                    {
                        "key": 1,
                        "name": "Scan Invoice",
                        "traceNo": -1632194889,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Enter in SAP",
                                "traceNumber": -1632194889,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    26,
                                    26,
                                    1,
                                    0,
                                    0,
                                    12967020000,
                                    420000,
                                    498731538,
                                    5962500000,
                                    240000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            80,
                            80,
                            1,
                            0,
                            0,
                            35520000,
                            420000,
                            444000,
                            600000,
                            360000
                        ]
                    },
                    {
                        "key": 2,
                        "name": "Enter in SAP",
                        "traceNo": -1632194889,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Book Invoice",
                                "traceNumber": -1632194889,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    80,
                                    80,
                                    1,
                                    0,
                                    0,
                                    16017120000,
                                    73320000,
                                    200214000,
                                    1509840000,
                                    2160000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            80,
                            80,
                            1,
                            0,
                            0,
                            60480000,
                            540000,
                            756000,
                            1800000,
                            60000
                        ]
                    },
                    {
                        "key": 3,
                        "name": "Book Invoice",
                        "traceNo": -1632194889,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Clear Invoice",
                                "traceNumber": -1632194889,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    26,
                                    26,
                                    1,
                                    0,
                                    0,
                                    1092180000,
                                    2940000,
                                    42006923,
                                    507840000,
                                    360000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            80,
                            80,
                            1,
                            0,
                            0,
                            83040000,
                            810000,
                            1038000,
                            1920000,
                            360000
                        ]
                    },
                    {
                        "key": 4,
                        "name": "Clear Invoice",
                        "traceNo": -1632194889,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Due Date Passed",
                                "traceNumber": -1632194889,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    80,
                                    80,
                                    1,
                                    0,
                                    0,
                                    18776640000,
                                    29490000,
                                    234708000,
                                    1433580000,
                                    3300000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            80,
                            80,
                            1,
                            0,
                            0,
                            303840000,
                            510000,
                            3798000,
                            17220000,
                            120000
                        ]
                    },
                    {
                        "key": 5,
                        "name": "Due Date Passed",
                        "traceNo": -1632194889,
                        "count": 80,
                        "linkArray": [],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            80,
                            80,
                            1,
                            0,
                            80,
                            108960000,
                            1260000,
                            1362000,
                            2160000,
                            600000
                        ]
                    },
                    {
                        "key": -2,
                        "category": "End",
                        "count": 80
                    }
                ]
            },
            "case1": {
                "nodeDataArraycase": [
                    {
                        "key": -1,
                        "category": "Start",
                        "count": 80
                    },
                    {
                        "key": 0,
                        "name": "Vendor Creates Invoice",
                        "traceNo": -626246640,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Scan Invoice",
                                "traceNumber": -626246640,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    30,
                                    30,
                                    1,
                                    0,
                                    0,
                                    1294440000,
                                    36000000,
                                    43148000,
                                    88140000,
                                    15660000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            30,
                            30,
                            1,
                            30,
                            0,
                            25560000,
                            540000,
                            852000,
                            2160000,
                            420000
                        ]
                    },
                    {
                        "key": 1,
                        "name": "Scan Invoice",
                        "traceNo": -626246640,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Enter in SAP",
                                "traceNumber": -626246640,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    8,
                                    8,
                                    1,
                                    0,
                                    0,
                                    200760000,
                                    480000,
                                    25095000,
                                    197880000,
                                    240000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            30,
                            30,
                            1,
                            0,
                            0,
                            98040000,
                            600000,
                            3268000,
                            7500000,
                            300000
                        ]
                    },
                    {
                        "key": 2,
                        "name": "Enter in SAP",
                        "traceNo": -626246640,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Book Invoice",
                                "traceNumber": -626246640,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    30,
                                    30,
                                    1,
                                    0,
                                    0,
                                    2730000000,
                                    46260000,
                                    91000000,
                                    326040000,
                                    2580000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            30,
                            30,
                            1,
                            0,
                            0,
                            16080000,
                            180000,
                            536000,
                            2700000,
                            60000
                        ]
                    },
                    {
                        "key": 3,
                        "name": "Book Invoice",
                        "traceNo": -626246640,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Change Baseline Date",
                                "traceNumber": -626246640,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    8,
                                    8,
                                    1,
                                    0,
                                    0,
                                    169920000,
                                    11760000,
                                    21240000,
                                    43800000,
                                    11760000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            30,
                            30,
                            1,
                            0,
                            0,
                            26160000,
                            540000,
                            872000,
                            1980000,
                            360000
                        ]
                    },
                    {
                        "key": 4,
                        "name": "Change Baseline Date",
                        "traceNo": -626246640,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Clear Invoice",
                                "traceNumber": -626246640,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    30,
                                    30,
                                    1,
                                    0,
                                    0,
                                    774000000,
                                    8700000,
                                    25800000,
                                    160260000,
                                    1380000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            30,
                            30,
                            1,
                            0,
                            0,
                            38040000,
                            1440000,
                            1268000,
                            1740000,
                            420000
                        ]
                    },
                    {
                        "key": 5,
                        "name": "Clear Invoice",
                        "traceNo": -626246640,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Due Date Passed",
                                "traceNumber": -626246640,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    8,
                                    8,
                                    1,
                                    0,
                                    0,
                                    160260000,
                                    22080000,
                                    20032500,
                                    24780000,
                                    1560000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            30,
                            30,
                            1,
                            0,
                            0,
                            236400000,
                            9780000,
                            7880000,
                            18360000,
                            480000
                        ]
                    },
                    {
                        "key": 6,
                        "name": "Due Date Passed",
                        "traceNo": -626246640,
                        "count": 80,
                        "linkArray": [],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            30,
                            30,
                            1,
                            0,
                            30,
                            49680000,
                            1020000,
                            1656000,
                            8640000,
                            420000
                        ]
                    },
                    {
                        "key": -2,
                        "category": "End",
                        "count": 80
                    }
                ]
            },
            "case2": {
                "nodeDataArraycase": [
                    {
                        "key": -1,
                        "category": "Start",
                        "count": 80
                    },
                    {
                        "key": 0,
                        "name": "Vendor Creates Invoice",
                        "traceNo": -1744478328,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Due Date Passed",
                                "traceNumber": -1744478328,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    11,
                                    11,
                                    1,
                                    0,
                                    0,
                                    648000000,
                                    62100000,
                                    58909090,
                                    89700000,
                                    4260000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            25,
                            25,
                            1,
                            25,
                            0,
                            47520000,
                            2040000,
                            1900800,
                            3360000,
                            360000
                        ]
                    },
                    {
                        "key": 1,
                        "name": "Due Date Passed",
                        "traceNo": -1744478328,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Scan Invoice",
                                "traceNumber": -1744478328,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    25,
                                    25,
                                    1,
                                    0,
                                    0,
                                    1432920000,
                                    360000,
                                    57316800,
                                    461640000,
                                    180000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            25,
                            25,
                            1,
                            0,
                            0,
                            10800000,
                            420000,
                            432000,
                            780000,
                            240000
                        ]
                    },
                    {
                        "key": 2,
                        "name": "Scan Invoice",
                        "traceNo": -1744478328,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Enter in SAP",
                                "traceNumber": -1744478328,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    11,
                                    11,
                                    1,
                                    0,
                                    0,
                                    2846040000,
                                    94740000,
                                    258730909,
                                    997500000,
                                    17160000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            25,
                            25,
                            1,
                            0,
                            0,
                            14160000,
                            120000,
                            566400,
                            2340000,
                            60000
                        ]
                    },
                    {
                        "key": 3,
                        "name": "Enter in SAP",
                        "traceNo": -1744478328,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Book Invoice",
                                "traceNumber": -1744478328,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    25,
                                    25,
                                    1,
                                    0,
                                    0,
                                    1533540000,
                                    28860000,
                                    61341600,
                                    625980000,
                                    2700000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            25,
                            25,
                            1,
                            0,
                            0,
                            33000000,
                            1320000,
                            1320000,
                            2340000,
                            240000
                        ]
                    },
                    {
                        "key": 4,
                        "name": "Book Invoice",
                        "traceNo": -1744478328,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Change Baseline Date",
                                "traceNumber": -1744478328,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    11,
                                    11,
                                    1,
                                    0,
                                    0,
                                    9297960000,
                                    24060000,
                                    845269090,
                                    4658580000,
                                    900000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            25,
                            25,
                            1,
                            0,
                            0,
                            69960000,
                            1440000,
                            2798400,
                            14940000,
                            300000
                        ]
                    },
                    {
                        "key": 5,
                        "name": "Change Baseline Date",
                        "traceNo": -1744478328,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Clear Invoice",
                                "traceNumber": -1744478328,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    25,
                                    25,
                                    1,
                                    0,
                                    0,
                                    569760000,
                                    24000000,
                                    22790400,
                                    108720000,
                                    0
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            25,
                            25,
                            1,
                            0,
                            0,
                            173340000,
                            1680000,
                            6933600,
                            17820000,
                            60000
                        ]
                    },
                    {
                        "key": 6,
                        "name": "Clear Invoice",
                        "traceNo": -1744478328,
                        "count": 80,
                        "linkArray": [],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            25,
                            25,
                            1,
                            0,
                            25,
                            45060000,
                            1020000,
                            1802400,
                            19380000,
                            0
                        ]
                    },
                    {
                        "key": -2,
                        "category": "End",
                        "count": 80
                    }
                ]
            },
            "case3": {
                "nodeDataArraycase": [
                    {
                        "key": -1,
                        "category": "Start",
                        "count": 80
                    },
                    {
                        "key": 0,
                        "name": "Vendor Creates Invoice",
                        "traceNo": -1984157503,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Due Date Passed",
                                "traceNumber": -1984157503,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    24,
                                    24,
                                    1,
                                    0,
                                    0,
                                    1392060000,
                                    78270000,
                                    58002500,
                                    85140000,
                                    5280000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            24,
                            24,
                            1,
                            24,
                            0,
                            42600000,
                            1620000,
                            1775000,
                            3360000,
                            360000
                        ]
                    },
                    {
                        "key": 1,
                        "name": "Due Date Passed",
                        "traceNo": -1984157503,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Scan Invoice",
                                "traceNumber": -1984157503,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    10,
                                    10,
                                    1,
                                    0,
                                    0,
                                    566400000,
                                    42360000,
                                    56640000,
                                    350400000,
                                    240000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            24,
                            24,
                            1,
                            0,
                            0,
                            8760000,
                            360000,
                            365000,
                            780000,
                            240000
                        ]
                    },
                    {
                        "key": 2,
                        "name": "Scan Invoice",
                        "traceNo": -1984157503,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Enter in SAP",
                                "traceNumber": -1984157503,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    24,
                                    24,
                                    1,
                                    0,
                                    0,
                                    1666020000,
                                    56280000,
                                    69417500,
                                    435060000,
                                    2280000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            24,
                            24,
                            1,
                            0,
                            0,
                            27960000,
                            1680000,
                            1165000,
                            2340000,
                            60000
                        ]
                    },
                    {
                        "key": 3,
                        "name": "Enter in SAP",
                        "traceNo": -1984157503,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Book Invoice",
                                "traceNumber": -1984157503,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    10,
                                    10,
                                    1,
                                    0,
                                    0,
                                    460680000,
                                    1560000,
                                    46068000,
                                    360420000,
                                    240000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            24,
                            24,
                            1,
                            0,
                            0,
                            18360000,
                            450000,
                            765000,
                            1920000,
                            300000
                        ]
                    },
                    {
                        "key": 4,
                        "name": "Book Invoice",
                        "traceNo": -1984157503,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Clear Invoice",
                                "traceNumber": -1984157503,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    24,
                                    24,
                                    1,
                                    0,
                                    0,
                                    3004920000,
                                    78600000,
                                    125205000,
                                    1628820000,
                                    2700000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            24,
                            24,
                            1,
                            0,
                            0,
                            39120000,
                            540000,
                            1630000,
                            12660000,
                            120000
                        ]
                    },
                    {
                        "key": 5,
                        "name": "Clear Invoice",
                        "traceNo": -1984157503,
                        "count": 80,
                        "linkArray": [],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            24,
                            24,
                            1,
                            0,
                            24,
                            57360000,
                            1140000,
                            2390000,
                            17340000,
                            360000
                        ]
                    },
                    {
                        "key": -2,
                        "category": "End",
                        "count": 80
                    }
                ]
            },
            "case4": {
                "nodeDataArraycase": [
                    {
                        "key": -1,
                        "category": "Start",
                        "count": 80
                    },
                    {
                        "key": 0,
                        "name": "Vendor Creates Invoice",
                        "traceNo": -1147616841,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Scan Invoice",
                                "traceNumber": -1147616841,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    20,
                                    20,
                                    1,
                                    0,
                                    0,
                                    812400000,
                                    41370000,
                                    40620000,
                                    88140000,
                                    840000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            20,
                            20,
                            1,
                            20,
                            0,
                            41340000,
                            1890000,
                            2067000,
                            3360000,
                            600000
                        ]
                    },
                    {
                        "key": 1,
                        "name": "Scan Invoice",
                        "traceNo": -1147616841,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Enter in SAP",
                                "traceNumber": -1147616841,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    4,
                                    4,
                                    1,
                                    0,
                                    0,
                                    279660000,
                                    420000,
                                    69915000,
                                    278640000,
                                    180000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            20,
                            20,
                            1,
                            0,
                            0,
                            8820000,
                            450000,
                            441000,
                            660000,
                            240000
                        ]
                    },
                    {
                        "key": 2,
                        "name": "Enter in SAP",
                        "traceNo": -1147616841,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Clear Invoice",
                                "traceNumber": -1147616841,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    20,
                                    20,
                                    1,
                                    0,
                                    0,
                                    5959020000,
                                    73560000,
                                    297951000,
                                    3262920000,
                                    2520000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            20,
                            20,
                            1,
                            0,
                            0,
                            12300000,
                            180000,
                            615000,
                            1980000,
                            60000
                        ]
                    },
                    {
                        "key": 3,
                        "name": "Clear Invoice",
                        "traceNo": -1147616841,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Due Date Passed",
                                "traceNumber": -1147616841,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    4,
                                    4,
                                    1,
                                    0,
                                    0,
                                    160320000,
                                    10890000,
                                    40080000,
                                    135480000,
                                    3060000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            20,
                            20,
                            1,
                            0,
                            0,
                            23460000,
                            1200000,
                            1173000,
                            2340000,
                            180000
                        ]
                    },
                    {
                        "key": 4,
                        "name": "Due Date Passed",
                        "traceNo": -1147616841,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Book Invoice",
                                "traceNumber": -1147616841,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    20,
                                    20,
                                    1,
                                    0,
                                    0,
                                    862620000,
                                    16680000,
                                    43131000,
                                    537420000,
                                    1380000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            20,
                            20,
                            1,
                            0,
                            0,
                            84120000,
                            1410000,
                            4206000,
                            20220000,
                            240000
                        ]
                    },
                    {
                        "key": 5,
                        "name": "Book Invoice",
                        "traceNo": -1147616841,
                        "count": 80,
                        "linkArray": [],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            20,
                            20,
                            1,
                            0,
                            20,
                            145320000,
                            2250000,
                            7266000,
                            21420000,
                            420000
                        ]
                    },
                    {
                        "key": -2,
                        "category": "End",
                        "count": 80
                    }
                ]
            },
            "case5": {
                "nodeDataArraycase": [
                    {
                        "key": -1,
                        "category": "Start",
                        "count": 80
                    },
                    {
                        "key": 0,
                        "name": "Vendor Creates Invoice",
                        "traceNo": -1258767366,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Scan Invoice",
                                "traceNumber": -1258767366,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    15,
                                    15,
                                    1,
                                    0,
                                    0,
                                    706860000,
                                    50400000,
                                    47124000,
                                    83820000,
                                    1260000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            15,
                            15,
                            1,
                            15,
                            0,
                            28980000,
                            2100000,
                            1932000,
                            3300000,
                            480000
                        ]
                    },
                    {
                        "key": 1,
                        "name": "Scan Invoice",
                        "traceNo": -1258767366,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Enter in SAP",
                                "traceNumber": -1258767366,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    3,
                                    3,
                                    1,
                                    0,
                                    0,
                                    458820000,
                                    197700000,
                                    152940000,
                                    260640000,
                                    480000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            15,
                            15,
                            1,
                            0,
                            0,
                            7440000,
                            540000,
                            496000,
                            720000,
                            240000
                        ]
                    },
                    {
                        "key": 2,
                        "name": "Enter in SAP",
                        "traceNo": -1258767366,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Book Invoice",
                                "traceNumber": -1258767366,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    15,
                                    15,
                                    1,
                                    0,
                                    0,
                                    13504200000,
                                    232560000,
                                    900280000,
                                    6687300000,
                                    5040000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            15,
                            15,
                            1,
                            0,
                            0,
                            5760000,
                            120000,
                            384000,
                            1320000,
                            60000
                        ]
                    },
                    {
                        "key": 3,
                        "name": "Book Invoice",
                        "traceNo": -1258767366,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Cancel Invoice Receipt",
                                "traceNumber": -1258767366,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    3,
                                    3,
                                    1,
                                    0,
                                    0,
                                    247680000,
                                    55920000,
                                    82560000,
                                    173400000,
                                    18360000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            15,
                            15,
                            1,
                            0,
                            0,
                            20820000,
                            1500000,
                            1388000,
                            2040000,
                            120000
                        ]
                    },
                    {
                        "key": 4,
                        "name": "Cancel Invoice Receipt",
                        "traceNo": -1258767366,
                        "count": 80,
                        "linkArray": [],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            15,
                            15,
                            1,
                            0,
                            15,
                            36060000,
                            960000,
                            2404000,
                            15900000,
                            300000
                        ]
                    },
                    {
                        "key": -2,
                        "category": "End",
                        "count": 80
                    }
                ]
            },
            "case6": {
                "nodeDataArraycase": [
                    {
                        "key": -1,
                        "category": "Start",
                        "count": 80
                    },
                    {
                        "key": 0,
                        "name": "Vendor Creates Invoice",
                        "traceNo": 1828606658,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Due Date Passed",
                                "traceNumber": 1828606658,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    2,
                                    1,
                                    2,
                                    0,
                                    0,
                                    121380000,
                                    60690000,
                                    60690000,
                                    81180000,
                                    40200000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            2,
                            1,
                            2,
                            1,
                            0,
                            6120000,
                            3060000,
                            3060000,
                            3300000,
                            2820000
                        ]
                    },
                    {
                        "key": 1,
                        "name": "Due Date Passed",
                        "traceNo": 1828606658,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Scan Invoice",
                                "traceNumber": 1828606658,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    2,
                                    1,
                                    2,
                                    0,
                                    0,
                                    420000,
                                    210000,
                                    210000,
                                    240000,
                                    180000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            2,
                            1,
                            2,
                            0,
                            0,
                            780000,
                            390000,
                            390000,
                            480000,
                            300000
                        ]
                    },
                    {
                        "key": 2,
                        "name": "Scan Invoice",
                        "traceNo": 1828606658,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Enter in SAP",
                                "traceNumber": 1828606658,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    2,
                                    1,
                                    2,
                                    0,
                                    0,
                                    330900000,
                                    165450000,
                                    165450000,
                                    325800000,
                                    5100000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            2,
                            1,
                            2,
                            0,
                            0,
                            120000,
                            60000,
                            60000,
                            60000,
                            60000
                        ]
                    },
                    {
                        "key": 3,
                        "name": "Enter in SAP",
                        "traceNo": 1828606658,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Book Invoice",
                                "traceNumber": 1828606658,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    2,
                                    1,
                                    2,
                                    0,
                                    0,
                                    65460000,
                                    32730000,
                                    32730000,
                                    62340000,
                                    3120000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            2,
                            1,
                            2,
                            0,
                            0,
                            1980000,
                            990000,
                            990000,
                            1320000,
                            660000
                        ]
                    },
                    {
                        "key": 4,
                        "name": "Book Invoice",
                        "traceNo": 1828606658,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Clear Invoice",
                                "traceNumber": 1828606658,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    2,
                                    1,
                                    2,
                                    0,
                                    0,
                                    18960000,
                                    9480000,
                                    9480000,
                                    15720000,
                                    3240000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            2,
                            1,
                            2,
                            0,
                            0,
                            1680000,
                            840000,
                            840000,
                            1260000,
                            420000
                        ]
                    },
                    {
                        "key": 5,
                        "name": "Clear Invoice",
                        "traceNo": 1828606658,
                        "count": 80,
                        "linkArray": [
                            {
                                "linkNode": "Vendor Creates Invoice",
                                "traceNumber": 1828606658,
                                "tool": [
                                    "Absolute Frequency",
                                    "Case Frequency",
                                    "Max Repititons",
                                    "Start Frequency",
                                    "End Frequency",
                                    "Total Duration",
                                    "Median Duration",
                                    "Mean Duration",
                                    "Max Duration",
                                    "Min Duration"
                                ],
                                "toolCount": [
                                    1,
                                    1,
                                    1,
                                    0,
                                    0,
                                    4799820000,
                                    4799820000,
                                    4799820000,
                                    4799820000,
                                    4799820000
                                ]
                            }
                        ],
                        "tool": [
                            "Absolute Frequency",
                            "Case Frequency",
                            "Max Repititons",
                            "Start Frequency",
                            "End Frequency",
                            "Total Duration",
                            "Median Duration",
                            "Mean Duration",
                            "Max Duration",
                            "Min Duration"
                        ],
                        "toolCount": [
                            2,
                            1,
                            2,
                            0,
                            1,
                            22620000,
                            11310000,
                            11310000,
                            21120000,
                            1500000
                        ]
                    },
                    {
                        "key": -2,
                        "category": "End",
                        "count": 80
                    }
                ]
            }
        }
    ]
}
    

  constructor(private dt: DataTransferService,
    private router: Router,
    private bpmnservice: SharebpmndiagramService,
    private pgModel: ProcessGraphModel,
    private hints: PiHints,
    private spinner: NgxSpinnerService,
    private rest:RestApiService,
    private route:ActivatedRoute,
    private renderer: Renderer2,
    private location:Location) {  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
      const clickedInside = this.toogleBtn.nativeElement.contains(targetElement);
      if (!clickedInside) {
        this.isedgespinner=false
          // console.log("outside");  
      }else{
        // console.log("Inside");
        // this.isedgespinner= !this.isedgespinner;
      }
  }

  readOutputValueEmitted(val){
    this.startLinkvalue = val;
  }

  

  ngOnInit() {
    this.spinner.show();

    // this.model1 = this.pgModel.defaultmodel.nodeDataArraycase;
    // this.model2 = this.pgModel.defaultmodel.linkarraycase;
    this.dt.changeParentModule({ "route": "/pages/processIntelligence/upload", "title": "Process Intelligence" });
    this.dt.changeChildModule({ "route": "/pages/processIntelligence/flowChart", "title": "Process Graph" });
    this.dt.changeHints(this.hints.processGraphHints);
    // this.varaint_data = this.data;
    this.process_graph_options = ProcessGraphList;
    // this.process_graph_list = Object.keys(ProcessGraphList).filter(val => isNaN(ProcessGraphList[val]));
    this.variant_list_options = VariantList;
    this.variant_list = Object.keys(VariantList).filter(val => isNaN(VariantList[val]));
    this.getAlluserProcessPiIds();
    
    // var piId=localStorage.getItem('piId')
    var piId;
    // this.rest.getfullGraph(piId).subscribe(data=>{this.fullgraph=data
    //   let fullgraphOne=JSON.parse(this.fullgraph.data);
    //   this.model1 = fullgraphOne.allSelectData.nodeDataArraycase
    //   console.log('this.model1',this.model1);
    //   this.model2 = this.flowchartData(this.model1)
    //   let loction=''
    //   for(var i=0;i<this.model1.length;i++){
    //     let loc1=455
    //     let loc2=Math.floor((Math.random()*100))*j
    //     loction=loc1+' '+loc2;
    //     this.model1[i].loc=loction
    //   }
      
     
    //   for(var j=0;j<this.model2.length;j++){
    //     let loc1=-Math.floor((Math.random()*10))
    //     // let loc2=-150+i*70
    //     // loction=loc1+' '+loc2;
    //     this.model2[j].curviness=loc1
    //   }
      
    // })
    this.route.queryParams.subscribe(params => {
      if(params['wpiId']!=undefined){
        this.wpiIdNumber = parseInt(params['wpiId']);
        piId=this.wpiIdNumber;
        this.graphIds = piId;
        setTimeout(() => {
          this.onchangegraphId(piId);
      }, 500);
      }
      if(params['piId']!=undefined){
        this.piIdNumber = parseInt(params['piId']);
        piId=this.piIdNumber;
        this.graphIds = piId;
        setTimeout(() => {
          this.onchangegraphId(piId);
        }, 6*60*1000); //3*60*1000
      }
    });
    
  //   setTimeout(() => {
  //     this.onchangegraphId(piId);
  //   // }, 3*60*1000);
  // }, 300);
    
  }

  ngAfterContentChecked() {
    this.rangevalue = ZoomSlider.rangeValue;
  }
  getAlluserProcessPiIds(){
    this.rest.getAlluserProcessPiIds().subscribe(data=>{this.process_graph_list=data
      console.log('data',data);})
  }
  onchangegraphId(selectedpiId){
    // location.replace("/pages/processIntelligence/flowChart?wpiId="+selectedpiId)
    this.route.queryParams.subscribe(params => {
      let token = params['wpiId'];
      let tokenOne=params['piId']
      if (token) {
          // this.cache.set({t: 't'}, token);
          // window.location.href = this.router.url.split('?')[0];
          let url=this.router.url.split('?')
          this.location.replaceState(url[0]+'?wpiId='+selectedpiId);
          console.log(url[0]+'?wpiId='+selectedpiId); 
      }else{
        let url=this.router.url.split('?')
        // window.location.href = url[0]+'?piId='+selectedpiId;
        this.location.replaceState(url[0]+'?piId='+selectedpiId);

      }
  });

    let piId=selectedpiId
    this.rest.getAllVaraintList(piId).subscribe(data=>{this.varaint_data=data // variant List call
      console.log('this.varaint_data',data);
      
      for(var i=0; i<this.varaint_data.data.length; i++){
          this.varaint_data.data[i].selected= "inactive";
          // this.varaint_data.data[i].days=this.timeConversion(this.varaint_data.data[i].days);
          // console.log( this.varaint_data.data[i].days);
          
      }
      this.onchangeVaraint("0");
      })
      this.rest.getfullGraph(piId).subscribe(data=>{this.fullgraph=data //process graph full data call
        if(this.fullgraph.hasOwnProperty('display_msg')){
          Swal.fire(
            'Oops!',
            'It is Not You it is Us, Please try again after some time',
            'error'
          );
          this.spinner.hide();
        } else{
         let fullgraphOne=this.fullgraph.data;
        //let fullgraphOne=this.gResponse.data;
        // console.log("fullgraphOne",fullgraphOne);

        this.model1 = fullgraphOne.allSelectData.nodeDataArraycase;

        console.log('this.model1',this.model1);
        let loction=''
        for(var i=0;i<this.model1.length;i++){
          if(this.model1[i].key==-1||this.model1[i].key==-2){
            let loc1=530
          let loc2=-150+i*80
          loction=loc1+' '+loc2;
          this.model1[i].loc=loction
          }else{
          let loc1=455
          let loc2=-150+i*80
          loction=loc1+' '+loc2;
          this.model1[i].loc=loction
          }
        }
        
        this.model2 = this.flowchartData(this.model1)
        for(var j=0;j<this.model2.length;j++){
          // for (let [key, value] of Object.entries(this.model2[j])) {
            console.log(this.model2[j].from);

                            // this.model2[j].to ==-1||this.model2[j].to==-2 //conditions
                // this.model2[j].from>0 && this.model2[j].to<0
                // this.model2[j].from ==-2||this.model2[j].to==-2
                if(j==0 && this.model2[j].to>1 ){
                  let loc3=160
                this.model2[j].curviness=loc3
                }else{
            if(this.model2[j].from ==-1||this.model2[j].from==-2){
               if(this.model2[j].from==-1 && this.model2[j].to==0){
                let loc3=0
                this.model2[j].curviness=loc3
              }else{
              let loc3=-25*j
            this.model2[j].curviness=loc3
              }
            }else if(this.model2[j].to ==-1||this.model2[j].to==-2){
              if(this.model2[j].from==this.model1.length-3 && this.model2[j].to==-2){
                let loc3=0
                this.model2[j].curviness=loc3
              }else{
                let loc3=20*j
                this.model2[j].curviness=loc3
              }
                
          }else if(this.model2[j].from+1==this.model2[j].to){
            let loc3=0
            this.model2[j].curviness=loc3
          }else{
              let loc3=30*j
            this.model2[j].curviness=loc3
            }
        }
      }
        console.log(this.model2);
        
        this.spinner.hide();
    }
        });

        
        // this.rest.getvaraintGraph(piId).subscribe(data=>{this.varaint_GraphData=data //variant api call
        // // console.log('varaint_GraphData',JSON.parse(this.varaint_GraphData.data));
        // this.varaint_GraphDataArray=JSON.parse(this.varaint_GraphData.data)
        // console.log('varaint_GraphData',this.varaint_GraphDataArray);
        // })
  }

  onchangeVaraint(datavariant) {
    // console.log("variantdata",datavariant);
    switch (datavariant) {
      case "0":
        // this.varaint_data = this.varaint_dat;
        this.varaint_data.data.sort(function (a, b) {
          return b.casepercent - a.casepercent;
        });
        break;
      case "1":
        // this.varaint_data = this.data;
        this.varaint_data.data.sort(function (a, b) {
          return a.casepercent - b.casepercent;
        });
        break;
      case "2":
        // this.varaint_data = this.data;
        this.varaint_data.data.sort(function (a, b) {
          return a.days - b.days;
        });
        break;
      case "3":
        // this.varaint_data = this.data;
        this.varaint_data.data.sort(function (a, b) {
          return b.days - a.days;
        });
        break;
    }

  }

  slideup() {
    document.getElementById("foot").classList.remove("slide-down");
    document.getElementById("foot").classList.add("slide-up");
  }

  // generateBpmn() {
  //   this.bpmnservice.uploadBpmn("pizza-collaboration.bpmn");
  //   this.router.navigate(['/pages/businessProcess/uploadProcessModel'])
  // }

  // loopTrackBy(index, term) {
  //   return index;
  // }

  caseIdSelect(selectedData, index) {
    this.isplay = false;
    // this.isselected=index;
    // const element = this.pgModel.flowchartData[selectedData.case];
    // this.model1 = element.nodeDataArraycase;
    // this.model2 = element.linkarraycase;

    // console.log("data1", selectedData);
    // console.log("model1",this.model1);


    if (this.varaint_data.data[index].selected == "inactive") {
      var select = {
        case: selectedData.case,
        casepercent: selectedData.casepercent,
        name: selectedData.name,
        detail: selectedData.detail,
        days: selectedData.days,
        varaintDetails: selectedData.varaintDetails,
        casesCovred: selectedData.casesCovred,
        selected: "active"
      };
      this.isvaraintPlay=true;
      this.varaint_data.data[index] = select;
    } else {
      var select = {
        case: selectedData.case,
        casepercent: selectedData.casepercent,
        name: selectedData.name,
        detail: selectedData.detail,
        days: selectedData.days,
        varaintDetails: selectedData.varaintDetails,
        casesCovred: selectedData.casesCovred,
        selected: "inactive"
      };
      this.isvaraintPlay=false;
      this.varaint_data.data[index] = select;
    }
    this.selectedCaseArry = [];
    for (var i = 0; i < this.varaint_data.data.length; i++) {
      if (this.varaint_data.data[i].selected == "active") {
        var casevalue = this.varaint_data.data[i].case
        this.selectedCaseArry.push(casevalue);
      }
    };
    console.log("selectedcase", this.selectedCaseArry)
    // console.log("selectedcase.length",this.selectedCaseArry.length)
    this.caselength = this.selectedCaseArry.length;

    if (this.selectedCaseArry.length == 1) {
      // const element = this.pgModel.flowchartData[casevalue];
      // this.model1 = element.nodeDataArraycase;
      // this.model2 = element.linkarraycase;
      // this.model1=this.pgModel.allData.nodeDataArraycase;
      // this.model2=this.flowchartData(this.pgModel.nodeDataArraycase)
      this.isDefaultData = false;
      console.log("selectedcase", this.selectedCaseArry)
    // console.log("selectedData.case",selectedData.case);
    
      if (this.keyExists(this.selectedCaseArry[0], this.testVariant.data) == true) {
        // console.log('log',this.selectedCaseArry[0], this.pgModel.flowchartData);
        
        var modalData = this.testVariant.data[0][this.selectedCaseArry[0]]
        console.log('modalData',modalData);
        
        this.model1 = modalData.nodeDataArraycase
        this.nodeAlignment();
        this.model2 = this.flowchartData(this.model1)
        this.linkCurvinessGenerate();
      }
    }
    else {
      var modelDataArray = []
      for (var i = 0; i < this.selectedCaseArry.length; i++) {
        // console.log('key',this.keyExists(this.selectedCaseArry[i],this.pgModel.flowchartData)==true);
        // console.log("selectedCaseArry",this.selectedCaseArry);

        if (this.keyExists(this.selectedCaseArry[i], this.varaint_GraphDataArray) == true) {
          var modalData = this.varaint_GraphData.data[this.selectedCaseArry[i]]
          modelDataArray.push(modalData)

          // console.log('modalData[0]',modalData);


          // this.model1=result
          // this.model1=this.model1.nodeDataArraycase
          // this.model2=this.flowchartData(this.model1)
        }

      }
      // console.log('modalData[0]', modelDataArray);

      // var combine_obj={};
      // for(var key in modelDataArray[0].nodeDataArraycase) combine_obj[key]=modelDataArray[0].nodeDataArraycase[key];
      // for(var key in modelDataArray[1].nodeDataArraycase) combine_obj[key]=modelDataArray[1].nodeDataArraycase[key];
      // // var diffirence= modelDataArray[0].nodeDataArraycase.filter(x=>!modelDataArray[1].nodeDataArraycase.includes(x));
      // // var compare= this.compareJSON(modelDataArray[0],modelDataArray[1])
      // console.log('combine_obj',combine_obj);

      var outArr = [];
      var m = this

      modelDataArray[0].nodeDataArraycase.forEach(function (value, i) {
        // console.log(value);
        modelDataArray[1].nodeDataArraycase.forEach(function (value1, j) {
          //console.log(value1)
          if (value.name === value1.name) {
            if (value.hasOwnProperty('linkArray') && value1.hasOwnProperty('linkArray')) {
              // console.log(value.linkArray.length);
              if (value.linkArray.length != 0 && value1.linkArray.length != 0) {
                value.linkArray.forEach(e1 => {
                  // console.log(e1 + "::::");
                  value1.linkArray.forEach(e2 => {
                    if (e1 != e2) {
  
                      value.linkArray.push(e2);
                      // console.log(value);
  
                      value.linkArray = m.removeDuplicates(value.linkArray);
                    }
                  });
                });
              } else {
                if (value.linkArray.length == 0) {
                  value1.linkArray.forEach(e2 => {
                    value.linkArray.push(e2);
                    // console.log(value);
                  });
                } else {
                  value.linkArray.forEach(e1 => {
                    value.linkArray.push(e1);
                    // console.log(value);
                  });
                }
  
              }
  
            }
            if (value.hasOwnProperty('toolCount') && value1.hasOwnProperty('toolCount')){
            var sum = value.toolCount.map(function (num, idx) {
              return num + value1.toolCount[idx];
            });
            value.toolCount=sum
          }
          // value.toolCount=sum
            outArr.push(value);
          }
        });
      });
// console.log('outArr1',outArr);

      if(this.selectedCaseArry.length > 2){
var modalData = this.pgModel.flowchartData[0][this.selectedCaseArry[2]]
// console.log('outArr12',outArr);

        this.multynodeArray(outArr,modalData)
      }
    // this.nestedArray=outArr;

      // if(this.selectedCaseArry.length >2){
      //   console.log(this.selectedCaseArry);
        
      // for(var i=2; i < this.selectedCaseArry.length; i++){
      //   // var k=2;
      //   // while(this.selectedCaseArry.length ){

      //     console.log('nestedArray',this.nestedArray,this.selectedCaseArry[i]);
        
      //   if (this.keyExists(this.selectedCaseArry[i], this.pgModel.flowchartData) == true) {
      //     var modalData = this.pgModel.flowchartData[0][this.selectedCaseArry[i]]
      //     // console.log('modalData',modalData);
          
      //   this.multynodeArray(this.nestedArray,modalData)
        
      //     // k+1;
      //   }

      //   }

      // }

    // }
    

          this.model1=outArr
          this.model2=this.flowchartData(this.model1)

      this.isDefaultData = false;
    }
  }

  multynodeArray(outArray,modeaValue){
    var outArr=[];
    var m=this
    // console.log('outArraym',outArray);
    // console.log('modeaValuem',modeaValue);
    
    outArray.forEach(function (value, i) {
      // console.log(value);
      modeaValue.nodeDataArraycase.forEach(function (value1, j) {
        //console.log(value1)
        if (value.name === value1.name) {
          if (value.hasOwnProperty('linkArray') && value1.hasOwnProperty('linkArray')) {
            // console.log(value.linkArray.length);
            if (value.linkArray.length != 0 && value1.linkArray.length != 0) {
              value.linkArray.forEach(e1 => {
                // console.log(e1 + "::::");
                value1.linkArray.forEach(e2 => {
                  if (e1 != e2) {

                    value.linkArray.push(e2);
                    // console.log(value);

                    value.linkArray = m.removeDuplicates(value.linkArray);
                  }
                });
              });
            } else {
              if (value.linkArray.length == 0) {
                value1.linkArray.forEach(e2 => {
                  value.linkArray.push(e2);
                  // console.log(value);
                });
              } else {
                value.linkArray.forEach(e1 => {
                  value.linkArray.push(e1);
                  // console.log(value);
                });
              }

            }

          }
          if (value.hasOwnProperty('toolCount') && value1.hasOwnProperty('toolCount')){
          var sum = value.toolCount.map(function (num, idx) {
            return num + value1.toolCount[idx];
          });
          value.toolCount=sum
        }
        // value.toolCount=sum
          outArr.push(value);
          console.log('outarraynested',outArr);
        }
      });
    });
    // this.nestedArray=outArr;
  }
  removeDuplicates(array) {
    return array.filter((a, b) => array.indexOf(a) === b)
   };
  keyExists(key, search) {
    console.log('test',key, search)
    var existingObj = search.find(function (element) {
      return typeof element[key] !== 'undefined';
    });
    if (existingObj[key]) {
      // console.log('was found');
      return true
    } else {
      // console.log('not-found');
      return false
    }
  }
  compareJSON(obj1, obj2) {
    // console.log('obj1', obj1.nodeDataArraycase)
    // console.log('obj2', obj2)
    var ret = {};
    for (var i in obj2) {
      if (!obj1.hasOwnProperty(i) || obj2[i] !== obj1[i]) {
        ret[i] = obj2[i];
      }
    }
    return ret;
  };

  playAnimation() {
    this.isplay = !this.isplay
  }

  downloadsvg() {
    this.isdownload = true;
  }

  seleceAllVariants() {
    this.isplay = false;
    // console.log("checkboxValue",this.checkboxValue);

    if (this.checkboxValue == true) {
      for (var i = 0; i < this.varaint_data.length; i++) {
        this.varaint_data[i].selected = "active"
        // this.model1=this.pgModel.allSelectData.nodeDataArraycase
        // this.model2=this.pgModel.allSelectData.linkarraycase;
        this.isDefaultData = false;
      }
    } else {
      for (var i = 0; i < this.varaint_data.length; i++) {
        this.varaint_data[i].selected = "inactive";
      }
      // this.model1 = this.pgModel.defaultmodel.nodeDataArraycase;
      // this.model2 = this.pgModel.defaultmodel.linkarraycase;
      this.isDefaultData = true;
    }
  }

  performance() {
    this.isfrequency = true;
  }
  frequency() {
    this.isfrequency = false;
  }
  

  flowchartData(dataArray) {
    this.linkData = [];
    this.linkdataArray = [];
    this.nodeArray = dataArray;
     var linkToolArray=[];
    for (var i = 1; i < this.nodeArray.length-1; i++) {
      // console.log('linkArray',this.nodeArray[i].linkArray);
      var datalink = this.nodeArray[i].linkArray;
      // console.log('datalink',datalink);
      var link=[]
      var linktool=[]
      var label = this.nodeArray[i].name;
      
      for(var j=0; j< datalink.length; j++){
        // link.push(datalink[j].linkNode)
        // console.log('datalink.length',datalink[j].length);
        
        // if(link != undefined ||link != null){
        var obj = {};
          obj['from'] = this.getFromKey(label);
          obj['to'] = this.getFromKey(datalink[j].linkNode);
          obj['text'] = datalink[j].toolCount[0];
          // highData
          //let testedg=label+' --> '+datalink[j].linkNode
          //obj['textOne'] = testedg;

          obj['toolData']=datalink[j].tool
           obj['toolDataCount']=datalink[j].toolCount
           if(datalink[j].toolCount[0]>100){
            obj['highData']=true
           }

          this.linkdataArray.push(obj);
      // }
    }
          
      // var label = this.nodeArray[i].name;
      // if (link != undefined) {
        // for (var a = 0; a < link.length; a++) {
        //   var obj = {};
        //   obj['from'] = this.getFromKey(label);
        //   obj['to'] = this.getFromKey(link[a]);
        //   obj['text'] = this.nodeArray[i].toolCount[0];
        //   // obj['linktool'] = linkToolArray[l]
        //   this.linkdataArray.push(obj);
        // }

        // console.log('linkdataArray',this.linkdataArray);
        if (this.nodeArray[i].tool.includes('Start Frequency')) {
          var obj = {};
          this.nodeArray[i].count = this.nodeArray[i].toolCount[0];
          if(this.nodeArray[i].toolCount[3]!=0){
          obj['from'] = -1;
          obj['to'] = this.getFromKey(this.nodeArray[i].name);
          obj['text'] = this.nodeArray[i].toolCount[3];
          
          //let testedg="Start --> "+this.nodeArray[i].name
          //obj['textOne'] = testedg;
          obj["extraNode"] = 'true';
          this.linkdataArray.push(obj);
          }
        }
        if (this.nodeArray[i].tool.includes('End Frequency')) {
          var obj = {};
          this.nodeArray[i].count = this.nodeArray[i].toolCount[0];
          if(this.nodeArray[i].toolCount[4]!=0){
          obj['from'] = this.getFromKey(this.nodeArray[i].name);
          obj['to'] = -2;
          obj['text'] = this.nodeArray[i].toolCount[4];

          //let testedg=this.nodeArray[i].name+' --> End'
          //obj['textOne'] = testedg;

          obj["extraNode"] = 'true';
          this.linkdataArray.push(obj);
          }
        }

      // }
    }
    // for(var x=0; x<link.length; x++){
    //   var obj = {};
    //   obj['from'] = this.getFromKey(link[x].linkNode);
    //       obj['to'] = this.getFromKey(link[x].linkNode);
    //       obj['toolData']=link[x].tool
    //       obj['toolDataCount']=link[x].toolCount
    //       this.linkdataArray.push(obj);
    // }
    // this.model1=this.pgModel.allData.nodeDataArraycase;

    // this.model2=this.linkdataArray;
    console.log('linkarray', this.linkdataArray)
    return this.linkdataArray;
  }

  getFromKey(name) {
    for (var i = 0; i < this.nodeArray.length; i++) {
      if (name == this.nodeArray[i].name) {
        return this.nodeArray[i].key;
      }
    }
  }

  onfrequency(){
    this.isfrequencymetrics= !this.isfrequencymetrics;
    this.isperformancemetrics=false;
  }
  onPerformance(){
    this.isperformancemetrics= !this.isperformancemetrics;
    this.isfrequencymetrics=false;

  }
  spinnermetrics(){
    this.isedgespinner= !this.isedgespinner;
    // if(this.isedgespinner==false){
    //   this.isfrequencymetrics=false;
    //   this.isperformancemetrics=false;
    //   // this.model2 = this.flowchartData(this.model1)
    // }
  }

generateBpmn(){
  this.bpmnservice.uploadBpmn("pizza-collaboration.bpmn");  
  this.bpmnservice.setNewDiagName('pizza-collaboration');
  this.router.navigate(['/pages/businessProcess/uploadProcessModel'],{queryParams: {isShowConformance: true}})
}
  
loopTrackBy(index, term){
  return index;
}
timeConversion(millisec) {
  var seconds:any = (millisec / 1000).toFixed(1);
  var minutes:any = (millisec / (1000 * 60)).toFixed(1);
  var hours:any = (millisec / (1000 * 60 * 60)).toFixed(1);
  var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
  if (seconds < 60) {
      return seconds + " Sec";
  } else if (minutes < 60) {
      return minutes + " Min";
  } else if (hours < 24) {
      return hours + " Hrs";
  } else {
      return days + " Days"
  }
}

selectedMetric(selectedValue){
  console.log('spinMetrics0',this.spinMetrics0);
  console.log("selectedValue",selectedValue);
 
  let index;
  switch(selectedValue){
    case "absoluteFrequency":
        index=0;
    break;
    case "caseFrequency":
        index=1;
    break;
    case "maxRepititons":
        index=2;
    break;
    case "startFrequency":
        index=3;
    break;
    case "endFrequency":
        index=4;
    break;
    case "totalDuration":
        index=5;
    break;
    case "medianDuration":
        index=6;
    break;
    case "meanDuration":
        index=7;
    break;
    case "maxDuration":
        index=8;
    break;
    case "minDuration":
        index=9;
    break;
  }
  // console.log(index);
  for(var i=1;i<this.model1.length-1;i++){
    // console.log(this.model1[i].count);
    if(index==5||index==6||index==7||index==8||index==9){
      this.model1[i].count=this.timeConversion(this.model1[i].toolCount[index])
    }else{
      this.model1[i].count=this.model1[i].toolCount[index]
      this.model1=this.model1
      // this.model1[i].countOne=this.model1[i].toolCount[index]
    }

  }
  console.log("model",this.model1);

  this.model2 = this.flowchartDataOne(this.model1,index)
  for(var j=0;j<this.model2.length;j++){
    if(j==0 && this.model2[j].to>1 ){
      let loc3=160
    this.model2[j].curviness=loc3
    }else{
    if(this.model2[j].from ==-1||this.model2[j].from==-2){
      if(this.model2[j].from==-1 && this.model2[j].to==0){
        let loc3=0
        this.model2[j].curviness=loc3
      }else{
      let loc3=-25*j
    this.model2[j].curviness=loc3
      }
    }else if(this.model2[j].to ==-1||this.model2[j].to==-2){
      if(this.model2[j].from==this.model1.length-3 && this.model2[j].to==-2){
        let loc3=0
        this.model2[j].curviness=loc3
      }else{
        let loc3=20*j
        this.model2[j].curviness=loc3
      }
  }else if(this.model2[j].from+1==this.model2[j].to){
    let loc3=0
    this.model2[j].curviness=loc3
  }else{
      let loc3=30*j
    this.model2[j].curviness=loc3
    }
  }
}
  
}
flowchartDataOne(dataArray,index) {
  // console.log('index',index);
  
  this.linkData = [];
  this.linkdataArray = [];
  this.nodeArray = dataArray;
   var linkToolArray=[];
  for (var i = 1; i < this.nodeArray.length-1; i++) {
    // console.log('linkArray',this.nodeArray[i].linkArray);
    var datalink = this.nodeArray[i].linkArray;
    //  console.log('datalink',datalink);
    var link=[]
    var linktool=[]
    var label = this.nodeArray[i].name;
    
    for(var j=0; j< datalink.length; j++){
      // link.push(datalink[j].linkNode)
      // console.log('datalink.length',datalink[j].length);
      
      // if(link != undefined ||link != null){
        
      // console.log(index);
      var obj = {};
        obj['from'] = this.getFromKey(label);
        obj['to'] = this.getFromKey(datalink[j].linkNode);
        if(index==5||index==6||index==7||index==8||index==9){
          obj['text'] = this.timeConversion(datalink[j].toolCount[index]);
        }else{
        
          obj['text'] = datalink[j].toolCount[index];
          if(datalink[j].toolCount[index]>100){
            obj['highData']=true
          }

        }
        // let testedg=label+' --> '+datalink[j].linkNode
        // obj['textOne'] = testedg;

        obj['toolData']=datalink[j].tool
         obj['toolDataCount']=datalink[j].toolCount
         

        this.linkdataArray.push(obj);
  }
      if (this.nodeArray[i].tool.includes('Start Frequency')) {
        var obj = {};
        // this.nodeArray[i].count = this.nodeArray[i].toolCount[0];
        // obj['from'] = -1;
        // obj['to'] = this.getFromKey(this.nodeArray[i].name);
        if(this.nodeArray[i].toolCount[3]!=0){
          obj['from'] = -1;
          obj['to'] = this.getFromKey(this.nodeArray[i].name);
          if(index==0||index==1){
          obj['text'] = this.nodeArray[i].toolCount[3];
          }
          obj["extraNode"] = 'true';
          this.linkdataArray.push(obj);
        }
        // obj['text'] = this.nodeArray[i].toolCount[3]
        // let testedg="Start --> "+this.nodeArray[i].name
        // obj['textOne'] = testedg;

      }
      if (this.nodeArray[i].tool.includes('End Frequency')) {
        var obj = {};
        // this.nodeArray[i].count = this.nodeArray[i].toolCount[0];
        // obj['from'] = this.getFromKey(this.nodeArray[i].name);
        // obj['to'] = -2;
        if(this.nodeArray[i].toolCount[4]!=0){
          obj['from'] = this.getFromKey(this.nodeArray[i].name);
          obj['to'] = -2;
          if(index==0||index==1){
          obj['text'] = this.nodeArray[i].toolCount[4]
          }
          obj["extraNode"] = 'true';
        this.linkdataArray.push(obj);
        }
        // let testedg=this.nodeArray[i].name+" --> End"
        // obj['textOne'] = testedg;

        // obj['text'] = this.nodeArray[i].toolCount[4]
        
      }
  }
console.log('this.linkdataArray',this.linkdataArray);

  return this.linkdataArray;
}
openNav(){
  document.getElementById("mySidenav").style.width = "310px";
  document.getElementById("main").style.marginRight = "310px";
  }
closeNav() {
  document.getElementById("mySidenav").style.width = "0px";
  document.getElementById("main").style.marginRight= "0px";
  }
  resetspinnermetrics(){
    this.model2 = this.flowchartData(this.model1)
    for(var j=0;j<this.model2.length;j++){
      // for (let [key, value] of Object.entries(this.model2[j])) {
        // console.log(this.model2[j].from);

                        // this.model2[j].to ==-1||this.model2[j].to==-2 //conditions
            // this.model2[j].from>0 && this.model2[j].to<0
            // this.model2[j].from ==-2||this.model2[j].to==-2
      if(j==0 && this.model2[j].to>1 ){
        let loc3=160
      this.model2[j].curviness=loc3
      }else{
        if(this.model2[j].from ==-1||this.model2[j].from==-2){
          if(this.model2[j].from==-1 && this.model2[j].to==0){
            let loc3=0
            this.model2[j].curviness=loc3
          }else{
          let loc3=-25*j
        this.model2[j].curviness=loc3
        }

        }else if(this.model2[j].to ==-1||this.model2[j].to==-2){
          if(this.model2[j].from==this.model1.length-3 && this.model2[j].to==-2){
            let loc3=0
            this.model2[j].curviness=loc3
          }else{
            let loc3=20*j
            this.model2[j].curviness=loc3
          }
      }else if(this.model2[j].from+1==this.model2[j].to){
        let loc3=0
        this.model2[j].curviness=loc3
      }else{
          let loc3=30*j
        this.model2[j].curviness=loc3
        }
    }
  }
  this.spinMetrics0="";
    this.spinMetrics0="absoluteFrequency";
  // console.log('spinMetrics0',this.spinMetrics0);
  }
  caseParcent(parcent){
    let perc=parcent.toString().split('.')
  // return parcent.toString().slice(0,5);
  return perc[0]+'.'+perc[1].slice(0,2);
  }

  nodeAlignment(){
    let loction=''
    for(var i=0;i<this.model1.length;i++){
      if(this.model1[i].key==-1||this.model1[i].key==-2){
        let loc1=530
      let loc2=-150+i*80
      loction=loc1+' '+loc2;
      this.model1[i].loc=loction
      }else{
      let loc1=455
      let loc2=-150+i*80
      loction=loc1+' '+loc2;
      this.model1[i].loc=loction
      }
    }
  }

  linkCurvinessGenerate(){
    // this.model2 = this.flowchartData(this.model1)
    for(var j=0;j<this.model2.length;j++){
      // for (let [key, value] of Object.entries(this.model2[j])) {
        // console.log(this.model2[j].from);

                        // this.model2[j].to ==-1||this.model2[j].to==-2 //conditions
            // this.model2[j].from>0 && this.model2[j].to<0
            // this.model2[j].from ==-2||this.model2[j].to==-2
      if(j==0 && this.model2[j].to>1 ){
        let loc3=160
      this.model2[j].curviness=loc3
      }else{
        if(this.model2[j].from ==-1||this.model2[j].from==-2){
          if(this.model2[j].from==-1 && this.model2[j].to==0){
            let loc3=0
            this.model2[j].curviness=loc3
          }else{
          let loc3=-25*j
        this.model2[j].curviness=loc3
        }

        }else if(this.model2[j].to ==-1||this.model2[j].to==-2){
          if(this.model2[j].from==this.model1.length-3 && this.model2[j].to==-2){
            let loc3=0
            this.model2[j].curviness=loc3
          }else{
            let loc3=20*j
            this.model2[j].curviness=loc3
          }
      }else if(this.model2[j].from+1==this.model2[j].to){
        let loc3=0
        this.model2[j].curviness=loc3
      }else{
          let loc3=30*j
        this.model2[j].curviness=loc3
        }
    }
  }
  }
  
}
