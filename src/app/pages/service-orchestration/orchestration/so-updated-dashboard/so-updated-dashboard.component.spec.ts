import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoUpdatedDashboardComponent } from './so-updated-dashboard.component';

describe('SoUpdatedDashboardComponent', () => {
  let component: SoUpdatedDashboardComponent;
  let fixture: ComponentFixture<SoUpdatedDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoUpdatedDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoUpdatedDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
