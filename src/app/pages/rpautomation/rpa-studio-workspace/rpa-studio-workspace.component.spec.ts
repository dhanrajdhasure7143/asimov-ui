import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaStudioWorkspaceComponent } from './rpa-studio-workspace.component';

describe('RpaStudioWorkspaceComponent', () => {
  let component: RpaStudioWorkspaceComponent;
  let fixture: ComponentFixture<RpaStudioWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaStudioWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaStudioWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
