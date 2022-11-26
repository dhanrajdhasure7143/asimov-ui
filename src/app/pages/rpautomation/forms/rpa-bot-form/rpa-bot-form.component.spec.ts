import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaBotFormComponent } from './rpa-bot-form.component';

describe('RpaBotFormComponent', () => {
  let component: RpaBotFormComponent;
  let fixture: ComponentFixture<RpaBotFormComponent>;

  beforeEach(async(() => {
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
