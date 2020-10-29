import {
  getBusinessObject,
  is
} from 'bpmn-js/lib/util/ModelUtil';

import {
  isEventSubProcess,
  isExpanded
} from 'bpmn-js/lib/util/DiUtil';

import {
  isDifferentType
} from './TypeUtils';

import {
  forEach,
  filter
} from 'min-dash';

import * as replaceOptions from './ReplaceOptions';

import _MenuProvider from 'bpmn-js/lib/features/popup-menu/ReplaceMenuProvider';

const _getEntries = _MenuProvider.prototype.getEntries;

/**
 * This module is an element agnostic replace menu provider for the popup menu.
 */
export default function ReplaceMenuProvider(
    popupMenu, modeling, moddle,
    bpmnReplace, rules, translate) {

  this._popupMenu = popupMenu;
  this._modeling = modeling;
  this._moddle = moddle;
  this._bpmnReplace = bpmnReplace;
  this._rules = rules;
  this._translate = translate;

  this.register();
}

ReplaceMenuProvider.$inject = [
  'popupMenu',
  'modeling',
  'moddle',
  'bpmnReplace',
  'rules',
  'translate'
];


/**
 * Register replace menu provider in the popup menu
 */
ReplaceMenuProvider.prototype.register = function() {
  this._popupMenu.registerProvider('bpmn-replace', this);
};


/**
 * Get all entries from replaceOptions for the given element and apply filters
 * on them. Get for example only elements, which are different from the current one.
 *
 * @param {djs.model.Base} element
 *
 * @return {Array<Object>} a list of menu entry items
 */
ReplaceMenuProvider.prototype.getEntries = function(element) {

  var businessObject = element.businessObject;

  var rules = this._rules;

  if (!rules.allowed('shape.replace', { element: element })) {
    return [];
  }
  // var differentType = isDifferentType(element);
  var entries = _getEntries.apply(this, [element]);
  if (is(businessObject, 'bpmn:Task')) {
    entries.splice(3,0,replaceOptions.RPATask);
  }
  return entries;
};


/**
 * Get a list of header items for the given element. This includes buttons
 * for multi instance markers and for the ad hoc marker.
 *
 * @param {djs.model.Base} element
 *
 * @return {Array<Object>} a list of menu entry items
 */
ReplaceMenuProvider.prototype.getHeaderEntries = function(element) {

  var headerEntries = [];

  if (is(element, 'bpmn:Activity') && !isEventSubProcess(element)) {
    headerEntries = headerEntries.concat(this._getLoopEntries(element));
  }

  if (is(element, 'bpmn:SubProcess') &&
      !is(element, 'bpmn:Transaction') &&
      !isEventSubProcess(element)) {
    headerEntries.push(this._getAdHocEntry(element));
  }

  return headerEntries;
};


/**
 * Creates an array of menu entry objects for a given element and filters the replaceOptions
 * according to a filter function.
 *
 * @param  {djs.model.Base} element
 * @param  {Object} replaceOptions
 *
 * @return {Array<Object>} a list of menu items
 */
ReplaceMenuProvider.prototype._createEntries = function(element, replaceOptions) {
  var menuEntries = [];

  var self = this;

  forEach(replaceOptions, function(definition) {
    var entry = self._createMenuEntry(definition, element);

    menuEntries.push(entry);
  });

  return menuEntries;
};

/**
 * Creates an array of menu entry objects for a given sequence flow.
 *
 * @param  {djs.model.Base} element
 * @param  {Object} replaceOptions
 * @return {Array<Object>} a list of menu items
 */
ReplaceMenuProvider.prototype._createSequenceFlowEntries = function(element, replaceOptions) {

  var businessObject = getBusinessObject(element);

  var menuEntries = [];

  var modeling = this._modeling,
      moddle = this._moddle;

  var self = this;

  replaceOptions.forEach(entry => {

    switch (entry["actionName"]) {
    case 'replace-with-default-flow':
      if (businessObject.sourceRef.default !== businessObject &&
            (is(businessObject.sourceRef, 'bpmn:ExclusiveGateway') ||
             is(businessObject.sourceRef, 'bpmn:InclusiveGateway') ||
             is(businessObject.sourceRef, 'bpmn:ComplexGateway') ||
             is(businessObject.sourceRef, 'bpmn:Activity'))) {

        menuEntries.push(self._createMenuEntry(entry, element, function() {
          modeling.updateProperties(element.source, { default: businessObject });
        }));
      }
      break;
    case 'replace-with-conditional-flow':
      if (!businessObject.conditionExpression && is(businessObject.sourceRef, 'bpmn:Activity')) {

        menuEntries.push(self._createMenuEntry(entry, element, function() {
          var conditionExpression = moddle.create('bpmn:FormalExpression', { body: '' });

          modeling.updateProperties(element, { conditionExpression: conditionExpression });
        }));
      }
      break;
    default:

      // default flows
      if (is(businessObject.sourceRef, 'bpmn:Activity') && businessObject.conditionExpression) {
        return menuEntries.push(self._createMenuEntry(entry, element, function() {
          modeling.updateProperties(element, { conditionExpression: undefined });
        }));
      }

      // conditional flows
      if ((is(businessObject.sourceRef, 'bpmn:ExclusiveGateway') ||
           is(businessObject.sourceRef, 'bpmn:InclusiveGateway') ||
           is(businessObject.sourceRef, 'bpmn:ComplexGateway') ||
           is(businessObject.sourceRef, 'bpmn:Activity')) &&
           businessObject.sourceRef.default === businessObject) {

        return menuEntries.push(self._createMenuEntry(entry, element, function() {
          modeling.updateProperties(element.source, { default: undefined });
        }));
      }
    }
  });

  return menuEntries;
};


