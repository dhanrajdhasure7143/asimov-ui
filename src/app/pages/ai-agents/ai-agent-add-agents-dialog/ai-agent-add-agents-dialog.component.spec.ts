import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAgentAddAgentsDialogComponent } from './ai-agent-add-agents-dialog.component';

describe('AiAgentAddAgentsDialogComponent', () => {
  let component: AiAgentAddAgentsDialogComponent;
  let fixture: ComponentFixture<AiAgentAddAgentsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiAgentAddAgentsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiAgentAddAgentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
