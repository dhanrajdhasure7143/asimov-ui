import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaStudioDesignerComponent } from './rpa-studio-designer.component';

describe('RpaStudioDesignerComponent', () => {
  let component: RpaStudioDesignerComponent;
  let fixture: ComponentFixture<RpaStudioDesignerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaStudioDesignerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaStudioDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
