import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DatadocumentComponent } from './datadocument.component';

describe('DatadocumentComponent', () => {
  let component: DatadocumentComponent;
  let fixture: ComponentFixture<DatadocumentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DatadocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatadocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
