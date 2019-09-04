import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeRolesComponent } from './backoffice-roles.component';

describe('BackofficeRolesComponent', () => {
  let component: BackofficeRolesComponent;
  let fixture: ComponentFixture<BackofficeRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
