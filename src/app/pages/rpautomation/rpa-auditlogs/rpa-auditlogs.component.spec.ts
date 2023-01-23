import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RpaAuditlogsComponent } from './rpa-auditlogs.component';

describe('RpaAuditlogsComponent', () => {
  let component: RpaAuditlogsComponent;
  let fixture: ComponentFixture<RpaAuditlogsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaAuditlogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaAuditlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
