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

    function getRPATaskListOptions(element, activityValue?){
        let selectedRpaTaskListOptions = [];
        let rpa_taskList_opts = localStorage.getItem("rpaActivityTaskListOptions");
        var rpaTaskListOptions = rpa_taskList_opts? JSON.parse(rpa_taskList_opts) :[];

        if(activityValue){
            selectedRpaTaskListOptions = rpaTaskListOptions[activityValue]
        }else{
            var rpaFData = getRpaData(element);
            if(rpaFData){
                let activity = rpaFData.get("rpaAActivity");
                if(activity){
                    selectedRpaTaskListOptions = rpaTaskListOptions[activity]
                }
            }
        }
        return selectedRpaTaskListOptions;
    }

    function getRPATaskAttributes(element){
        let selectedRpaTaskAttributes = [];
        let rpa_taskList_attrs = localStorage.getItem("attributes");
        var rpaTaskListAttributes = rpa_taskList_attrs? JSON.parse(rpa_taskList_attrs) :{};
        var rpaFData = getRpaData(element);
        if(rpaFData){
            let taskId = rpaFData.get("rpaATaskList");
            if(taskId){
                selectedRpaTaskAttributes = rpaTaskListAttributes[taskId]
            }
        }
        return selectedRpaTaskAttributes;
    }

    function getAttrSelectOptions(optionList){
        let finalOptList = [];
        optionList.forEach( each => {
            finalOptList.push({name: each.label, value: each.key})
        })
        return finalOptList;
    }

    function updateTaskList(element, activityValue){
        let node = document.getElementById("camunda-taskList-select");
        if(node){
            let fullHtml = '';
            getRPATaskListOptions(element, activityValue).forEach(each_opt => {
                fullHtml += '<option value='+each_opt.value+'>'+each_opt.name+'</option>'
            })
            fullHtml += '<option value=""></option>';
            node.innerHTML = fullHtml
        }
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
                if(!rpaFData){
                    rpaFData = elementHelper.createElement('bpmn:RPATask', { rpaAActivity: "", rpaATaskList: ""}, rpaExtensionElements, bpmnFactory);
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
                if(rpaFData.get('rpaATaskList') == "") updateTaskList(element, values.activity);
                if (typeof rpaFData.rpaAActivity !== 'undefined') {
                    commands.push(cmdHelper.addElementsTolist(element, rpaFData, 'rpaAActivity', values.activity));
                } else {
                    commands.push(cmdHelper.updateBusinessObject(element, rpaFData, {
                        rpaAActivity: values.activity,
                        rpaATaskList: ""
                    }));
                }
                return commands;
            },
            setControlValue: true
        });
    }

    function getTaskListEntry(element, bpmnFactory) {
        return entryFactory.selectBox({
            id: 'taskList',
            label: 'RPA Task List',
            selectOptions: getRPATaskListOptions(element),
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
                var rpaFData = getRpaData(element);
                
                cmdHelper.updateBusinessObject(element, rpaFData, {
                    rpaATaskList: result.taskList
                });

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
            setControlValue: true,
            hidden: function(element, node) {
                var rpaFData = getRpaData(element);
                return !(rpaFData && rpaFData.get("rpaAActivity"));
            }
        });
    }

    function getAttributesEntry(element, bpmnFactory) {
        var attributesList = getRPATaskAttributes(element);
        let fieldsList = [];
        attributesList.forEach((each_attr, i) => {
            let tmp = '';
            let taskey = each_attr['name'];
            if(["text", "email", "password", "number", "multipart"].indexOf(each_attr['type']) > -1){
                tmp = entryFactory.validationAwareTextField({
                    id: each_attr['id'],
                    label: each_attr['label'],
                    modelProperty: taskey,
                    description: each_attr['placeholder'],
                    getProperty: function(element, node) {
                        var result = {};
                        result[taskey] = '';
                        var bo = getBusinessObject(element);
                        var formDataExtension = getExtensionElements(bo, "bpmn:RPATask");
                        if (formDataExtension) {
                            var formData = getRpaData(element);
                            var storedValue = formData.get(taskey);
                            result[taskey] = storedValue;
                        }
                        return result[taskey];
                    },
                    setProperty: function(element, properties, node) {
                        var bo = getBusinessObject(element); var commands = [];
                        var rpaExtensionElements = getExtensionElements(bo, "bpmn:RPATask");
                        if (!rpaExtensionElements) {
                            rpaExtensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
                            commands.push(cmdHelper.updateProperties(element, { extensionElements: rpaExtensionElements }));
                        }
                        var rpaFData = getRpaData(element);
                        if(!rpaFData){
                            rpaFData = elementHelper.createElement('bpmn:RPATask', properties, rpaExtensionElements, bpmnFactory);
                            commands.push(cmdHelper.addAndRemoveElementsFromList(
                                element,
                                rpaExtensionElements,
                                'values',
                                'extensionElements',
                                [rpaFData],
                                []
                            ));
                        }
                        var field = elementHelper.createElement('bpmn:RPATask', properties , rpaFData, bpmnFactory);
                        if (typeof rpaFData[taskey] !== 'undefined') {
                            commands.push(cmdHelper.addElementsTolist(element, rpaFData, taskey, properties));
                        } else {
                            commands.push(cmdHelper.updateBusinessObject(element, rpaFData, properties ));
                        }
                        return commands;
                    },
                    validate: function(element, values, node) {
                        var validation = {};
                        var fieldValue = values[taskey];
                        if(fieldValue){
                            if(each_attr['attributeMax'] == each_attr['attributeMin'] && fieldValue.length != each_attr['attributeMin'])
                                validation[taskey] = each_attr['label']+' length must be '+each_attr['attributeMin']+' characters'
                            else if(fieldValue.length > each_attr['attributeMax'] || fieldValue.length < each_attr['attributeMin'])
                                validation[taskey] = each_attr['label']+' length must lie between '+each_attr['attributeMin']+' - '+each_attr['attributeMax']+' characters';
                        }else{
                            if(each_attr['required'])
                                validation[taskey] = each_attr['label']+' is mandatory';
                        }
                        return validation;
                    },
                    hidden: function(element, node) {
                        var rpaFData = getRpaData(element);
                        return !(rpaFData && rpaFData.get("rpaAActivity") && rpaFData.get("rpaATaskList") && each_attr['visibility']);
                    }
                })                
            }else if(each_attr['type'] == "dropdown"){
                tmp = entryFactory.selectBox({
                    id: each_attr['id'],
                    label: each_attr['label'],
                    description: each_attr['placeholder'],
                    modelProperty: each_attr['type']+"_"+each_attr['id'],
                    selectOptions: getAttrSelectOptions(each_attr['options']),
                    get: function(element, node) {
                        var result = {};
                        result[taskey] = ''
                        var bo = getBusinessObject(element);
                        var formDataExtension = getExtensionElements(bo, "bpmn:RPATask");
                        if (formDataExtension) {
                            var formData = getRpaData(element);
                            var storedValue = formData.get(taskey);
                            result[taskey]= storedValue ;
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
                        let dataJson = {};
                        dataJson[taskey] = "";
                        if(!rpaFData){
                            rpaFData = elementHelper.createElement('bpmn:RPATask', dataJson, rpaExtensionElements, bpmnFactory);
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
                        if (typeof rpaFData[taskey] !== 'undefined') {
                            commands.push(cmdHelper.addElementsTolist(element, rpaFData, taskey, values.taskList));
                        } else {
                            dataJson[taskey] = values.taskList;
                            commands.push(cmdHelper.updateBusinessObject(element, rpaFData, dataJson));
                        }
                        return commands;
                    },
                    hidden: function(element, node) {
                        var rpaFData = getRpaData(element);
                        return !(rpaFData && rpaFData.get("rpaAActivity") && rpaFData.get("rpaATaskList"));
                    }
                });
            }else if(each_attr['type'] == "checkbox"){
                tmp = entryFactory.checkbox({
                    id: each_attr['id'],
                    label: each_attr['label'],
                    description: each_attr['placeholder'],
                    modelProperty: each_attr['type']+"_"+each_attr['id'],
                    selectOptions: getAttrSelectOptions(each_attr['options']),
                    get: function(element, node) {
                        var result = {};
                        result[taskey] = ''
                        var bo = getBusinessObject(element);
                        var formDataExtension = getExtensionElements(bo, "bpmn:RPATask");
                        if (formDataExtension) {
                            var formData = getRpaData(element);
                            var storedValue = formData.get(taskey);
                            result = { taskey: storedValue };
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
                            rpaFData = elementHelper.createElement('bpmn:RPATask', { taskey: "" }, rpaExtensionElements, bpmnFactory);
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
                        if (typeof rpaFData[taskey] !== 'undefined') {
                            commands.push(cmdHelper.addElementsTolist(element, rpaFData, taskey, values.taskList));
                        } else {
                            commands.push(cmdHelper.updateBusinessObject(element, rpaFData, {
                                taskey: values.taskList
                            }));
                        }
                        return commands;
                    },
                    hidden: function(element, node) {
                        var rpaFData = getRpaData(element);
                        return !(rpaFData && rpaFData.get("rpaAActivity") && rpaFData.get("rpaATaskList"));
                    }
                });
            }else if(each_attr['type'] == "textarea"){
                tmp = entryFactory.textBox({
                    id: each_attr['id'],
                    label: each_attr['label'],
                    modelProperty: taskey,
                    description: each_attr['placeholder'],
                    getProperty: function(element, node) {
                        var result = {};
                        result[taskey] = '';
                        var bo = getBusinessObject(element);
                        var formDataExtension = getExtensionElements(bo, "bpmn:RPATask");
                        if (formDataExtension) {
                            var formData = getRpaData(element);
                            var storedValue = formData.get(taskey);
                            result[taskey] = storedValue;
                        }
                        return result[taskey];
                    },
                    setProperty: function(element, properties, node) {
                        var bo = getBusinessObject(element); var commands = [];
                        var rpaExtensionElements = getExtensionElements(bo, "bpmn:RPATask");
                        if (!rpaExtensionElements) {
                            rpaExtensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
                            commands.push(cmdHelper.updateProperties(element, { extensionElements: rpaExtensionElements }));
                        }
                        var rpaFData = getRpaData(element);
                        if(!rpaFData){
                            rpaFData = elementHelper.createElement('bpmn:RPATask', properties, rpaExtensionElements, bpmnFactory);
                            commands.push(cmdHelper.addAndRemoveElementsFromList(
                                element,
                                rpaExtensionElements,
                                'values',
                                'extensionElements',
                                [rpaFData],
                                []
                            ));
                        }
                        var field = elementHelper.createElement('bpmn:RPATask', properties , rpaFData, bpmnFactory);
                        if (typeof rpaFData[taskey] !== 'undefined') {
                            commands.push(cmdHelper.addElementsTolist(element, rpaFData, taskey, properties));
                        } else {
                            commands.push(cmdHelper.updateBusinessObject(element, rpaFData, properties ));
                        }
                        return commands;
                    },
                    validate: function(element, values, node) {
                        var validation = {};
                        var fieldValue = values[taskey];
                        if(fieldValue){
                            if(each_attr['attributeMax'] == each_attr['attributeMin'] && fieldValue.length != each_attr['attributeMin'])
                                validation[taskey] = each_attr['label']+' length must be '+each_attr['attributeMin']+' characters'
                            else if(fieldValue.length > each_attr['attributeMax'] || fieldValue.length < each_attr['attributeMin'])
                                validation[taskey] = each_attr['label']+' length must lie between '+each_attr['attributeMin']+' - '+each_attr['attributeMax']+' characters';
                        }else{
                            if(each_attr['required'])
                                validation[taskey] = each_attr['label']+' is mandatory';
                        }
                        return validation;
                    },
                    hidden: function(element, node) {
                        var rpaFData = getRpaData(element);
                        return !(rpaFData && rpaFData.get("rpaAActivity") && rpaFData.get("rpaATaskList") && each_attr['visibility']);
                    }
                })
            }
            fieldsList.push(tmp)
        })
        return fieldsList;
    }
    
    function getRPAEntries(element, bpmnFactory) {
        var processBo = getBusinessObject(element);
        if (is(processBo, 'bpmn:Participant')) {
          processBo = processBo.processRef;
        }
        var entries_ = [getActivityEntry(element, bpmnFactory)]
        var rpaFData = getRpaData(element);
        if(rpaFData && rpaFData.get("rpaAActivity"))
            entries_.push(getTaskListEntry(element, bpmnFactory))
        if(rpaFData && rpaFData.get("rpaAActivity") && rpaFData.get("rpaATaskList")){
            let attrList = getAttributesEntry(element, bpmnFactory)
            if(attrList.length > 0)
                entries_.push(...attrList)
        }
        return {
            entries: entries_
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