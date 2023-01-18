import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BpmnDiagramListComponent } from './bpmn-diagram-list.component';

describe('BpmnDiagramListComponent', () => {
  let component: BpmnDiagramListComponent;
  let fixture: ComponentFixture<BpmnDiagramListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmnDiagramListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmnDiagramListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
