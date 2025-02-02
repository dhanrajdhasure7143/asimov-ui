import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateTasksComponent } from './create-tasks.component';

describe('CreateTasksComponent', () => {
  let component: CreateTasksComponent;
  let fixture: ComponentFixture<CreateTasksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
