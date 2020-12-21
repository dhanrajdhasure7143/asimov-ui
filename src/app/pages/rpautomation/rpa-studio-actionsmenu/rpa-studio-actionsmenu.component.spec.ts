import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaStudioActionsmenuComponent } from './rpa-studio-actionsmenu.component';

describe('RpaStudioActionsmenuComponent', () => {
  let component: RpaStudioActionsmenuComponent;
  let fixture: ComponentFixture<RpaStudioActionsmenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaStudioActionsmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaStudioActionsmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
