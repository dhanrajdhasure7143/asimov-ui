import { ActivatedRoute } from "@angular/router";
import {Component,OnInit } from "@angular/core";

@Component({
  selector: "app-process-intelligence",
  templateUrl: "./process-intelligence.component.html",
  styleUrls: ["./process-intelligence.component.css"],
})
export class ProcessIntelligenceComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    $(".link").removeClass("active");
    $("#pi").addClass("active");
    $("#expand_menu").addClass("active");
  }

  ngAfterViewInit() {}

  
  ngOnDestroy() {
    // localStorage.setItem("pi_search_category",'allcategories')
    localStorage.removeItem("project_id");
    localStorage.removeItem("projectName");
    let element = document.getElementById("tipsy_div");
    if (element) {
      element.style.display = "none";
      element.style.visibility = "hidden";
    }
  }
}
