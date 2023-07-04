import { Component, OnInit, ViewChild, ElementRef, OnDestroy ,Input,Output,EventEmitter} from '@angular/core';
import * as dagreD3 from 'dagre-d3';
import * as d3 from 'd3';
import { DataTransferService } from '../../services/data-transfer.service';
declare var $: any;


@Component({
  selector: 'app-automate-process-logs',
  templateUrl: './automate-process-logs.component.html',
  styleUrls: ['./automate-process-logs.component.css']
})
export class AutomateProcessLogsComponent implements OnInit {
  isPlayAnimation: boolean = false;
  public model: any = [];

  constructor(private dt: DataTransferService) {}

  @ViewChild('exportSVGtoPDF') exportSVGtoPDF: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('render') render: ElementRef;

  ngOnInit() {
    this.dt.getProcessLogs.subscribe(res=>{
      this.model = res;
        this.processGraph();
    })
// this.model=[
//   {"key":0,"name":"Vendor Creates Invoice"},
//   {"key":1,"name":"Scan Invoice"},
//   {"key":2,"name":"Enter in SAP"},
//   {"key":3,"name":"Book Invoice"},
//   {"key":4,"name":"Clear Invoice"},
//   {"key":5,"name":"Due Date Passed"}
// ]
    // this.processGraph();

// this.model2 =[{
//   "from": "Vendor Creates Invoice","to": "Scan Invoice","text": 1,},
// {
//   "from": "Scan Invoice",
//   "to": "Enter in SAP",
//   "text": 1,
// },
// {
//   "from": "Enter in SAP",
//   "to": "Book Invoice",
//   "text": 1,
// },
// {
//   "from": "Book Invoice",
//   "to": "Clear Invoice",
//   "text": 1,
// },
// {
//   "from": "Clear Invoice",
//   "to": "Due Date Passed",
//   "text": 1,
// },
// ]
  }

   processGraph() {
      if (this.model.length > 0) {
        var g = new dagreD3.graphlib.Graph().setGraph({ ranksep: 100, rankdir: "TB" });
        var me = this
        const w = 1300;
        d3.select("svg").remove()
        let svg = d3.select("#exportSVGtoPDF").append("svg")
          .attr("xmlns", "http://www.w3.org/2000/svg")
          .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
          .attr("width", w)
          .attr('id', 'render')
          .attr("class", "pisvg")

        d3.select("marker").append("path")
          .attr("d", "M 0 0 L 10 5 L 0 10 z")
          .style("stroke-width", 1)

        d3.select("svg").append("marker")
          .attr("id", "arrow3")
          .attr("class", "marker3")
          .attr("viewBox", "0 0 10 10")
          .attr("refX", "8")
          .attr("refY", "5")
          .attr("markerWidth", "5")
          .attr("markerHeight", "5")
          .attr("orient", "auto")
          .attr("fill", "black")
          .append("path")
          .attr("d", "M 0 0 L 10 5 L 0 10 z")
          .style("stroke-width", 2)

        var inner = svg.append("g");
        var states: any = {}
          for (var j = 0; j < this.model.length; j++) {
              var nodeName = this.model[j].name
              states[nodeName] = { 
              }
            }

        Object.keys(states).forEach(function (state) {
          var value = states[state];
          value.rx = value.ry = 10;
          value.lableStyle = "font-zie: 4em";
          g.setNode(state, value);
        });

        // Set up the edges
          for (var i = 0; i < this.model.length-1; i++) {
              g.setEdge(this.model[i].name, this.model[i+1].name, {  labelType: "html", style: "stroke: black; stroke-width: 5px;marker-end:url(#arrow3);fill:none;",
                curve: d3.curveBasis, arrowhead: "normal"
              })
          }

        g.nodes().forEach(function (v) {
          var node = g.node(v);
              node.width = 400
              node.height = 50
              node.style  = "fill: #bab7bf";
            // nodesArray.push(node)
          node.rx = node.ry = 5;
        });

       const handleZoom = (e) => inner.attr('transform', e.transform);
        const zoom = d3.zoom().on('zoom', handleZoom);

        svg.call(zoom);
        var render = new dagreD3.render();

         d3.select("body")
          .append("div")
        render(inner, g);

        // let nodes_Array = d3.selectAll("g.node rect")['_groups'][0];
        // console.log(nodes_Array)
        // // let nodes= inner.selectAll('g.node')
        // // console.log(nodes)
        // nodes_Array.forEach((element, i) => {
        //   console.log(nodes_Array[i]['attributes'])
        //   // nodes_Array[i]['attributes'][1].value = "font-size: 13px;fill: #fff"

        // });


        d3.selectAll("g g.label g")
          .attr("transform", "translate(-5,-15)")

        d3.selectAll("g text")
          .attr("text-anchor", "middle")

        d3.selectAll("g text")
          .style('font-size', '25')
          .style('font-weight', '600')

        // graph auto adjust to the screen
        var initialScale = 0.42;
        svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale) / 4, 53).scale(initialScale));
        svg.attr('height', g.graph().height * initialScale + 53);
      }
    
  }






}