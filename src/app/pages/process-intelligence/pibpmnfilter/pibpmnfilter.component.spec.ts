import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PibpmnfilterComponent } from './pibpmnfilter.component';

describe('PibpmnfilterComponent', () => {
  let component: PibpmnfilterComponent;
  let fixture: ComponentFixture<PibpmnfilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PibpmnfilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PibpmnfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
