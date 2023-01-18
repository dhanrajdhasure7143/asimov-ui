import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RpaConfigurationsComponent } from './rpa-configurations.component';

describe('RpaConfigurationsComponent', () => {
  let component: RpaConfigurationsComponent;
  let fixture: ComponentFixture<RpaConfigurationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaConfigurationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
