import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaConfigurationsComponent } from './rpa-configurations.component';

describe('RpaConfigurationsComponent', () => {
  let component: RpaConfigurationsComponent;
  let fixture: ComponentFixture<RpaConfigurationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaConfigurationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
