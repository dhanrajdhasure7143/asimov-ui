import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFromNewComponent } from './dynamic-from-new.component';

describe('DynamicFromNewComponent', () => {
  let component: DynamicFromNewComponent;
  let fixture: ComponentFixture<DynamicFromNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicFromNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFromNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
