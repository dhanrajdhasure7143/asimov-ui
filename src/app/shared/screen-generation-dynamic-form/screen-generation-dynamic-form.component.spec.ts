import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenGenerationDynamicFormComponent } from './screen-generation-dynamic-form.component';

describe('ScreenGenerationDynamicFormComponent', () => {
  let component: ScreenGenerationDynamicFormComponent;
  let fixture: ComponentFixture<ScreenGenerationDynamicFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenGenerationDynamicFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenGenerationDynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
