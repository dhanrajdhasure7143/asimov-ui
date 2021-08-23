import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoBotManagementComponent } from './so-bot-management.component';

describe('SoBotManagementComponent', () => {
  let component: SoBotManagementComponent;
  let fixture: ComponentFixture<SoBotManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoBotManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoBotManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
