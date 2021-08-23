import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaStudioActionsComponent } from './rpa-studio-actions.component';

describe('RpaStudioActionsComponent', () => {
  let component: RpaStudioActionsComponent;
  let fixture: ComponentFixture<RpaStudioActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaStudioActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaStudioActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
