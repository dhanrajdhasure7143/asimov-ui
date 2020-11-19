import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';
import { is } from 'bpmn-js/lib/util/ModelUtil';

export default function Renderer(eventBus, styles, pathMap, canvas, priority) {
    BpmnRenderer.call(this, eventBus, styles, pathMap, canvas, priority);
}

Renderer.$inject = [ 'eventBus', 'styles', 'pathMap', 'canvas' ];

Renderer.prototype.drawShape = function(parentGfx, element) {
    if (is(element, 'bpmn:RpaTask')) { 
        return this.drawCustomTask(parentGfx, element);
    } else {
        return BpmnRenderer.prototype.drawShape.call(this, parentGfx, element);
    }
};

Renderer.prototype.drawCustomTask = function(parentGfx, element) {
    var task = this.handlers['bpmn:Task'](parentGfx, element);
    var pathData = this.pathMap.getScaledPath('TASK_TYPE_MANUAL', {
        abspos: {
          x: 15,
          y: 20
        }
      });
    this.drawPath(parentGfx, pathData, {
    strokeWidth: 1,
    stroke: this.getStrokeColor(element, this.defaultStrokeColor)
    });

    return task;
};