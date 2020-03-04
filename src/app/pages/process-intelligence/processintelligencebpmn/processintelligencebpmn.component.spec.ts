import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessintelligencebpmnComponent } from './processintelligencebpmn.component';

describe('ProcessintelligencebpmnComponent', () => {
  let component: ProcessintelligencebpmnComponent;
  let fixture: ComponentFixture<ProcessintelligencebpmnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessintelligencebpmnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessintelligencebpmnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
