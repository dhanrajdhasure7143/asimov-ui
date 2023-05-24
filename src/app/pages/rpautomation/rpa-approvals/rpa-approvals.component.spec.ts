import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaApprovalsComponent } from './rpa-approvals.component';

describe('RpaApprovalsComponent', () => {
  let component: RpaApprovalsComponent;
  let fixture: ComponentFixture<RpaApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RpaApprovalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
