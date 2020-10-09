import { IPropertiesProvider } from './bpmn-js';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import Swal from 'sweetalert2';

import * as IOHelper from './IOSpec.helper';
import processIoProps from './IOSpec.props';
import processIoEntryProps from './IOSpec.entryprops';

declare var require:any;
var formHelper = require('bpmn-js-properties-panel/lib/helper/FormHelper');
var copy = require('clipboard-copy');
var domify = require('min-dom').domify;

export class PreviewFormProvider implements IPropertiesProvider {

  static $inject = ['translate', 'bpmnPropertiesProvider', 'injector'];

  constructor(private translate, private bpmnPropertiesProvider, private injector) { }

  getTabs(element) {
    let self = this;
    let actualTabs = this.bpmnPropertiesProvider.getTabs(element);
    actualTabs.forEach((each_tab)=>{
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

    var bo = getBusinessObject(element);

    if (
      is(bo, 'bpmn:Process') || (
        is(bo, 'bpmn:Participant') &&
        bo.processRef
      )
    ) {
      var IOSpecTab = this.createProcessIoTab(element, this.injector);
      actualTabs.splice(1,0,IOSpecTab);
    }
    return actualTabs;
  }

  // IO TAB //
  createProcessIoTab(element, injector){
    let self = this;
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
  
    var processIoTab = {
      id: 'process-io-tab',
      label: 'I/O Specification',
      groups: [
        processIoGroup,
        processIoEntryGroup
      ]
    };

    return processIoTab;
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