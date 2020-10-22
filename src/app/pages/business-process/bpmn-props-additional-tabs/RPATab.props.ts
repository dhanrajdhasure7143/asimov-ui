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

    function getRPATaskListOptions(element){
        let selectedRpaTaskListOptions = [];
        let rpa_taskList_opts = localStorage.getItem("rpaActivityTaskListOptions");
        var rpaTaskListOptions = rpa_taskList_opts? JSON.parse(rpa_taskList_opts) :[];

        var rpaFData = getRpaData(element);
        if(rpaFData){
            let activity = rpaFData.get("rpaAActivity");
            if(activity){
                selectedRpaTaskListOptions = rpaTaskListOptions[activity]
            }
        }
        return selectedRpaTaskListOptions;
    }

    function getActivityEntry(element, bpmnFactory){
        let rpa_activity_opts = localStorage.getItem("rpaActivityOptions");
        var rpaActivityOptions = rpa_activity_opts? JSON.parse(rpa_activity_opts) :[];
        return entryFactory.selectBox({
            id: 'activity',
            label: 'RPA Activity',
            selectOptions: rpaActivityOptions,
            modelProperty: 'activity',
            divider: true,
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
                // var taskListSelect = document.getElementById('camunda-taskList-select');
                // var opt = '<option value=""></option>';
                // for (var i = 0; i<selectedRpaTaskListOptions.length; i++){
                //     opt += '<option value='+selectedRpaTaskListOptions[i].value+'>';
                //     opt += selectedRpaTaskListOptions[i].name+'</option>';
                // }
                // taskListSelect.innerHTML = opt;
                if(!rpaFData){
                    rpaFData = elementHelper.createElement('bpmn:RPATask', { rpaAActivity: ""}, rpaExtensionElements, bpmnFactory);
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

    function getTaskListEntry(element, bpmnFactory) {
        let taskListOptions = getRPATaskListOptions(element);
        return entryFactory.selectBox({
            id: 'taskList',
            label: 'RPA Task List',
            selectOptions: taskListOptions,
            modelProperty: 'taskList',
            prefix: 'RpATaskList',
            emptyParameter: true,
            get: function(element, node) {
                var result = { taskList: '' };
                var bo = getBusinessObject(element);
                var formDataExtension = getExtensionElements(bo, "bpmn:RPATask");
                if (formDataExtension) {
                    var formData = getRpaData(element);
                    var storedValue = formData.get('rpaATaskList');
                    result = { taskList: storedValue };
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
                    rpaFData = elementHelper.createElement('bpmn:RPATask', { rpaATaskList: "" }, rpaExtensionElements, bpmnFactory);
                    commands.push(cmdHelper.addAndRemoveElementsFromList(
                        element,
                        rpaExtensionElements,
                        'values',
                        'extensionElements',
                        [rpaFData],
                        []
                    ));
                }
                var field = elementHelper.createElement('bpmn:RPATask', values.taskList , rpaFData, bpmnFactory);
                if (typeof rpaFData.rpaATaskList !== 'undefined') {
                    commands.push(cmdHelper.addElementsTolist(element, rpaFData, 'rpaATaskList', values.taskList));
                } else {
                    commands.push(cmdHelper.updateBusinessObject(element, rpaFData, {
                        rpaATaskList: values.taskList
                    }));
                }
                return commands;
            },
            hidden: function(element, node) {
                var rpaFData = getRpaData(element);
                return !(rpaFData && rpaFData.get("rpaAActivity"));
            }
        });
    }
    
    function getRPAEntries(element, bpmnFactory) {
        var processBo = getBusinessObject(element);
        if (is(processBo, 'bpmn:Participant')) {
          processBo = processBo.processRef;
        }
        var rpaActivityEntry = getActivityEntry(element, bpmnFactory)
        var rpaTaskListEntry = getTaskListEntry(element, bpmnFactory)
        
        return {
            entries: [
                rpaActivityEntry,
                rpaTaskListEntry
            ]
        };
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