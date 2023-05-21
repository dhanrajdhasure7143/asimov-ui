import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CronOptions } from 'src/app/shared/cron-editor/CronOptions';

@Component({
    selector: 'croneditor',
    template: `
      <div  [formGroup]="form">
      <cron-editor #cronEditorDemo [(cron)]="cronExpression" [disabled]="false" [(options)]="cronOptions">Cron here...
      </cron-editor>
            <input type="text" class="form-control" [hidden]="true" [formControlName]="field.name+'_'+field.id">
            <span [hidden]="true">{{updateCronExp}}</span>
      </div> 
    `,
    styles:[`
      .scheduletimer-loadicon {
        align-items: center;
        display: flex;
      }
      .scheduletimer-actionbtns button {
        padding: 0px 5px;
      }`]
})
export class CronEditor implements OnInit {
    @Input() field:any;
    @Input() form:FormGroup;
    @Input('feilddisable') public feilddisable:boolean;
    cronExpression:any="0/1 * 1/1 * *";
    isCronDisabled:boolean=true;
    cronOptions: CronOptions = {
        formInputClass: 'form-control cron-editor-input',
        formSelectClass: 'form-control cron-editor-select',
        formRadioClass: 'cron-editor-radio',
        formCheckboxClass: 'cron-editor-checkbox',
    
        defaultTime: "00:00:00",
    
        hideMinutesTab: false,
        hideHourlyTab: false,
        hideDailyTab: false,
        hideWeeklyTab: false,
        hideMonthlyTab: false,
        hideYearlyTab: false,
        hideAdvancedTab: false,
        hideSpecificWeekDayTab : false,
        hideSpecificMonthWeekTab : false,
    
        use24HourTime: true,
        hideSeconds: false,
    
        cronFlavor: "standard"
      }
    ngOnInit()
    {
        setTimeout(()=>{
            if(this.field.value!=undefined)
            {
                this.form.get(this.field.name+"_"+this.field.id).setValue(this.field.value);
                this.cronExpression=this.field.value;
            }
        },100)
    }

    get updateCronExp()
    {
 
        this.form.get(this.field.name+"_"+this.field.id).setValue(this.cronExpression);
        return this.cronExpression;
    }
}