import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAgentListComponent } from './ai-agent-home.component';

describe('PredefinedBotsListComponent', () => {
  let component: AiAgentListComponent;
  let fixture: ComponentFixture<AiAgentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiAgentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiAgentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
