import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PredefinedBotsService } from '../../services/predefined-bots.service';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-ai-agent-config-overlay',
  templateUrl: './ai-agent-config-overlay.component.html',
  styleUrls: ['./ai-agent-config-overlay.component.css']
})
export class AiAgentConfigOverlayComponent implements OnInit {
  predefinedBotsForm: FormGroup;
  formFields: any[] = [];
  attachments: any = {};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private rest_service: PredefinedBotsService,
    private spinner: LoaderService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.predefinedBotsForm = this.fb.group({});
  }

  getData(productId: string, subAgentId: string, runId: string) {
    this.spinner.show();
    this.rest_service.getDisabledFields(productId, subAgentId, runId).subscribe((res: any) => {
      this.processResponseData(res.data);
      this.spinner.hide();
    });
  }

  processResponseData(data: any) {
    this.formFields = data.data;
    this.attachments = this.processAttachments(data.attachments);
    this.createFormControls();
  }

  processAttachments(attachments: any[]) {
    const attachmentMap = {};
    attachments.forEach(att => {
      attachmentMap[att.key] = att.attList.map(file => file.originalFileName);
    });
    return attachmentMap;
  }

  // createFormControls() {
  //   this.formFields.forEach(field => {
  //     this.predefinedBotsForm.addControl(field.preAttributeName, this.fb.control({value: field.preAttributeValue, disabled: true}));
  //   });
  // }
  createFormControls() {
    this.formFields.forEach(field => {
      switch (field.preAttributeType) {
        // case 'checkbox':
        //   this.predefinedBotsForm.addControl(field.preAttributeName, this.fb.control({ value: field.preAttributeValue, disabled: true }));
        //   break;
        case 'checkbox':
        const preAttributeValue = field.preAttributeValue;
        const keyValuePairs = preAttributeValue.match(/(\w+)=(\w+)/g);
        const obj = {};
        keyValuePairs.forEach(pair => {
          const [key, value] = pair.split('=');
          obj[key] = value === 'true';
        });
        field.options.forEach(option => {
          const control = this.fb.control({ value: obj[option.value], disabled: true });
          control.setValue(obj[option.value]);
          control.disable();
          this.predefinedBotsForm.addControl(option.value, control);
        });
        break;
        case 'calendar':
          this.predefinedBotsForm.addControl(field.preAttributeName, this.fb.control({ value: field.preAttributeValue, disabled: true }));
          break;
        case 'radio':
          this.predefinedBotsForm.addControl(field.preAttributeName, this.fb.control({ value: field.preAttributeValue, disabled: true }));
          break;
        case 'dropdown':
          this.predefinedBotsForm.addControl(field.preAttributeName, this.fb.control({ value: field.preAttributeValue, disabled: true }));
          break;
        case 'file':
          this.predefinedBotsForm.addControl(field.preAttributeName, this.fb.control({ value: field.preAttributeValue, disabled: true }));
          break;
        case 'email':
          this.predefinedBotsForm.addControl(field.preAttributeName, this.fb.control({ value: field.preAttributeValue, disabled: true }));
          break;
        case 'text':
          this.predefinedBotsForm.addControl(field.preAttributeName, this.fb.control({ value: field.preAttributeValue, disabled: true }));
          break;
        case 'textarea':
          this.predefinedBotsForm.addControl(field.preAttributeName, this.fb.control({ value: field.preAttributeValue, disabled: true }));
          break;
        default:
      }
    });
  }

  getFieldValue(field: any): string {
    return field.preAttributeValue || '';
  }

  getAttachmentName(fieldName: string): string {
    const filenames = this.attachments[fieldName];
    if (filenames) {
      return filenames.join(',');
    }
    return 'No file chosen';
  }

  hasFieldValue(field: any): boolean {
    if (field.preAttributeType === 'file') {
      return this.getAttachmentName(field.preAttributeName) !== 'No file chosen';
    }
    return !!this.getFieldValue(field);
  }
}





// Only check boxes checked
        //   case 'checkbox':
        //     const preAttributeValue = field.preAttributeValue;
        //     const keyValuePairs = preAttributeValue.match(/(\w+)=(\w+)/g);
        //     const obj = {};
        //     keyValuePairs.forEach(pair => {
        //       const [key, value] = pair.split('=');
        //       obj[key] = value === 'true';
        //     });
        //     field.options.forEach(option => {
        //       const control = this.fb.control({ value: obj[option.value], disabled: true });
        //       control.setValue(obj[option.value]);
        //       control.disable();
        //       this.predefinedBotsForm.addControl(option.value, control);
        //     });
        //     break;