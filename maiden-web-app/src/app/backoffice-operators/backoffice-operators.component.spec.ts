import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeOperatorsComponent } from './backoffice-operators.component';

describe('BackofficeOperatorsComponent', () => {
  let component: BackofficeOperatorsComponent;
  let fixture: ComponentFixture<BackofficeOperatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeOperatorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeOperatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
