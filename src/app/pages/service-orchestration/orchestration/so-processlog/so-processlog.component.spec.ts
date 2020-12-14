import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoProcesslogComponent } from './so-processlog.component';

describe('SoProcesslogComponent', () => {
  let component: SoProcesslogComponent;
  let fixture: ComponentFixture<SoProcesslogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoProcesslogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoProcesslogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
