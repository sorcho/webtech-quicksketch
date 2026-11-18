import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-sketch-card',
  styleUrl: './sketch-card.css',
  templateUrl: './sketch-card.html',
})
export class SketchCard {
  readonly id = input.required<number>();
  readonly image = input.required<string>();
  readonly baseImageURL = "http://localhost:3000/";
}
