import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinedbotsComponent } from './predefinedbots.component';

describe('PredefinedbotsComponent', () => {
  let component: PredefinedbotsComponent;
  let fixture: ComponentFixture<PredefinedbotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredefinedbotsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinedbotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
