import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RpaBotFormComponent } from './rpa-bot-form.component';

describe('RpaBotFormComponent', () => {
  let component: RpaBotFormComponent;
  let fixture: ComponentFixture<RpaBotFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaBotFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaBotFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
