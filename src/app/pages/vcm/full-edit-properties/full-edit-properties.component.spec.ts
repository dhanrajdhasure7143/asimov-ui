import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullEditPropertiesComponent } from './full-edit-properties.component';

describe('FullEditPropertiesComponent', () => {
  let component: FullEditPropertiesComponent;
  let fixture: ComponentFixture<FullEditPropertiesComponent>;

  beforeEach(async(() => {
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
