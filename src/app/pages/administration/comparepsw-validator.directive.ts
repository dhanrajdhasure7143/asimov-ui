import { Validator, AbstractControl, ValidationErrors, NG_VALIDATORS} from '@angular/forms';
// import { APP_CONFIG } from './../../app.config';
import { Component, OnInit, Directive, Input } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[compare]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CompareValidatorDirective, multi: true}]
})
export class CompareValidatorDirective implements Validator{
    @Input('compare') controlNameToCompare: string;
  
    constructor() { }
  
    ngOnInit() {
    }
    onSubmit() {
    }
  
  validate(c: AbstractControl): ValidationErrors | null {
    const controlToCompare = c.root.get(this.controlNameToCompare);
    if(controlToCompare){
      const subcription: Subscription = controlToCompare.valueChanges.subscribe(() => {
        c.updateValueAndValidity();
        subcription.unsubscribe();
      })
    }
  return controlToCompare && controlToCompare.value !== c.value ? {'compare': true} : null;
  }
  }
