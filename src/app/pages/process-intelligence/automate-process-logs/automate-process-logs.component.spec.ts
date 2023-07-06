import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomateProcessLogsComponent } from './automate-process-logs.component';

describe('AutomateProcessLogsComponent', () => {
  let component: AutomateProcessLogsComponent;
  let fixture: ComponentFixture<AutomateProcessLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomateProcessLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomateProcessLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
