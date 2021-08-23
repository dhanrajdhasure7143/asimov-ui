import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBpmnDiagramComponent } from './create-bpmn-diagram.component';

describe('CreateBpmnDiagramComponent', () => {
  let component: CreateBpmnDiagramComponent;
  let fixture: ComponentFixture<CreateBpmnDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBpmnDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBpmnDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
