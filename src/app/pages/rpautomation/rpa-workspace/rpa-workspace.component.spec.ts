import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaWorkspaceComponent } from './rpa-workspace.component';

describe('RpaWorkspaceComponent', () => {
  let component: RpaWorkspaceComponent;
  let fixture: ComponentFixture<RpaWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
