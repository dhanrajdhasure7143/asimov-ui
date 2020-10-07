import {EntryFactory, IPropertiesProvider} from '../bpmn-js';

export class CustomPropsProvider implements IPropertiesProvider {

  static $inject = ['translate', 'bpmnPropertiesProvider'];

// Note that names of arguments must match injected modules, see InjectionNames.
  constructor(private translate, private bpmnPropertiesProvider) {
  }

  getTabs(element) {
    console.log(this.constructor.name, 'Creating property tabs');
    return this.bpmnPropertiesProvider.getTabs(element)
      .splice(1,0,{
        id: 'custom',
        label: this.translate('I/O Specification'),
        groups: [
          {
            id: 'parameters',
            label: this.translate('Parameters'),
            entries: [
              EntryFactory.textBox({
                id: 'custom',
                label: this.translate('customText'),
                modelProperty: 'customText'
              }),
            ]
          }
        ]
      });
  }
}