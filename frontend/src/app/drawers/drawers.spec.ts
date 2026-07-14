import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Drawers } from './drawers';

describe('Drawers', () => {
  let component: Drawers;
  let fixture: ComponentFixture<Drawers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Drawers],
    }).compileComponents();

    fixture = TestBed.createComponent(Drawers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
