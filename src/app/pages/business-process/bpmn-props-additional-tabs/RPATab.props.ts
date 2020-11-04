import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';

  import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';
  import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

  import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
  import { getExtensionElements } from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';
    import { RestApiService } from '../../services/rest-api.service';

    function getRpaData(element, tag) {
        var bo = getBusinessObject(element);
        var formData = getExtensionElements(bo, tag);
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
            var rpaFData = getRpaData(element, 'rpa:Activity');
            if(rpaFData){
                let activity = rpaFData.get("activity");
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
        var rpaFData = getRpaData(element, 'rpa:Activity');
        if(rpaFData){
            let taskId = rpaFData.get("taskId");
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
                var formDataExtension = getExtensionElements(bo, "bpmn:rpaTask");
                if(!formDataExtension)
                    formDataExtension = getExtensionElements(bo, "rpa:Activity")
                if (formDataExtension) {
                    var formData = getRpaData(element, "rpa:Activity");
                    var storedValue = formData.get('activity');
                    result = { activity: storedValue };
                }
                return result;
            },
            set: function(element, values, node) {
                var bo = getBusinessObject(element); var commands = [];
                var rpaExtensionElements = getExtensionElements(bo, "bpmn:rpaTask");
                if(!rpaExtensionElements)
                    rpaExtensionElements = getExtensionElements(bo, "rpa:Activity");
                if (!rpaExtensionElements) {
                    rpaExtensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
                    commands.push(cmdHelper.updateProperties(element, { extensionElements: rpaExtensionElements }));
                }
                var rpaFData = getRpaData(element, "rpa:Activity");
                if(!rpaFData){
                    rpaFData = elementHelper.createElement('rpa:Activity', { activity: "", taskId: ""}, rpaExtensionElements, bpmnFactory);
                    commands.push(cmdHelper.addAndRemoveElementsFromList(
                        element,
                        rpaExtensionElements,
                        'values',
                        'extensionElements',
                        [rpaFData],
                        []
                        ));
                }
                var field = elementHelper.createElement('rpa:Activity', values.activity , rpaFData, bpmnFactory);
                if(rpaFData.get('taskId') == "") updateTaskList(element, values.activity);
                if (typeof rpaFData.activity !== 'undefined') {
                    commands.push(cmdHelper.addElementsTolist(element, rpaFData, 'activity', values.activity));
                } else {
                    commands.push(cmdHelper.updateBusinessObject(element, rpaFData, {
                        activity: values.activity,
                        taskId: ""
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
                var formDataExtension = getExtensionElements(bo, "rpa:Activity");
                if (formDataExtension) {
                    var formData = getRpaData(element, "rpa:Activity");
                    var storedValue = formData.get('taskId');
                    result = { taskList: storedValue };
                }
                var rpaFData = getRpaData(element, "rpa:Activity");

                cmdHelper.updateBusinessObject(element, rpaFData, {
                    taskId: result.taskList
                });

                return result;
            },
            set: function(element, values, node) {
                var bo = getBusinessObject(element); var commands = [];
                var rpaExtensionElements = getExtensionElements(bo, "bpmn:rpaTask");
                if(!rpaExtensionElements)
                    rpaExtensionElements = getExtensionElements(bo, "rpa:Activity");
                if (!rpaExtensionElements) {
                    rpaExtensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
                    commands.push(cmdHelper.updateProperties(element, { extensionElements: rpaExtensionElements }));
                }
                var rpaFData = getRpaData(element, "rpa:Activity");
                if(!rpaFData){
                    rpaFData = elementHelper.createElement('rpa:Activity', { taskId: "" }, rpaExtensionElements, bpmnFactory);
                    commands.push(cmdHelper.addAndRemoveElementsFromList(
                        element,
                        rpaExtensionElements,
                        'values',
                        'extensionElements',
                        [rpaFData],
                        []
                    ));
                }
                var field = elementHelper.createElement('rpa:Activity', values.taskList , rpaFData, bpmnFactory);
                if (typeof rpaFData.taskId !== 'undefined') {
                    commands.push(cmdHelper.addElementsTolist(element, rpaFData, 'taskId', values.taskList));
                } else {
                    commands.push(cmdHelper.updateBusinessObject(element, rpaFData, {
                        taskId: values.taskList
                    }));
                }
                return commands;
            },
            setControlValue: true,
            hidden: function(element, node) {
                var rpaFData = getRpaData(element, "rpa:Activity");
                return !(rpaFData && rpaFData.get("activity"));
            }
        });
    }

    function getDesc(element, attr){
        var rpaFData = getRpaData(element, 'rpa:Activity');
        if(rpaFData){
            let taskId = rpaFData.get("taskId");
            if(taskId == "16" && attr['name'] == "loginSession") return "${ Output reference } from Login mail should be input";
        }
        return attr['placeholder'];
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
                    description: getDesc(element, each_attr),
                    getProperty: function(element, node) {
                        var result = {};
                        result[taskey] = '';
                        var bo = getBusinessObject(element);
                        var formDataExtension = getExtensionElements(bo, "bpmn:rpaTask");
                        if(each_attr['id'] == "61")
                            formDataExtension = getExtensionElements(bo, "rpa:OutputParams");
                        else if(!formDataExtension)
                            formDataExtension = getExtensionElements(bo, "rpa:Activity");
                        if (formDataExtension) {
                            let ext = each_attr['id'] == "61" ? "rpa:OutputParams": "rpa:Activity";
                            var formData = getRpaData(element, ext);
                            var storedValue = formData.get(taskey);
                            if(each_attr['type'] == 'password' && storedValue)
                                storedValue = '\u2022'.repeat(storedValue.length);
                            result[taskey] = storedValue;
                        }
                        return result[taskey];
                    },
                    setProperty: function(element, properties, node) {
                        var bo = getBusinessObject(element); var commands = [];
                        var rpaExtensionElements = getExtensionElements(bo, "bpmn:rpaTask");
                        if(each_attr['id'] == "61")
                            rpaExtensionElements = getExtensionElements(bo, "rpa:OutputParams");
                        else if(!rpaExtensionElements)
                            rpaExtensionElements = getExtensionElements(bo, "rpa:Activity");
                        let ext = each_attr['id'] == "61" ? "rpa:OutputParams": "rpa:Activity";
                        if (!rpaExtensionElements) {
                            rpaExtensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
                            commands.push(cmdHelper.updateProperties(element, { extensionElements: rpaExtensionElements }));
                        }
                        var rpaFData = getRpaData(element, ext);
                        if(!rpaFData){
                            rpaFData = elementHelper.createElement(ext, properties, rpaExtensionElements, bpmnFactory);
                            commands.push(cmdHelper.addAndRemoveElementsFromList(
                                element,
                                rpaExtensionElements,
                                'values',
                                'extensionElements',
                                [rpaFData],
                                []
                            ));
                        }
                        var field = elementHelper.createElement(ext, properties , rpaFData, bpmnFactory);
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
                            else if(each_attr['type'] == 'email'){
                                let re = /^[a-zA-Z]{1}[a-zA-Z0-9+.]+@[a-zA-Z0-9.-]{2,7}.[a-zA-Z]{2,7}$/;
                                if(!re.test(fieldValue))
                                    validation[taskey] = 'Please enter valid ' + each_attr['label'];
                            }
                            else if(each_attr['type'] == 'number'){
                                let re = /^[0-9]+$/;
                                if(!re.test(fieldValue))
                                    validation[taskey] = each_attr['label'] + ' must contain only numbers';
                            }
                        }else{
                            if(each_attr['required'])
                                validation[taskey] = each_attr['label']+' is mandatory';
                        }
                        return validation;
                    },
                    hidden: function(element, node) {
                        var rpaFData = getRpaData(element, "rpa:Activity");
                        return !(rpaFData && rpaFData.get("activity") && rpaFData.get("taskId") && each_attr['visibility']);
                    }
                })
            }else if(each_attr['type'] == "dropdown"){
                tmp = entryFactory.selectBox({
                    id: each_attr['id'],
                    label: each_attr['label'],
                    description: each_attr['placeholder'],
                    modelProperty: taskey, //each_attr['type']+"_"+each_attr['id'],
                    selectOptions: getAttrSelectOptions(each_attr['options']),
                    // emptyParameter: true,
                    get: function(element, node) {
                        var result = {};
                        result[taskey] = ''
                        var bo = getBusinessObject(element);
                        var formDataExtension = getExtensionElements(bo, "bpmn:rpaTask");
                        if(!formDataExtension)
                            formDataExtension = getExtensionElements(bo, "rpa:Activity");
                        if (formDataExtension) {
                            var formData = getRpaData(element, "rpa:Activity");
                            var storedValue = formData.get(taskey);
                            if(storedValue)
                                result[taskey]= storedValue ;
                        }
                        return result;
                    },
                    set: function(element, values, node) {
                        var bo = getBusinessObject(element); var commands = [];
                        var rpaExtensionElements = getExtensionElements(bo, "bpmn:rpaTask");
                        if(!rpaExtensionElements)
                            rpaExtensionElements = getExtensionElements(bo, "rpa:Activity");
                        if (!rpaExtensionElements) {
                            rpaExtensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
                            commands.push(cmdHelper.updateProperties(element, { extensionElements: rpaExtensionElements }));
                        }
                        var rpaFData = getRpaData(element,"rpa:Activity");
                        if(!rpaFData){
                            rpaFData = elementHelper.createElement('rpa:Activity', values, rpaExtensionElements, bpmnFactory);
                            commands.push(cmdHelper.addAndRemoveElementsFromList(
                                element,
                                rpaExtensionElements,
                                'values',
                                'extensionElements',
                                [rpaFData],
                                []
                            ));
                        }
                        var field = elementHelper.createElement('rpa:Activity', values[taskey] , rpaFData, bpmnFactory);
                        if (typeof rpaFData[taskey] !== 'undefined') {
                            commands.push(cmdHelper.addElementsTolist(element, rpaFData, taskey, values[taskey]));
                        } else {
                            commands.push(cmdHelper.updateBusinessObject(element, rpaFData, values));
                        }
                        return commands;
                    },
                    validate: function(element, values, node) {
                        var validation = {};
                        var fieldValue = values[taskey];
                        if(!fieldValue && each_attr['required'])
                            validation[taskey] = each_attr['label']+' is mandatory';
                        return validation;
                    },
                    hidden: function(element, node) {
                        var rpaFData = getRpaData(element, "rpa:Activity");
                        return !(rpaFData && rpaFData.get("activity") && rpaFData.get("taskId"));
                    }
                });
            }else if(each_attr['type'] == "checkbox"){
                tmp = entryFactory.checkbox({
                    id: each_attr['id'],
                    label: each_attr['label'],
                    description: each_attr['placeholder'],
                    modelProperty: taskey,
                    selectOptions: getAttrSelectOptions(each_attr['options']),
                    get: function(element) {
                        var result = {};
                        result[taskey] = ''
                        var bo = getBusinessObject(element);
                        var formDataExtension = getExtensionElements(bo, "bpmn:rpaTask");
                        if(!formDataExtension)
                            formDataExtension = getExtensionElements(bo, "rpa:Activity");
                        if (formDataExtension) {
                            var formData = getRpaData(element, "rpa:Activity");
                            var storedValue = formData.get(taskey);
                            if(storedValue)
                                result[taskey] = storedValue;
                        }
                        return result;
                    },
                    set: function(element, values) {
                        var bo = getBusinessObject(element); var commands = [];
                        var rpaExtensionElements = getExtensionElements(bo, "bpmn:rpaTask");
                        if(!rpaExtensionElements)
                            rpaExtensionElements = getExtensionElements(bo, "rpa:Activity");
                        if (!rpaExtensionElements) {
                            rpaExtensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
                            commands.push(cmdHelper.updateProperties(element, { extensionElements: rpaExtensionElements }));
                        }
                        var rpaFData = getRpaData(element, "rpa:Activity");
                        values[taskey] = !rpaFData.get(taskey)
                        if(!rpaFData){
                            let dataJson = {};
                            dataJson[taskey] = '';
                            rpaFData = elementHelper.createElement('rpa:Activity', dataJson, rpaExtensionElements, bpmnFactory);
                            commands.push(cmdHelper.addAndRemoveElementsFromList(
                                element,
                                rpaExtensionElements,
                                'values',
                                'extensionElements',
                                [rpaFData],
                                []
                            ));
                        }
                        var field = elementHelper.createElement('rpa:Activity', values[taskey] , rpaFData, bpmnFactory);
                        if (typeof rpaFData[taskey] !== 'undefined') {
                            commands.push(cmdHelper.addElementsTolist(element, rpaFData, taskey, values[taskey]));
                        } else {
                            commands.push(cmdHelper.updateBusinessObject(element, rpaFData, values));
                        }
                        return commands;
                    },
                    hidden: function(element, node) {
                        var rpaFData = getRpaData(element, "rpa:Activity");
                        return !(rpaFData && rpaFData.get("activity") && rpaFData.get("taskId"));
                    }
                });
            }else if(each_attr['type'] == "textarea"){
                tmp = entryFactory.textBox({
                    id: each_attr['id'],
                    label: each_attr['label'],
                    modelProperty: taskey,
                    description: each_attr['placeholder'],
                    get: function(element, node) {
                        var result = {};
                        result[taskey] = '';
                        var bo = getBusinessObject(element);
                        var formDataExtension = getExtensionElements(bo, "bpmn:rpaTask");
                        if(!formDataExtension)
                            formDataExtension = getExtensionElements(bo, "rpa:Activity");
                        if (formDataExtension) {
                            var formData = getRpaData(element, "rpa:Activity");
                            var storedValue = formData.get(taskey);
                            if(storedValue)
                                result[taskey] = storedValue;
                        }
                        return result[taskey];
                    },
                    set: function(element, values, node) {
                        var bo = getBusinessObject(element); var commands = [];
                        var rpaExtensionElements = getExtensionElements(bo, "bpmn:rpaTask");
                        if(!rpaExtensionElements)
                            rpaExtensionElements = getExtensionElements(bo, "rpa:Activity");
                        if (!rpaExtensionElements) {
                            rpaExtensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
                            commands.push(cmdHelper.updateProperties(element, { extensionElements: rpaExtensionElements }));
                        }
                        var rpaFData = getRpaData(element, "rpa:Activity");
                        if(!rpaFData){
                            rpaFData = elementHelper.createElement('rpa:Activity', values, rpaExtensionElements, bpmnFactory);
                            commands.push(cmdHelper.addAndRemoveElementsFromList(
                                element,
                                rpaExtensionElements,
                                'values',
                                'extensionElements',
                                [rpaFData],
                                []
                            ));
                        }
                        var field = elementHelper.createElement('rpa:Activity', values[taskey] , rpaFData, bpmnFactory);
                        if (typeof rpaFData[taskey] !== 'undefined') {
                            commands.push(cmdHelper.addElementsTolist(element, rpaFData, taskey, values[taskey]));
                        } else {
                            commands.push(cmdHelper.updateBusinessObject(element, rpaFData, values ));
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
                        var rpaFData = getRpaData(element, "rpa:Activity");
                        return !(rpaFData && rpaFData.get("activity") && rpaFData.get("taskId") && each_attr['visibility']);
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
        var rpaFData = getRpaData(element, "rpa:Activity");
        if(rpaFData && rpaFData.get("activity"))
            entries_.push(getTaskListEntry(element, bpmnFactory))
        if(rpaFData && rpaFData.get("activity") && rpaFData.get("taskId")){
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