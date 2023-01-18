import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RpautomationComponent } from './rpautomation.component';

describe('RpautomationComponent', () => {
  let component: RpautomationComponent;
  let fixture: ComponentFixture<RpautomationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RpautomationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpautomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
