import { IPropertiesProvider } from './bpmn-js';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import Swal from 'sweetalert2';

import * as IOHelper from './IOSpec.helper';
import processIoProps from './IOSpec.props';
import processIoEntryProps from './IOSpec.entryprops';

import rpaProps from './RPATab.props';

declare var require:any;
var formHelper = require('bpmn-js-properties-panel/lib/helper/FormHelper');
var copy = require('clipboard-copy');
var domify = require('min-dom').domify;

export class PreviewFormProvider implements IPropertiesProvider {

  static $inject = ['translate', 'bpmnPropertiesProvider', 'injector', 'bpmnFactory'];

  constructor(private translate, private bpmnPropertiesProvider, private injector, private bpmnFactory) { }

  getTabs(element) {
    let self = this;
    let actualTabs = this.bpmnPropertiesProvider.getTabs(element);
    let variableTabInd = -1;
    let inputOutputTabInd = -1;
    //add Preview Form button for Forms tab
    actualTabs.forEach((each_tab,tId)=>{
      if(each_tab.id == "process-variables") variableTabInd = tId;
      if(each_tab.id == "input-output") inputOutputTabInd = tId;
      if(each_tab.id == "forms" && each_tab.groups.length && each_tab.groups[0].entries.length >0){
        let previewBtn = {
          html: "<button id='preview-button' data-action='openPreview'>Preview Form</button>",
          id: "form-fields-generate-button",
          openPreview: function(element, node) {
            var formFields = formHelper.getFormFields(element);
            if (formFields != null) {
              self.generateHTML(formFields);
            }
          }
        };
        each_tab.groups[0].entries.splice(2,0,previewBtn)
      }
    });

    //Change drop down label String/Expression to text in I/O Tab
    let inputOutputtab = actualTabs[inputOutputTabInd];
    // console.log(inputOutputtab);

    //add IO Specification tab
    var bo = getBusinessObject(element);

    if (
      is(bo, 'bpmn:Process') || (
        is(bo, 'bpmn:Participant') &&
        bo.processRef
      )
    ) {
      //remove Variables tab
      actualTabs.splice(variableTabInd,1);

      //Add IOSpec Tab
      var IOSpecTab = this.createProcessIoTab(element, this.injector, "ioTab");
      actualTabs.splice(1,0,IOSpecTab);

      //Add Input/Output Tab for process
      // console.log(actualTabs)
    }

    //add RPA Task tab
    if (is(bo, 'bpmn:rpaTask')) {
      var RPATab = this.createProcessIoTab(element, this.injector, "rpaTab");
      //add in case of additional tabs
      // actualTabs = [actualTabs[0], RPATab]
      actualTabs.splice(1,0,RPATab)
    }
    return actualTabs;
  }

  // IO TAB //
  createProcessIoTab(element, injector, tabType){
    let self = this;
    var customTab;
    if(tabType == "ioTab"){
      let processIoGroup = {
        id: 'process-io-group',
        label: 'Parameters',
        entries: []
      };
    
      // create groups showing input and output parameters
      var {
        getSelectedParameter
      } = injector.invoke(processIoProps, null, { group: processIoGroup, element: element });
  
      var processIoEntryGroup = {
        id: 'process-io-entry-group',
        entries: [],
        enabled: function(element, node) {
          return getSelectedParameter(element, node);
        },
        label: function(element, node) {
          var property = getSelectedParameter(element, node);
    
          return property && self.getIoParameterLabel(property) || '';
        }
      };
    
      // create single entry edit group
    
      injector.invoke(processIoEntryProps, null, {
        group: processIoEntryGroup,
        element: element,
        options: {
          getSelectedParameter
        }
      });
    
      customTab = {
        id: 'process-io-tab',
        label: 'I/O Specification',
        groups: [
          processIoGroup,
          processIoEntryGroup
        ]
      };
    }else if(tabType == "rpaTab"){
      let rpaGroup = {
        id: 'rpa-group',
        label: 'Parameters',
        entries: []
      };

      injector.invoke(rpaProps, null, {
        group: rpaGroup,
        // rest: self.rest,
        element:element
      })

      customTab = {
        id: 'rpa',
        label: 'RPA Task',
        groups: [
          rpaGroup
        ]
      };
    }

    return customTab;
  }

  getIoParameterLabel(param) {
    const { type } = IOHelper.parseIoProperty(param);
  
    if (type === 'input') {
      return 'Input Definition';
    }
  
    if (type === 'output') {
      return 'Output Definition';
    }
  
    return '';
  };


  // IO TAB //

