// import {EntryFactory, IPropertiesProvider} from './bpmn-js';

// export class IOSpecificationProvider implements IPropertiesProvider {

//   static $inject = ['translate', 'bpmnPropertiesProvider'];

//   constructor(private translate, private bpmnPropertiesProvider, private previewFormProvider) { }

//   getTabs(element) {
//     let actualTabs = this.bpmnPropertiesProvider.getTabs(element); //this.previewFormProvider.getTabs(element);
//     let IOSpecTab = {
//       id: 'params-io-specification',
//       label: this.translate('I/O Specification'),
//       groups: [
//         {
//           id: 'parameters',
//           label: this.translate('Parameters'),
//           entries: [
//             EntryFactory.textBox({
//               id: 'custom',
//               label: this.translate('customText'),
//               modelProperty: 'customText'
//             }),
//           ]
//         }
//       ]
//     };

//     actualTabs.splice(1,0,IOSpecTab);
//     return actualTabs;
//   }

//   getProperties(element) {
//     const propertiesParent = this.getInputOutput(element);
  
//     return propertiesParent ? propertiesParent.get('values') : [];
//   }
  
//   getInputOutput(element) {
//     const bo = this.getBusinessObject(element);
  
//     const properties = this.getExtensionElements(bo, 'camunda:Properties') || [];
  
//     if (properties.length) {
//       return properties[0];
//     }
  
//     return null;
//   }
  
//   getIoProperties(element, type) {
//     const properties = this.getProperties(element);
  
//     return (
//       properties
//         .filter(property => isIoProperty)
//         .filter(property => parseIoProperty(property).type === type)
//     );
//   }
  
//   getInputParameters(element) {
//     return this.getIoProperties(element, 'input');
//   }
  
//   getOutputParameters(element) {
//     return this.getIoProperties(element, 'output');
//   }
  
//   getInputParameter(element, idx) {
//     return this.getInputParameters(element)[idx];
//   }
  
//   getOutputParameter(element, idx) {
//     return this.getOutputParameters(element)[idx];
//   }
  
  
//   createElement(type, parent, factory, properties) {
//     return elementHelper.createElement(type, properties, parent, factory);
//   }
  
//   createCamundaProperties(parent, bpmnFactory, properties) {
//     return this.createElement('camunda:Properties', parent, bpmnFactory, properties);
//   }
  
  
//   /**
//    * Defines the input/output tab contents.
//    */
//   inputOutput(element, bpmnFactory) {
  
//     var processBo = this.getBusinessObject(element);
  
//     if (is(processBo, 'bpmn:Participant')) {
//       processBo = processBo.processRef;
//     }
  
//     newElement(type) {
  
//       return function(element, extensionElements, value) {
//         var commands = [];
  
//         var camundaProperties = getInputOutput(processBo);
//         if (!camundaProperties) {
//           camundaProperties = createCamundaProperties(extensionElements, bpmnFactory, {
//             values: []
//           });
  
//           commands.push(cmdHelper.addAndRemoveElementsFromList(
//             element,
//             extensionElements,
//             'values',
//             'extensionElements',
//             [ camundaProperties ],
//             []
//           ));
//         }
  
//         var newElem = createIoProperty(bpmnFactory, {
//           type,
//           name: `var_${ids.next()}`,
//           dataType: 'String',
//           description: ''
//         });
  
//         commands.push(cmdHelper.addElementsTolist(element, camundaProperties, 'values', [ newElem ]));
  
//         return commands;
//       };
//     }
  
//     removeElement(type) {
//       return function(element, extensionElements, value, idx) {
  
//         var properties = getIoProperties(processBo, type);
//         var property = properties[idx];
  
//         var camundaProperties = getInputOutput(processBo);
  
//         var removePropertyCommand = cmdHelper.removeElementsFromList(
//           element, camundaProperties, 'values', null, [ property ]
//         );
  
//         return [
//           removePropertyCommand
//         ];
//       };
//     }
  
//     setOptionLabelValue(getter) {
//       return function(element, node, option, property, value, idx) {
//         var parameter = getter(processBo, idx);
  
//         var ioProperty = parseIoProperty(parameter);
  
//         option.text = `${ioProperty.name} : ${ioProperty.dataType}`;
//       };
//     };
  
  
//     // input parameters //////////////////////////////
  
//     var inputEntry = extensionElementsEntry(element, bpmnFactory, {
//       id: 'process-io-inputs',
//       label: 'Inputs',
//       modelProperty: 'name',
//       prefix: 'Input',
//       resizable: true,
  
//       businessObject: processBo,
  
//       createExtensionElement: newElement('input'),
//       removeExtensionElement: removeElement('input'),
  
//       getExtensionElements: function(element) {
//         return getInputParameters(processBo);
//       },
  
//       onSelectionChange: function(element, node, event, scope) {
//         outputEntry && outputEntry.deselect(element, node);
//       },
  
//       setOptionLabelValue: setOptionLabelValue(getInputParameter)
  
//     });
  
  
//     // output parameters ///////////////////////////
  
//     var outputEntry = extensionElementsEntry(element, bpmnFactory, {
//       id: 'process-io-outputs',
//       label: 'Outputs',
//       modelProperty: 'name',
//       prefix: 'Output',
//       resizable: true,
  
//       businessObject: processBo,
  
//       createExtensionElement: newElement('output'),
//       removeExtensionElement: removeElement('output'),
  
//       getExtensionElements: function(element) {
//         return getOutputParameters(processBo);
//       },
  
//       onSelectionChange: function(element, node, event, scope) {
//         inputEntry.deselect(element, node);
//       },
  
//       setOptionLabelValue: setOptionLabelValue(getOutputParameter)
  
//     });
  
  
//     getSelectedParameter(element, node) {
//       var inputOption = inputEntry.getSelected(element, node);
  
//       if (inputOption && inputOption.idx !== -1) {
//         return getInputParameter(processBo, inputOption.idx);
//       }
  
//       var outputOption = outputEntry.getSelected(element, node);
  
//       if (outputOption && outputOption.idx !== -1) {
//         return getOutputParameter(processBo, outputOption.idx);
//       }
  
//       return null;
//     };
  
  
//     return {
//       getSelectedParameter,
//       entries: [
//         inputEntry,
//         outputEntry
//       ]
//     };
  
//   };
  
  
//   /**
//    * Defines the two lists displaying input and output mappings.
//    *
//    * @return {Object}
//    */
//   export default function processIoProps(group, element, injector) {
  
//     var {
//       entries,
//       getSelectedParameter
//     } = injector.invoke(inputOutput, null, { element });
  
//     group.entries = group.entries.concat(entries);
  
//     return {
//       getSelectedParameter
//     };
  
//   }
  
  
// }