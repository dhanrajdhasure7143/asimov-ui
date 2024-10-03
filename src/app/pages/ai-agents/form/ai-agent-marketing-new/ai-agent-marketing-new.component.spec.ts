import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAgentMarketingNewComponent } from './ai-agent-marketing-new.component';

describe('AiAgentMarketingNewComponent', () => {
  let component: AiAgentMarketingNewComponent;
  let fixture: ComponentFixture<AiAgentMarketingNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiAgentMarketingNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiAgentMarketingNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
