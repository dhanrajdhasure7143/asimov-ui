import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PredefinedBotsService } from '../../services/predefined-bots.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
@Component({
  selector: 'app-ai-agent-config-overlay',
  templateUrl: './ai-agent-config-overlay.component.html',
  styleUrls: ['./ai-agent-config-overlay.component.css']
})
export class AiAgentConfigOverlayComponent implements OnInit {
  formFields = [];
  params: any = {};
  disabledFormFields: any[] = [];
  aiActions: any[] = [];
  attachments: any = {};
  predefinedBotsForm: FormGroup;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private rest_service: PredefinedBotsService,
    private spinner: LoaderService,

  ) { }

  ngOnInit(): void {
    this.predefinedBotsForm = this.fb.group({});
    this.initForm();
  }

  loopTrackBy(index: number, field: any): number {
    return field.id;
  }


  initForm() {
    this.predefinedBotsForm = this.fb.group({
      aiActions: this.fb.array([])
    });
  }

  getData(productId: string, subAgentId: string, runId: string) {
    this.spinner.show();
    this.rest_service.getDisabledFields(productId, subAgentId, runId).subscribe((res: any) => {
      this.formFields = res.data.data;
      this.attachments = this.processAttachments(res.data.attachments);
      this.createFormControls();
      this.spinner.hide();
    });
  }

  // processAttachments(attachments: any[]) {
  //   const attachmentMap = {};
  //   attachments.forEach(att => {
  //     attachmentMap[att.key] = att.attList[0].originalFileName;
  //   });
  //   return attachmentMap;
  // }

  processAttachments(attachments: any[]) {
    const attachmentMap = {};
    attachments.forEach(att => {
      attachmentMap[att.key] = att.attList.map(file => file.originalFileName);
    });
    return attachmentMap;
  }

  createFormControls() {
    const aiActionField = this.formFields.find(field => field.preAttributeName === 'RFP_dropdown');
    if (aiActionField && aiActionField.options) {
      this.aiActions = aiActionField.options;
      console.log("aiActions", this.aiActions);

      const aiActionsFormArray = this.predefinedBotsForm.get('aiActions') as FormArray;

      this.aiActions.forEach(action => {
        const isChecked = this.isActionFieldsPopulated(action);
        aiActionsFormArray.push(this.fb.control({ value: isChecked, disabled: true }));
      });
    }
  }

  isActionFieldsPopulated(action: any): boolean {
    const fieldNames = JSON.parse(action.field.replace(/'/g, '"'));
    return fieldNames.some(fieldName => {
      const field = this.formFields.find(f => f.preAttributeName === fieldName);
      return this.hasFieldValue(field);
    });
  }

  isActionChecked(index: number): boolean {
    return this.predefinedBotsForm.get('aiActions').value[index];
  }

  getFieldValue(field: any): string {
    return field.preAttributeValue || '';
  }

  // getAttachmentName(fieldName: string): string {
  //   return this.attachments[fieldName] || 'No file chosen';
  // }
  
  getAttachmentName(fieldName: string): string {
    const filenames = this.attachments[fieldName];
    if (filenames) {
      return filenames.join(',<br>');
    }
    return 'No file chosen';
  }

  getAssociatedFields(actionIndex: number): any[] {
    const action = this.aiActions[actionIndex];
    const fieldNames = JSON.parse(action.field.replace(/'/g, '"'));
    return this.formFields.filter(field => fieldNames.includes(field.preAttributeName));
  }

  hasFieldValue(field: any): boolean {
    if (field.preAttributeType === 'file') {
      return this.getAttachmentName(field.preAttributeName) !== 'No file chosen';
    }
    return !!this.getFieldValue(field);
  }
}
