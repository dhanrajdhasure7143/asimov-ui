import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopilotChatTwoComponent } from './copilot-chat-two.component';

describe('CopilotChatTwoComponent', () => {
  let component: CopilotChatTwoComponent;
  let fixture: ComponentFixture<CopilotChatTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopilotChatTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotChatTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
