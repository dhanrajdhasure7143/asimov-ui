import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinedBotsListComponent } from './ai-agent-list.component';

describe('PredefinedBotsListComponent', () => {
  let component: PredefinedBotsListComponent;
  let fixture: ComponentFixture<PredefinedBotsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredefinedBotsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinedBotsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
