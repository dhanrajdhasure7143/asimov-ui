import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramcreationComponent } from './programcreation.component';

describe('ProgramcreationComponent', () => {
  let component: ProgramcreationComponent;
  let fixture: ComponentFixture<ProgramcreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramcreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramcreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
