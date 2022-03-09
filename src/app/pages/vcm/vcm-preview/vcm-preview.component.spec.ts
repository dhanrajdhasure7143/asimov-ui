import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VcmPreviewComponent } from './vcm-preview.component';

describe('VcmPreviewComponent', () => {
  let component: VcmPreviewComponent;
  let fixture: ComponentFixture<VcmPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VcmPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VcmPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
