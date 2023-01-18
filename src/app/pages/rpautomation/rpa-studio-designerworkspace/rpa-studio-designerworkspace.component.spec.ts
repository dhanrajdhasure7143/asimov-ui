import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RpaStudioDesignerworkspaceComponent } from './rpa-studio-designerworkspace.component';

describe('RpaStudioDesignerworkspaceComponent', () => {
  let component: RpaStudioDesignerworkspaceComponent;
  let fixture: ComponentFixture<RpaStudioDesignerworkspaceComponent>;

  beforeEach(waitForAsync(() => {
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
