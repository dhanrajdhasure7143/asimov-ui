import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessArchitectComponent } from './process-architect.component';

describe('ProcessArchitectComponent', () => {
  let component: ProcessArchitectComponent;
  let fixture: ComponentFixture<ProcessArchitectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessArchitectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessArchitectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
