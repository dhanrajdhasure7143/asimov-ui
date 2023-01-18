import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SoSchedulerComponent } from './so-scheduler.component';

describe('SoSchedulerComponent', () => {
  let component: SoSchedulerComponent;
  let fixture: ComponentFixture<SoSchedulerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SoSchedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
