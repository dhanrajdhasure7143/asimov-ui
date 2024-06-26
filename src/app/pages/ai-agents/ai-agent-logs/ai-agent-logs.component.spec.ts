import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAgentLogsComponent } from './ai-agent-logs.component';

describe('AiAgentLogsComponent', () => {
  let component: AiAgentLogsComponent;
  let fixture: ComponentFixture<AiAgentLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiAgentLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiAgentLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
