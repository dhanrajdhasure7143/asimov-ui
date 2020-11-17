import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoDashboardComponent } from './so-dashboard.component';

describe('SoDashboardComponent', () => {
  let component: SoDashboardComponent;
  let fixture: ComponentFixture<SoDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
