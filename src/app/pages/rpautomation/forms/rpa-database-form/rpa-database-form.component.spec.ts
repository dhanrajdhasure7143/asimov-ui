import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaDatabaseFormComponent } from './rpa-database-form.component';

describe('RpaDatabaseFormComponent', () => {
  let component: RpaDatabaseFormComponent;
  let fixture: ComponentFixture<RpaDatabaseFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaDatabaseFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaDatabaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
