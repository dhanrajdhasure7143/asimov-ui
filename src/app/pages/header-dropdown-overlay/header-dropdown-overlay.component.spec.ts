import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeaderDropdownOverlayComponent } from './header-dropdown-overlay.component';

describe('HeaderDropdownOverlayComponent', () => {
  let component: HeaderDropdownOverlayComponent;
  let fixture: ComponentFixture<HeaderDropdownOverlayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderDropdownOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderDropdownOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
