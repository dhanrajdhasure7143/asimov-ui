import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SoMonitoringComponent } from './so-monitoring.component';

describe('SoMonitoringComponent', () => {
  let component: SoMonitoringComponent;
  let fixture: ComponentFixture<SoMonitoringComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SoMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
