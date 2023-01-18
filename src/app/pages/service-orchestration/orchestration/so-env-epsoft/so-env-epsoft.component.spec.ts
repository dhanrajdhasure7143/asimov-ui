import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SoEnvEpsoftComponent } from './so-env-epsoft.component';

describe('SoEnvEpsoftComponent', () => {
  let component: SoEnvEpsoftComponent;
  let fixture: ComponentFixture<SoEnvEpsoftComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SoEnvEpsoftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoEnvEpsoftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
