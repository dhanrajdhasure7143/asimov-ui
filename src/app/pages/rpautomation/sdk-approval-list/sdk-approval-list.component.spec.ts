import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkApprovalListComponent } from './sdk-approval-list.component';

describe('SdkApprovalListComponent', () => {
  let component: SdkApprovalListComponent;
  let fixture: ComponentFixture<SdkApprovalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SdkApprovalListComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkApprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
