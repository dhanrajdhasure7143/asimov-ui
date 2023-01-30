import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaConnectionManagerFormComponent } from './rpa-connection-manager-form.component';

describe('RpaConnectionManagerFormComponent', () => {
  let component: RpaConnectionManagerFormComponent;
  let fixture: ComponentFixture<RpaConnectionManagerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RpaConnectionManagerFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaConnectionManagerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
