import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RpaSchedulerComponent } from './rpa-scheduler.component';

describe('RpaSchedulerComponent', () => {
  let component: RpaSchedulerComponent;
  let fixture: ComponentFixture<RpaSchedulerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaSchedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
