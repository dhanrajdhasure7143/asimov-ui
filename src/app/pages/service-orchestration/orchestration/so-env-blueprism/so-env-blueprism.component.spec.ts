import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoEnvBlueprismComponent } from './so-env-blueprism.component';

describe('SoEnvBlueprismComponent', () => {
  let component: SoEnvBlueprismComponent;
  let fixture: ComponentFixture<SoEnvBlueprismComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoEnvBlueprismComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoEnvBlueprismComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
