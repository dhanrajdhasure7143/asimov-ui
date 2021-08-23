import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmnDiagramListComponent } from './bpmn-diagram-list.component';

describe('BpmnDiagramListComponent', () => {
  let component: BpmnDiagramListComponent;
  let fixture: ComponentFixture<BpmnDiagramListComponent>;

  beforeEach(async(() => {
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
