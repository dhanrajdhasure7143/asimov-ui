import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaMicrobotDesignerworkspaceComponent } from './rpa-microbot-designerworkspace.component';

describe('RpaMicrobotDesignerworkspaceComponent', () => {
  let component: RpaMicrobotDesignerworkspaceComponent;
  let fixture: ComponentFixture<RpaMicrobotDesignerworkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RpaMicrobotDesignerworkspaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaMicrobotDesignerworkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
