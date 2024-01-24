import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaSdkFormComponent } from './rpa-sdk-form.component';

describe('RpaSdkFormComponent', () => {
  let component: RpaSdkFormComponent;
  let fixture: ComponentFixture<RpaSdkFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RpaSdkFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaSdkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
