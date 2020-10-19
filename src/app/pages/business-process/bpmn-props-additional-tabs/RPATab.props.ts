import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
   
  import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';
  import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';
  
  import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
  import { getExtensionElements } from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';
    import { RestApiService } from '../../services/rest-api.service';

    function getRpaData(element) {
        var bo = getBusinessObject(element);
        var formData = getExtensionElements(bo, 'bpmn:RPATask');
        if (typeof formData !== 'undefined') {
          return formData[0];
        }
    };

    function getRPAEntries(element, bpmnFactory) {
        var processBo = getBusinessObject(element);
        if (is(processBo, 'bpmn:Participant')) {
          processBo = processBo.processRef;
        }

        // Bot List //////////////////////////////
        // rest.getAllActiveBots().subscribe(res => {
        //     let tmp = [];
        //     console.log(res)
        // })

        var xhttp = new XMLHttpRequest();
        var rpaEntry = [];
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
                let opts = [];
                let taskListsArr = [];
                let res = JSON.parse(this.responseText)
                res["General"].forEach((each) => {
                    opts.push({name:each.name, value: each.name});
                    taskListsArr.push(each.taskList)
                })
                res["Advanced"].forEach((each) => {
                    opts.push({name:each.name, value: each.name});
                    taskListsArr.push(each.taskList)
                })
                rpaEntry = entryFactory.selectBox({
                    id: 'activity',
                    label: 'RPA Activity',
                    selectOptions: opts,
                    modelProperty: 'activity',
                    prefix: 'RpAaCtivity',
                    emptyParameter: true,
                    get: function(element, node) {
                        var result = { activity: '' };
                        var bo = getBusinessObject(element);
                        var formDataExtension = getExtensionElements(bo, "bpmn:RPATask");
                        if (formDataExtension) {
                            var formData = getRpaData(element);
                            var storedValue = formData.get('rpaAActivity');
                            result = { activity: storedValue };
                        }
                        return result;
                    },
                    set: function(element, values, node) {
                        var bo = getBusinessObject(element); var commands = [];
                        var rpaExtensionElements = getExtensionElements(bo, "bpmn:RPATask");
                        if (!rpaExtensionElements) {
                            rpaExtensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
                            commands.push(cmdHelper.updateProperties(element, { extensionElements: rpaExtensionElements }));
                        }
                        var rpaFData = getRpaData(element);
        
                        if(!rpaFData){
                            rpaFData = elementHelper.createElement('bpmn:RPATask', { rpaAActivity: "" }, rpaExtensionElements, bpmnFactory);
                            commands.push(cmdHelper.addAndRemoveElementsFromList(
                                element,
                                rpaExtensionElements,
                                'values',
                                'extensionElements',
                                [rpaFData],
                                []
                              ));
                        }
                        var field = elementHelper.createElement('bpmn:RPATask', values.activity , rpaFData, bpmnFactory);
                        if (typeof rpaFData.rpaAActivity !== 'undefined') {
                            commands.push(cmdHelper.addElementsTolist(element, rpaFData, 'rpaAActivity', values.activity));
                        } else {
                            commands.push(cmdHelper.updateBusinessObject(element, rpaFData, {
                                rpaAActivity: values.activity
                            }));
                        }
                        return commands;
                    }
                });
            }

            return {
                entries: [
                    rpaEntry
                ]
            };
        };
        xhttp.open("GET", "http://rpaqa.epsoftinc.in/rpa-service/load-toolset", true);
        xhttp.setRequestHeader('Authorization', 'Bearer '+localStorage.getItem("accessToken"))
        xhttp.send();
    };

  /**
   * Defines the bot list
   *
   * @return {Object}
   */
  export default function rpaProps(group, element, injector) {
  
    var {
      entries
    } = injector.invoke(getRPAEntries, null, { element });
  
    group.entries = group.entries.concat(entries);
  
  }

  class ApiService{
      toolSet:any = {
            "General": [
                {
                "name": "Email",
                "icon": "binaryformat base64 encoded",
                "taskList": [
                    {
                        "name": "Login Mail",
                        "taskId": "1"
                    },
                    {
                        "name": "Send Mail",
                        "taskId": "2"
                    },
                    {
                        "name": "Read Mail",
                        "taskId": "3"
                    },
                    {
                        "name": "Reply Mail",
                        "taskId": "16"
                    }
                ]
            }
        ]
    }
      constructor(private rest:RestApiService){}
  }