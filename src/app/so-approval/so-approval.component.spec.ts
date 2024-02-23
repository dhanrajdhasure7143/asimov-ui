import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoApprovalComponent } from './so-approval.component';

describe('SoApprovalComponent', () => {
  let component: SoApprovalComponent;
  let fixture: ComponentFixture<SoApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
