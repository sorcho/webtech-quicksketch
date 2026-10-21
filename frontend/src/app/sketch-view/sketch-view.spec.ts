import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchView } from './sketch-view';

describe('SketchView', () => {
  let component: SketchView;
  let fixture: ComponentFixture<SketchView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SketchView],
    }).compileComponents();

    fixture = TestBed.createComponent(SketchView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
