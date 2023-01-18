import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SoProcesslogComponent } from './so-processlog.component';

describe('SoProcesslogComponent', () => {
  let component: SoProcesslogComponent;
  let fixture: ComponentFixture<SoProcesslogComponent>;

  beforeEach(waitForAsync(() => {
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
