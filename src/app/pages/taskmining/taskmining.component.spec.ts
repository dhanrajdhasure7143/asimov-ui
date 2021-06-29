import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskminingComponent } from './taskmining.component';

describe('TaskminingComponent', () => {
  let component: TaskminingComponent;
  let fixture: ComponentFixture<TaskminingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskminingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskminingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
