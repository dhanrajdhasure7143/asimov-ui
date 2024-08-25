import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAgentFormOldComponent } from './ai-agent-form-old.component';

describe('AiAgentFormOldComponent', () => {
  let component: AiAgentFormOldComponent;
  let fixture: ComponentFixture<AiAgentFormOldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiAgentFormOldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiAgentFormOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
