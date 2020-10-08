import * as _Modeler from "bpmn-js/dist/bpmn-modeler.production.min.js";
import * as _PropertiesPanelModule from 'bpmn-js-properties-panel';
import * as _BpmnPropertiesProvider from 'bpmn-js-properties-panel/lib/provider/camunda';
import * as _EntryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

export const InjectionNames = {
  eventBus: 'eventBus',
  // bpmnFactory: 'bpmnFactory',
  elementRegistry: 'elementRegistry',
  elementTemplates: 'elementTemplates',
  translate: 'translate',
  propertiesProvider: 'propertiesProvider',
  bpmnPropertiesProvider: 'bpmnPropertiesProvider',
  injector: 'injector'
};

export const Modeler = _Modeler;
export const PropertiesPanelModule = _PropertiesPanelModule;
export const EntryFactory = _EntryFactory;
export const OriginalPropertiesProvider = _BpmnPropertiesProvider;

export interface IPropertiesProvider {
  getTabs(elemnt): any;
}