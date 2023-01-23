import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProcessAnalystComponent } from './process-analyst.component';

describe('ProcessAnalystComponent', () => {
  let component: ProcessAnalystComponent;
  let fixture: ComponentFixture<ProcessAnalystComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessAnalystComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessAnalystComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
