import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopilotHomeComponent } from './copilot-home.component';

describe('CopilotHomeComponent', () => {
  let component: CopilotHomeComponent;
  let fixture: ComponentFixture<CopilotHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopilotHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
