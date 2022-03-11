import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VcmPropertiesComponent } from './vcm-properties.component';

describe('VcmPropertiesComponent', () => {
  let component: VcmPropertiesComponent;
  let fixture: ComponentFixture<VcmPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VcmPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VcmPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
