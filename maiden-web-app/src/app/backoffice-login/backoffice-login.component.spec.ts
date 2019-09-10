import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeLoginComponent } from './backoffice-login.component';

describe('BackofficeLoginComponent', () => {
  let component: BackofficeLoginComponent;
  let fixture: ComponentFixture<BackofficeLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
