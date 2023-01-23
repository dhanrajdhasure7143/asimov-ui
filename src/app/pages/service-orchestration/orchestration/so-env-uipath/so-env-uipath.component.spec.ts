import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SoEnvUipathComponent } from './so-env-uipath.component';

describe('SoEnvUipathComponent', () => {
  let component: SoEnvUipathComponent;
  let fixture: ComponentFixture<SoEnvUipathComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SoEnvUipathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoEnvUipathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
