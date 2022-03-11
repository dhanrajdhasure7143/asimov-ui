import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVcmComponent } from './edit-vcm.component';

describe('EditVcmComponent', () => {
  let component: EditVcmComponent;
  let fixture: ComponentFixture<EditVcmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVcmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVcmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
