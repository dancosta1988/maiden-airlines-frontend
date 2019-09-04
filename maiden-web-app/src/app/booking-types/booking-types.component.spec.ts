import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingTypesComponent } from './booking-types.component';

describe('BookingTypesComponent', () => {
  let component: BookingTypesComponent;
  let fixture: ComponentFixture<BookingTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