  generateHTML(formFields) {
    var self = this;
    var fullHtml = '';
    var source = '';
    formFields.forEach(function(formField) {
      if (formField.type != null) {
        fullHtml += self.generateHTMLSnippet(formField);
        source += self.generateSource(formField);
      }
    });
    var fullSource = `<div>
        <p><i>Hint: You can just copy and paste this source into your embedded form.</i></p>
        <button id="copytext" class="copy-button">Copy</button>
        <textarea id="copytextarea" class="form-control" style="height:200px;overflow:auto;">
          <form class="form-horizontal">
            <div class="col-xs-12">
              ${source}
            </div>
          <script cam-script type="text/form-script">
            // custom JavaScript goes here
          </script>
          </form>
        </textarea>
      </div>`;
    var tabPanel = `<div>
      <div class="tab">
        <button class="tablinks" data-id="tabform">Form</button>
        <button class="tablinks" data-id="tabsource">Source</button>
      </div>
      <div id="tabform" class="tabcontent">
        <form>
          ${fullHtml}
        </form>
      </div>
      <div id="tabsource" class="tabcontent">
        ${fullSource}
      </div>
      </div>`;
    var domHtml = domify(tabPanel);
    Swal.fire({
      text: "Generated Forms",
      html: domHtml
    });
    var tablinks = document.querySelectorAll(".tablinks");
    tablinks.forEach(function(tablink) {
      tablink.addEventListener("click", function(event) {
        var id = (<HTMLElement>event.target).getAttribute("data-id");
        self.openTab(event, id);
      });
    });
    (<HTMLElement>tablinks[0]).click();
    var copybutton = document.querySelector("#copytext");
    copybutton.addEventListener('click', function() {
      var text = (<HTMLInputElement>document.querySelector("#copytextarea")).value;
      copy(text);
    });
  };

  openTab(evt, tabName) {

    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }

  generateSource(formField) {
    switch (formField.type) {
      case 'string':
        return `<div class="form-group">
              <label for="${formField.id}">
                ${formField.label}
              </label>
              <input class="form-control" name="${formField.id}" cam-variable-type="String" cam-variable-name="${formField.id}" type="text">
            </div>`;
        break;
      case 'long':
        return `<div class="form-group">
              <label for="${formField.id}">
                ${formField.label}
              </label>
              <input class="form-control" name="${formField.id}" cam-variable-type="Long" cam-variable-name="${formField.id}" type="text">
            </div>`;
        break;
      case 'boolean':
        return `<div class="form-group">
              <label for="${formField.id}">
                ${formField.label}
              </label>
              <input class="form-control" name="${formField.id}" cam-variable-type="Boolean" cam-variable-name="${formField.id}" type="checkbox">
            </div>`;
        break;
      case 'date':
        return `<div class="form-group">
                    <label for="${formField.id}">
                      ${formField.label}
                    </label>
                    <p class="input-group">
                      <input type="text"
                           cam-variable-name="${formField.id}"
                           cam-variable-type="Date"
                           class="form-control"
                           datepicker-popup="yyyy-MM-dd'T'HH:mm:ss"
                           is-open="dateFieldOpened${formField.id}" />
                      <span class="input-group-btn">
                        <button type="button"
                                class="btn btn-default"
                                ng-click="open${formField.id}($event)">
                          <i class="glyphicon glyphicon-calendar"></i>
                        </button>
                      </span>
                    </p>
                    <script cam-script type="text/form-script">
                      $scope.open${formField.id} = function($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.dateFieldOpened${formField.id} = true;
                      };
                    </script>
              </div>`;
        break;
      case 'enum':
        var options = '';
        if (formField.values && formField.values.length > 0) {
          formField.values.forEach(function(value) {
            options += `<option value="${value.id}">${value.name}</option>`;
          });
        }
  
        return `<div class="form-group">
            <label for="${formField.id}">
              ${formField.label}
            </label>
            <select class="form-control" cam-variable-type="String" cam-variable-name="${formField.id}">
              ${options}
            </select></div>`;
        break;
      default:
        return '';
  
    }
  };

  generateHTMLSnippet(formField) {
    switch (formField.type) {
      case 'string':
        return `<div class="form-group">
              <label for="${formField.id}">
                ${formField.label}
              </label>
              <input class="form-control" name="${formField.id}" cam-variable-type="String" cam-variable-name="${formField.id}" type="text">
            </div>`;
        break;
      case 'long':
        return `<div class="form-group">
              <label for="${formField.id}">
                ${formField.label}
              </label>
              <input class="form-control" name="${formField.id}" cam-variable-type="Long" cam-variable-name="${formField.id}" type="text">
            </div>`;
        break;
      case 'boolean':
        return `<div class="form-group">
              <label for="${formField.id}">
                ${formField.label}
              </label>
              <input class="form-control" name="${formField.id}" cam-variable-type="Boolean" cam-variable-name="${formField.id}" type="checkbox">
            </div>`;
        break;
      case 'date':
        return `<div class="form-group">
              <label for="${formField.id}">
                ${formField.label}
              </label>
              <input class="form-control" name="${formField.id}" cam-variable-type="Date" cam-variable-name="${formField.id}" type="date">
            </div>`;
        break;
      case 'enum':
        var options = '<option></option>';
        if (formField.values && formField.values.length > 0) {
          formField.values.forEach(function(value) {
            options += `<option value="${value.id}">${value.name}</option>`;
          });
        }
  
        return `<div class="form-group">
            <label for="${formField.id}">
              ${formField.label}
            </label>
            <select class="form-control" cam-variable-type="String" cam-variable-name="${formField.id}">
              ${options}
            </select></div>`;
        break;
      default:
        return '';
  
    }
  }; 

}