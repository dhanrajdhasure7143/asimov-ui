import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAgentsComponent } from './ai-agents.component';

describe('AiAgentsComponent', () => {
  let component: AiAgentsComponent;
  let fixture: ComponentFixture<AiAgentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiAgentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
