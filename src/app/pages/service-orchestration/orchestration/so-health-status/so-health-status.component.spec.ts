import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SoHealthStatusComponent } from './so-health-status.component';

describe('SoHealthStatusComponent', () => {
  let component: SoHealthStatusComponent;
  let fixture: ComponentFixture<SoHealthStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SoHealthStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoHealthStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
