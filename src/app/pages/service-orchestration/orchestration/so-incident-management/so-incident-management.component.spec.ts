import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoIncidentManagementComponent } from './so-incident-management.component';

describe('SoIncidentManagementComponent', () => {
  let component: SoIncidentManagementComponent;
  let fixture: ComponentFixture<SoIncidentManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoIncidentManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoIncidentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
