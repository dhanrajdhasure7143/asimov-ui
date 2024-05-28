import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaApprovalsTabsComponent } from './rpa-approvals-tabs.component';

describe('RpaApprovalsTabsComponent', () => {
  let component: RpaApprovalsTabsComponent;
  let fixture: ComponentFixture<RpaApprovalsTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RpaApprovalsTabsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaApprovalsTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
