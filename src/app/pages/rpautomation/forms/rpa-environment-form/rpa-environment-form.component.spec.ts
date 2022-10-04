import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaEnvironmentFormComponent } from './rpa-environment-form.component';

describe('RpaEnvironmentFormComponent', () => {
  let component: RpaEnvironmentFormComponent;
  let fixture: ComponentFixture<RpaEnvironmentFormComponent>;

  beforeEach(async(() => {
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
