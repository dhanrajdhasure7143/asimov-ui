import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatadocumentComponent } from './datadocument.component';

describe('DatadocumentComponent', () => {
  let component: DatadocumentComponent;
  let fixture: ComponentFixture<DatadocumentComponent>;

  beforeEach(async(() => {
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
