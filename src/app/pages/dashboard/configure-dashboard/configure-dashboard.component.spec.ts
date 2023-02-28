import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureDashboardComponent } from './configure-dashboard.component';

describe('ConfigureDashboardComponent', () => {
  let component: ConfigureDashboardComponent;
  let fixture: ComponentFixture<ConfigureDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
