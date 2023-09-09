import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopilotMessageFormComponent } from './copilot-message-form.component';

describe('CopilotMessageFormComponent', () => {
  let component: CopilotMessageFormComponent;
  let fixture: ComponentFixture<CopilotMessageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopilotMessageFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotMessageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
