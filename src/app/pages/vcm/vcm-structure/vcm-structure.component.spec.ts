import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VcmStructureComponent } from './vcm-structure.component';

describe('VcmStructureComponent', () => {
  let component: VcmStructureComponent;
  let fixture: ComponentFixture<VcmStructureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VcmStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VcmStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
