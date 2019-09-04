import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTypesComponent } from './client-types.component';

describe('ClientTypesComponent', () => {
  let component: ClientTypesComponent;
  let fixture: ComponentFixture<ClientTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
