import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessLogsComponent } from './process-logs.component';

describe('ProcessLogsComponent', () => {
  let component: ProcessLogsComponent;
  let fixture: ComponentFixture<ProcessLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
