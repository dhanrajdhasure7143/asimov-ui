import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinedBotsFormsComponent } from './predefined-bots-forms.component';

describe('PredefinedBotsFormsComponent', () => {
  let component: PredefinedBotsFormsComponent;
  let fixture: ComponentFixture<PredefinedBotsFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredefinedBotsFormsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinedBotsFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
