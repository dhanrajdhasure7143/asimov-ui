import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BotsComponent } from './bots.component';

describe('BotsComponent', () => {
  let component: BotsComponent;
  let fixture: ComponentFixture<BotsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
