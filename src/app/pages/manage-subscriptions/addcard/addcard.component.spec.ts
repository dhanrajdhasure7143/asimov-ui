import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddcardComponent } from './addcard.component';

describe('AddcardComponent', () => {
  let component: AddcardComponent;
  let fixture: ComponentFixture<AddcardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
