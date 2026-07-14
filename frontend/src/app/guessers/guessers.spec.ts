import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Guessers } from './guessers';

describe('Guessers', () => {
  let component: Guessers;
  let fixture: ComponentFixture<Guessers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Guessers],
    }).compileComponents();

    fixture = TestBed.createComponent(Guessers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
