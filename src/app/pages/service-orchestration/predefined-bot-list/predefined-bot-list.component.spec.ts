import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinedBotListComponent } from './predefined-bot-list.component';

describe('PredefinedBotListComponent', () => {
  let component: PredefinedBotListComponent;
  let fixture: ComponentFixture<PredefinedBotListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredefinedBotListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinedBotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
