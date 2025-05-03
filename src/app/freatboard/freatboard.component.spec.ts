import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreatboardComponent } from './freatboard.component';

describe('FreatboardComponent', () => {
  let component: FreatboardComponent;
  let fixture: ComponentFixture<FreatboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FreatboardComponent]
    });
    fixture = TestBed.createComponent(FreatboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
