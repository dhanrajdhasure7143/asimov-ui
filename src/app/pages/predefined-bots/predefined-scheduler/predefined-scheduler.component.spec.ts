import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinedSchedulerComponent } from './predefined-scheduler.component';

describe('PredefinedSchedulerComponent', () => {
  let component: PredefinedSchedulerComponent;
  let fixture: ComponentFixture<PredefinedSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredefinedSchedulerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinedSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
