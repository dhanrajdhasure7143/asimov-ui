import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopilotMessageCardItemComponent } from './copilot-message-card-item.component';

describe('CopilotMessageCardItemComponent', () => {
  let component: CopilotMessageCardItemComponent;
  let fixture: ComponentFixture<CopilotMessageCardItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopilotMessageCardItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotMessageCardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
