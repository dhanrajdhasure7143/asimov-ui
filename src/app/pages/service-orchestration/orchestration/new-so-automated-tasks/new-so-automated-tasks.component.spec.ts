import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewSoAutomatedTasksComponent } from './new-so-automated-tasks.component';

describe('NewSoAutomatedTasksComponent', () => {
  let component: NewSoAutomatedTasksComponent;
  let fixture: ComponentFixture<NewSoAutomatedTasksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSoAutomatedTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSoAutomatedTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
