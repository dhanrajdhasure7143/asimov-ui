import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopilotChatComponent } from './copilot-chat.component';

describe('CopilotChatComponent', () => {
  let component: CopilotChatComponent;
  let fixture: ComponentFixture<CopilotChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopilotChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
