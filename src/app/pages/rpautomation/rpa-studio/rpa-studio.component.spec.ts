import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaStudioComponent } from './rpa-studio.component';

describe('RpaStudioComponent', () => {
  let component: RpaStudioComponent;
  let fixture: ComponentFixture<RpaStudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaStudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
