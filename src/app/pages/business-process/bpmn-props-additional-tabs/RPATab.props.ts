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

    export function getRPAEntries(translate) {
        // var processBo = getBusinessObject(element);
        // if (is(processBo, 'bpmn:Participant')) {
        //   processBo = processBo.processRef;
        // }
        // Bot List //////////////////////////////
        // rest.getAllActiveBots().subscribe(res => {
        //     let tmp = [];
        //     console.log(res)
        // })
                var botList = entryFactory.selectBox({
                    id: 'activity',
                    label: translate('RPA Activity'),
                    selectOptions: [
                        { name: 'Vaidehi', value: 'Vaidehi' },
                        { name: 'Kiran', value: 'Kiran' }
                    ],
                    modelProperty: 'activity',
                    emptyParameter: true,
                    get: function(element, node) {
                        var result = { rpaActivity: '' };
                        var bo = getBusinessObject(element);
                        var formDataExtension = getExtensionElements(bo, "rpa:activity");
                        if (formDataExtension) {
                            var formData = formDataExtension[0];
                            var storedValue = formData.get('rpaActivity');
                            result = { rpaActivity: storedValue };
                        }
                        return result;
                    },
                    set: function(element, values, node) {
                        var bo = getBusinessObject(element);
                        var rpaFormDataList = getExtensionElements(bo, "rpa:activity");
                        var rpaFData = rpaFormDataList[0];
                        return cmdHelper.updateBusinessObject(element, rpaFData, { 'rpaActivity': values.rpaActivity || undefined });
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