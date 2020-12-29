import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaStudioDesignerworkspaceComponent } from './rpa-studio-designerworkspace.component';

describe('RpaStudioDesignerworkspaceComponent', () => {
  let component: RpaStudioDesignerworkspaceComponent;
  let fixture: ComponentFixture<RpaStudioDesignerworkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaStudioDesignerworkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaStudioDesignerworkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
