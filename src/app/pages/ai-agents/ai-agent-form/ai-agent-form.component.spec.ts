import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAgentFormComponent } from './ai-agent-form.component';

describe('AiAgentFormComponent', () => {
  let component: AiAgentFormComponent;
  let fixture: ComponentFixture<AiAgentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiAgentFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiAgentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
