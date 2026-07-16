import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchCreate } from './sketch-create';

describe('SketchCreate', () => {
  let component: SketchCreate;
  let fixture: ComponentFixture<SketchCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SketchCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(SketchCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
