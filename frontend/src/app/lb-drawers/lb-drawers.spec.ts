import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LbDrawers } from './lb-drawers';

describe('LbDrawers', () => {
  let component: LbDrawers;
  let fixture: ComponentFixture<LbDrawers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LbDrawers],
    }).compileComponents();

    fixture = TestBed.createComponent(LbDrawers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
