import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAgentSubAgentsComponent } from './ai-agent-sub-agents.component';

describe('AiAgentSubAgentsComponent', () => {
  let component: AiAgentSubAgentsComponent;
  let fixture: ComponentFixture<AiAgentSubAgentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiAgentSubAgentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiAgentSubAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
