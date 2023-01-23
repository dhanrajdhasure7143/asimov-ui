import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateBpmnDiagramComponent } from './create-bpmn-diagram.component';

describe('CreateBpmnDiagramComponent', () => {
  let component: CreateBpmnDiagramComponent;
  let fixture: ComponentFixture<CreateBpmnDiagramComponent>;

  beforeEach(waitForAsync(() => {
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
