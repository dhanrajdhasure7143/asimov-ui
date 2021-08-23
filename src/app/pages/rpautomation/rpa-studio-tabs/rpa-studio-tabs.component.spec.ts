import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaStudioTabsComponent } from './rpa-studio-tabs.component';

describe('RpaStudioTabsComponent', () => {
  let component: RpaStudioTabsComponent;
  let fixture: ComponentFixture<RpaStudioTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaStudioTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaStudioTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
