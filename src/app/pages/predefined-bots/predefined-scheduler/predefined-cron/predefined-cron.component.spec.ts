import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinedCronComponent } from './predefined-cron.component';

describe('PredefinedCronComponent', () => {
  let component: PredefinedCronComponent;
  let fixture: ComponentFixture<PredefinedCronComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredefinedCronComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinedCronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
