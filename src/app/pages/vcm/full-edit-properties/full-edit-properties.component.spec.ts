import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FullEditPropertiesComponent } from './full-edit-properties.component';

describe('FullEditPropertiesComponent', () => {
  let component: FullEditPropertiesComponent;
  let fixture: ComponentFixture<FullEditPropertiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FullEditPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullEditPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
