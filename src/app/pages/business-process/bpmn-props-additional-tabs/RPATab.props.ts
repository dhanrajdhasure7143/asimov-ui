import {
    getBusinessObject,
    is
  } from 'bpmn-js/lib/util/ModelUtil';
  
  import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';
  import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';
  
  import Ids from 'ids';
  
  import extensionElementsEntry from 'bpmn-js-properties-panel/lib/provider/camunda/parts/implementation/ExtensionElements';
  import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
  import { getExtensionElements } from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper';

    export function getRPAEntries(rest) {
        // var processBo = getBusinessObject(element);
        // if (is(processBo, 'bpmn:Participant')) {
        //   processBo = processBo.processRef;
        // }
        // Bot List //////////////////////////////
        // rest.getAllActiveBots().subscribe(res => {
        //     let tmp = [];
        //     console.log(res)
        // })
                var botList = entryFactory.comboBox({
                    id: 'rpa-bot',
                    label: 'RPABots',
                    selectOptions: [
                        { name: 'string', value: 'string' },
                        { name: 'long', value: 'long' },
                        { name: 'boolean', value: 'boolean' },
                        { name: 'date', value: 'date' },
                        { name: 'enum', value: 'enum' }
                    ],
                    modelProperty: 'RPABots',
                    emptyParameter: true,
                    get: function(element, node) {
                        // var selectedFormField 
                        // // = getSelectedParameter(element, node);
                    
                        // if (selectedFormField) {
                        //     return { type: selectedFormField.type };
                        // } else {
                        //     return {};
                        // }
                    },
                    set: function(element, values, node) {
                        // var selectedFormField,
                        // // = getSelectedParameter(element, node),
                        //     formData = getExtensionElements(getBusinessObject(element), 'camunda:FormData')[0],
                        //     commands = [];
                    
                        // if (selectedFormField.type === 'enum' && values.type !== 'enum') {
                        //     // delete camunda:value objects from formField.values when switching from type enum
                        //     commands.push(cmdHelper.updateBusinessObject(element, selectedFormField, { values: undefined }));
                        // }
                        // if (values.type === 'boolean' && selectedFormField.get('id') === formData.get('businessKey')) {
                        //     commands.push(cmdHelper.updateBusinessObject(element, formData, { 'businessKey': undefined }));
                        // }
                        // commands.push(cmdHelper.updateBusinessObject(element, selectedFormField, values));
                    
                        // return commands;
                    }
                });
        
                return [botList];
    };
//   }
  
//   const ids = new Ids([ 16, 36, 1 ]);
  
//   function getProperties(element) {
//     const propertiesParent = getBots(element);
  
//     return propertiesParent ? propertiesParent.get('values') : [];
//   }
  
//   function getBots(element) {
//     const bo = getBusinessObject(element);
//     const properties = getExtensionElements(bo, 'camunda:Properties') || [];
//     if (properties.length) {
//       return properties[0];
//     }
  
//     return null;
//   }
  
//   function getIoProperties(element, type) {
//     const properties = getProperties(element);
  
//     // return (
//     //   properties
//     //     .filter(property => isIoProperty)
//     //     .filter(property => parseIoProperty(property).type === type)
//     // );
//     return properties;
//   }
  
//   function getBotParameters(element) {
//     return getIoProperties(element, 'comboBox');
//   }
  
//   function getBotParameter(element, idx) {
//     return getBotParameters(element)[idx];
//   }
  
//   function createElement(type, parent, factory, properties) {
//     return elementHelper.createElement(type, properties, parent, factory);
//   }
  
//   function createCamundaProperties(parent, bpmnFactory, properties) {
//     return createElement('camunda:Properties', parent, bpmnFactory, properties);
//   }
  
  
  /**
   * Defines the bot list.
   */
 
  
    // function getSelectedParameter(element, node) {
    //   var selectedBot = botSelection.getSelected(element, node);
  
    //   if (selectedBot && selectedBot.idx !== -1) {
    //     return getBotParameter(processBo, selectedBot.idx);
    //   }
  
    //   return null;
    // };
  
  
    
  
  
  /**
   * Defines the bot list
   *
   * @return {Object}
   */
//   export default function rpaProps(group, element, injector) {
  
//     var {
//       entries,
//       getSelectedParameter
//     } = injector.invoke(botList, null, { element });
  
//     group.entries = group.entries.concat(entries);
  
//     return {
//       getSelectedParameter
//     };
  
//   }