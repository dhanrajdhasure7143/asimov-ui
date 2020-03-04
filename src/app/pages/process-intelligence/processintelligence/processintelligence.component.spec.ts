import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessintelligenceComponent } from './processintelligence.component';

describe('ProcessintelligenceComponent', () => {
  let component: ProcessintelligenceComponent;
  let fixture: ComponentFixture<ProcessintelligenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessintelligenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessintelligenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
