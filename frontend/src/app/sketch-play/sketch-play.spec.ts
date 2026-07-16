import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchPlay } from './sketch-play';

describe('SketchPlay', () => {
  let component: SketchPlay;
  let fixture: ComponentFixture<SketchPlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SketchPlay],
    }).compileComponents();

    fixture = TestBed.createComponent(SketchPlay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
