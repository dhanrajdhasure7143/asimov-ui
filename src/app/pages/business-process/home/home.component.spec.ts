import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BpsHomeComponent } from './home.component';

describe('BpsHomeComponent', () => {
  let component: BpsHomeComponent;
  let fixture: ComponentFixture<BpsHomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BpsHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
