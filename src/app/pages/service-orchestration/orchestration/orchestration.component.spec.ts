import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrchestrationComponent } from './orchestration.component';

describe('OrchestrationComponent', () => {
  let component: OrchestrationComponent;
  let fixture: ComponentFixture<OrchestrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrchestrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrchestrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
