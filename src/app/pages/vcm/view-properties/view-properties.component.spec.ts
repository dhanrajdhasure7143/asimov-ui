import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewPropertiesComponent } from './view-properties.component';

describe('ViewPropertiesComponent', () => {
  let component: ViewPropertiesComponent;
  let fixture: ComponentFixture<ViewPropertiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
