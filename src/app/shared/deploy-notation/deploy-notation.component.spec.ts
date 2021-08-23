import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeployNotationComponent } from './deploy-notation.component';

describe('DeployNotationComponent', () => {
  let component: DeployNotationComponent;
  let fixture: ComponentFixture<DeployNotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeployNotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeployNotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
