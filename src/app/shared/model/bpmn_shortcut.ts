export class BpmnShortcut{
    common = [
      {"labelName":"Undo","labelValue":"Ctrl + Z"},
      {"labelName":"Redo","labelValue":"Ctrl + Y"},
      {"labelName":"Copy","labelValue":"Ctrl + C"},
      {"labelName":"Cut","labelValue":"Ctrl + X"},
      {"labelName":"Paste","labelValue":"Ctrl + V"},
      {"labelName":"Scroling(Vertical)","labelValue":"Mouse scroll"},
      {"labelName":"Scrolling(Horizontal)","labelValue":"Two finger touchpad scroll "},
      {"labelName":"Zoom","labelValue":"Pinch zoom"},
      {"labelName":"Select All","labelValue":"Ctrl + A"},
      {"labelName":"Remove Selected","labelValue":"Del"},
      {"labelName":"Direct Editing ","labelValue":"E"},
    ]
    common_canvas = [
      {"labelName":"Lasso Tool","labelValue":"L"},
      {"labelName":"Move Canvas Up","labelValue":"Ctrl + &#8593;"},
      {"labelName":"Move Canvas Left","labelValue":"Ctrl + &#8592;"},
      {"labelName":"Move Canvas Down","labelValue":"Ctrl + &#8595"},
      {"labelName":"Move Canvas Right","labelValue":"Ctrl + &#8594"},
      {"labelName":"Move Canvas Up (Accelerated)","labelValue":"Ctrl + Shift + &#8593;"},
      {"labelName":"Move Canvas Left (Accelerated)","labelValue":"Ctrl + Shift + &#8592;"},
      {"labelName":"Move Canvas Down (Accelerated)","labelValue":"Ctrl + Shift + &#8595"},
      {"labelName":"Move Canvas Right (Accelerated)","labelValue":"Ctrl + Shift + &#8594"}
    ]
    bpmn_cmmn = [
      {"labelName":"Global Connect Tool","labelValue":"C"},
      {"labelName":"Hand Tool","labelValue":"H"},
      {"labelName":"Space Tool","labelValue":"S"}
    ]
    cmmn_dmn = [
      {"labelName":"Move Selection Up","labelValue":"Ctrl + &#8593;"},
      {"labelName":"Move Selection Left","labelValue":"Ctrl + &#8592;"},
      {"labelName":"Move Selection Down","labelValue":"Ctrl + &#8595"},
      {"labelName":"Move Selection Right","labelValue":"Ctrl + &#8594"},
      {"labelName":"Move Selection Up (Accelerated)","labelValue":"Ctrl + Shift + &#8593;"},
      {"labelName":"Move Selection Left (Accelerated)","labelValue":"Ctrl + Shift + &#8592;"},
      {"labelName":"Move Selection Down (Accelerated)","labelValue":"Ctrl + Shift + &#8595"},
      {"labelName":"Move Selection Right (Accelerated)","labelValue":"Ctrl + Shift + &#8594"}
    ]
    bpmn=[
        ...this.common,
        ...this.bpmn_cmmn,
        ...this.common_canvas
    ]
    cmmn = [
      ...this.common,
      ...this.bpmn_cmmn,
      ...this.common_canvas,
      ...this.cmmn_dmn
    ]
    dmn=[
      ...this.common,
      ...this.common_canvas,
      ...this.cmmn_dmn
    ]
}