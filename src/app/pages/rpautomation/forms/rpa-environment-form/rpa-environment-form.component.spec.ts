import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RpaEnvironmentFormComponent } from './rpa-environment-form.component';

describe('RpaEnvironmentFormComponent', () => {
  let component: RpaEnvironmentFormComponent;
  let fixture: ComponentFixture<RpaEnvironmentFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaEnvironmentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaEnvironmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
