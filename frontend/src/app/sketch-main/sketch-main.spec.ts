import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchMain } from './sketch-main';

describe('SketchMain', () => {
  let component: SketchMain;
  let fixture: ComponentFixture<SketchMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SketchMain],
    }).compileComponents();

    fixture = TestBed.createComponent(SketchMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
