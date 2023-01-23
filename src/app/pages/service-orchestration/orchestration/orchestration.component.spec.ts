import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrchestrationComponent } from './orchestration.component';

describe('OrchestrationComponent', () => {
  let component: OrchestrationComponent;
  let fixture: ComponentFixture<OrchestrationComponent>;

  beforeEach(waitForAsync(() => {
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
