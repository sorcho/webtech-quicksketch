import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LbGuessers } from './lb-guessers';

describe('LbGuessers', () => {
  let component: LbGuessers;
  let fixture: ComponentFixture<LbGuessers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LbGuessers],
    }).compileComponents();

    fixture = TestBed.createComponent(LbGuessers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
