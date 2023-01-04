import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import moment from 'moment';
@Component({
    selector: 'ipc-checkbox',
    template: `
      <div  [formGroup]="form">
        <input type='radio' [checked]="payload.previousMonth" (change)="ipcCheckChange('PreviousMonth', $event)" name='previousmonth' >&nbsp; Previous Month
        <br>
        <input type='radio' [checked]="payload.currentMonth" (change)="ipcCheckChange('CurrentMonth', $event)" name='currentmonth'>&nbsp; Current Month
        <br>
        <input type='radio' [checked]="payload.dateRange" (change)="ipcCheckChange('DateRange', $event)" name='daterange'>&nbsp; Date Range
        <br>
        <div *ngIf="payload.dateRange">
            <br>
            <span  class="col-md-6 pl-0">
            From Date:&nbsp; <input (change)="dateChange('fromDate', $event)" [value]="payload.fromDate" class='form-control' type='date'>
            </span>
            <span  class="col-md-6 pr-0">
            To Date:&nbsp; <input [max]="maxdate" (change)="dateChange('toDate', $event)" [value]="payload.toDate" class='form-control' type='date'>
            </span>
        </div>
      </div> 
    `
})
export class IPCCheckboxComponent implements OnInit {
    @Input() field:any = {};
    @Input() form:FormGroup;
    @Input('feilddisable') public feilddisable:boolean;
    maxdate= moment().format("YYYY-MM-DD");

    public payload:any={
        previousMonth:false,
        currentMonth:false,
        dateRange:false,
        fromDate:'',
        toDate:''
    }

    ngOnInit(): void {
        if(this.field.value!=''){
            this.payload=JSON.parse(this.field.value);
        }
    }

    ipcCheckChange(type, event)
    {
        
        if(event.currentTarget.checked){
            if(type=="PreviousMonth")
            {
                this.payload.previousMonth=true;
                this.payload.currentMonth=false;
                this.payload.dateRange=false;
                this.payload.fromDate='';
                this.payload.toDate='';
                this.form.get(this.field.name+"_"+this.field.id).setValue(JSON.stringify(this.payload))
                this.form.updateValueAndValidity();
            }
            else if(type=="CurrentMonth")
            {
                this.payload.previousMonth=false;
                this.payload.currentMonth=true;
                this.payload.dateRange=false;
                this.payload.fromDate='';
                this.payload.toDate='';
                this.form.get(this.field.name+"_"+this.field.id).setValue(JSON.stringify(this.payload))
                this.form.updateValueAndValidity();
         
            }else if(type=="DateRange"){
                this.payload.previousMonth=false;
                this.payload.currentMonth=false;
                this.payload.dateRange=true;
                this.payload.fromDate='';
                this.payload.toDate='';
                this.form.get(this.field.name+"_"+this.field.id).setValue('')
                this.form.updateValueAndValidity();
         
            }
        }
        else
        {
            this.payload.previousMonth=false;
            this.payload.currentMonth=false;
            this.payload.dateRange=false;
            this.form.get(this.field.name+"_"+this.field.id).setValue('')
            this.form.updateValueAndValidity();
        }

    }


    dateChange(type, event)
    {
        this.payload[type]=event.target.value;
        if(this.payload.fromDate!=''&&this.payload.toDate!='')
        {
            this.form.get(this.field.name+"_"+this.field.id).setValue(JSON.stringify(this.payload))
            this.form.updateValueAndValidity();
        }
        else
        {
            this.form.get(this.field.name+"_"+this.field.id).setValue('')
            this.form.updateValueAndValidity();
            
        }
    }

}

