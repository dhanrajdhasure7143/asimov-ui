import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VcmFullEditComponent } from './vcm-full-edit.component';

describe('VcmFullEditComponent', () => {
  let component: VcmFullEditComponent;
  let fixture: ComponentFixture<VcmFullEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VcmFullEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VcmFullEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
