import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSoAutomatedTasksComponent } from './new-so-automated-tasks.component';

describe('NewSoAutomatedTasksComponent', () => {
  let component: NewSoAutomatedTasksComponent;
  let fixture: ComponentFixture<NewSoAutomatedTasksComponent>;

  beforeEach(async(() => {
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
