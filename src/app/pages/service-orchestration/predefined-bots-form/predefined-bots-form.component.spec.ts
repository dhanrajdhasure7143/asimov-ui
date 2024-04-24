import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinedBotsFormComponent } from './predefined-bots-form.component';

describe('PredefinedBotsFormComponent', () => {
  let component: PredefinedBotsFormComponent;
  let fixture: ComponentFixture<PredefinedBotsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredefinedBotsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinedBotsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
