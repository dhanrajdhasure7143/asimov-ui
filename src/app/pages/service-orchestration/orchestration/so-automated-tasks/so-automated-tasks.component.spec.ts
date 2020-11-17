import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoAutomatedTasksComponent } from './so-automated-tasks.component';

describe('SoAutomatedTasksComponent', () => {
  let component: SoAutomatedTasksComponent;
  let fixture: ComponentFixture<SoAutomatedTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoAutomatedTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoAutomatedTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
