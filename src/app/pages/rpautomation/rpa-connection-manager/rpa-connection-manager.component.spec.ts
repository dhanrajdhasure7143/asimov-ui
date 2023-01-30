import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaConnectionManagerComponent } from './rpa-connection-manager.component';

describe('RpaConnectionManagerComponent', () => {
  let component: RpaConnectionManagerComponent;
  let fixture: ComponentFixture<RpaConnectionManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RpaConnectionManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaConnectionManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
