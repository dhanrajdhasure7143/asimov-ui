import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinedBotsComponent } from './predefined-bots.component';

describe('PredefinedBotsComponent', () => {
  let component: PredefinedBotsComponent;
  let fixture: ComponentFixture<PredefinedBotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredefinedBotsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinedBotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
