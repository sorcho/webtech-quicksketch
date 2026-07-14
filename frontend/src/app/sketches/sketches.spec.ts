import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sketches } from './sketches';

describe('Sketches', () => {
  let component: Sketches;
  let fixture: ComponentFixture<Sketches>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sketches],
    }).compileComponents();

    fixture = TestBed.createComponent(Sketches);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
