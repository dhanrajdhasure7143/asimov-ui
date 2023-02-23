import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaActionItemsComponent } from './rpa-action-items.component';

describe('RpaActionItemsComponent', () => {
  let component: RpaActionItemsComponent;
  let fixture: ComponentFixture<RpaActionItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RpaActionItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaActionItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