/**
 * Creates and returns a single menu entry item.
 *
 * @param  {Object} definition a single replace options definition object
 * @param  {djs.model.Base} element
 * @param  {Function} [action] an action callback function which gets called when
 *                             the menu entry is being triggered.
 *
 * @return {Object} menu entry item
 */
ReplaceMenuProvider.prototype._createMenuEntry = function(definition, element, action) {
  var translate = this._translate;
  var replaceElement = this._bpmnReplace.replaceElement;

  var replaceAction = function() {
    return replaceElement(element, definition.target);
  };

  action = action || replaceAction;

  var menuEntry = {
    label: translate(definition.label),
    className: definition.className,
    id: definition.actionName,
    action: action
  };

  return menuEntry;
};

/**
 * Get a list of menu items containing buttons for multi instance markers
 *
 * @param  {djs.model.Base} element
 *
 * @return {Array<Object>} a list of menu items
 */
ReplaceMenuProvider.prototype._getLoopEntries = function(element) {

  var self = this;
  var translate = this._translate;

  function toggleLoopEntry(event, entry) {
    var loopCharacteristics;

    if (entry.active) {
      loopCharacteristics = undefined;
    } else {
      loopCharacteristics = self._moddle.create(entry.options.loopCharacteristics);

      if (entry.options.isSequential) {
        loopCharacteristics.isSequential = entry.options.isSequential;
      }
    }
    self._modeling.updateProperties(element, { loopCharacteristics: loopCharacteristics });
  }

  var businessObject = getBusinessObject(element),
      loopCharacteristics = businessObject.loopCharacteristics;

  var isSequential,
      isLoop,
      isParallel;

  if (loopCharacteristics) {
    isSequential = loopCharacteristics.isSequential;
    isLoop = loopCharacteristics.isSequential === undefined;
    isParallel = loopCharacteristics.isSequential !== undefined && !loopCharacteristics.isSequential;
  }


  var loopEntries = [
    {
      id: 'toggle-parallel-mi',
      className: 'bpmn-icon-parallel-mi-marker',
      title: translate('Parallel Multi Instance'),
      active: isParallel,
      action: toggleLoopEntry,
      options: {
        loopCharacteristics: 'bpmn:MultiInstanceLoopCharacteristics',
        isSequential: false
      }
    },
    {
      id: 'toggle-sequential-mi',
      className: 'bpmn-icon-sequential-mi-marker',
      title: translate('Sequential Multi Instance'),
      active: isSequential,
      action: toggleLoopEntry,
      options: {
        loopCharacteristics: 'bpmn:MultiInstanceLoopCharacteristics',
        isSequential: true
      }
    },
    {
      id: 'toggle-loop',
      className: 'bpmn-icon-loop-marker',
      title: translate('Loop'),
      active: isLoop,
      action: toggleLoopEntry,
      options: {
        loopCharacteristics: 'bpmn:StandardLoopCharacteristics'
      }
    }
  ];
  return loopEntries;
};


/**
 * Get the menu items containing a button for the ad hoc marker
 *
 * @param  {djs.model.Base} element
 *
 * @return {Object} a menu item
 */
ReplaceMenuProvider.prototype._getAdHocEntry = function(element) {
  var translate = this._translate;
  var businessObject = getBusinessObject(element);

  var isAdHoc = is(businessObject, 'bpmn:AdHocSubProcess');

  var replaceElement = this._bpmnReplace.replaceElement;

  var adHocEntry = {
    id: 'toggle-adhoc',
    className: 'bpmn-icon-ad-hoc-marker',
    title: translate('Ad-hoc'),
    active: isAdHoc,
    action: function(event, entry) {
      if (isAdHoc) {
        return replaceElement(element, { type: 'bpmn:SubProcess' }, {
          autoResize: false,
          layoutConnection: false
        });
      } else {
        return replaceElement(element, { type: 'bpmn:AdHocSubProcess' }, {
          autoResize: false,
          layoutConnection: false
        });
      }
    }
  };

  return adHocEntry;
};