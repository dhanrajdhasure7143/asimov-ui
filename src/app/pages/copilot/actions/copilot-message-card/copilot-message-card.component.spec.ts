import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopilotMessageCardComponent } from './copilot-message-card.component';

describe('CopilotMessageCardComponent', () => {
  let component: CopilotMessageCardComponent;
  let fixture: ComponentFixture<CopilotMessageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopilotMessageCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotMessageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
