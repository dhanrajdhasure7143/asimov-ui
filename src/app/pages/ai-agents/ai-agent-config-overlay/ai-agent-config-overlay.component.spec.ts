import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAgentConfigOverlayComponent } from './ai-agent-config-overlay.component';

describe('AiAgentConfigOverlayComponent', () => {
  let component: AiAgentConfigOverlayComponent;
  let fixture: ComponentFixture<AiAgentConfigOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiAgentConfigOverlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiAgentConfigOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
