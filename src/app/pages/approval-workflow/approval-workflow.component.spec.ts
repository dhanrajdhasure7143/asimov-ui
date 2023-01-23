import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApprovalWorkflowComponent } from './approval-workflow.component';

describe('ApprovalWorkflowComponent', () => {
  let component: ApprovalWorkflowComponent;
  let fixture: ComponentFixture<ApprovalWorkflowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
