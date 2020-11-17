import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaDatabaseConnectionsComponent } from './rpa-database-connections.component';

describe('RpaDatabaseConnectionsComponent', () => {
  let component: RpaDatabaseConnectionsComponent;
  let fixture: ComponentFixture<RpaDatabaseConnectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaDatabaseConnectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaDatabaseConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
