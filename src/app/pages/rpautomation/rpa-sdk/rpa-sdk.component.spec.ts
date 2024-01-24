import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaSdkComponent } from './rpa-sdk.component';

describe('RpaSdkComponent', () => {
  let component: RpaSdkComponent;
  let fixture: ComponentFixture<RpaSdkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RpaSdkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaSdkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
