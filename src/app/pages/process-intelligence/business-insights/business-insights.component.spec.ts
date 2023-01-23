import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BusinessInsightsComponent } from './business-insights.component';

describe('BusinessInsightsComponent', () => {
  let component: BusinessInsightsComponent;
  let fixture: ComponentFixture<BusinessInsightsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
