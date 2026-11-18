import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SketchCard } from './sketch-card';

describe('SketchCard', () => {
  let component: SketchCard;
  let fixture: ComponentFixture<SketchCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SketchCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SketchCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
