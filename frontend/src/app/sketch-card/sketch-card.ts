import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SketchStatus } from '../sketch';

@Component({
  imports: [RouterLink],
  selector: 'app-sketch-card',
  styleUrl: './sketch-card.css',
  templateUrl: './sketch-card.html',
})
export class SketchCard {
  readonly id = input.required<number>();
  readonly image = input.required<string>();
  readonly status = input<SketchStatus>();
  readonly baseImageURL = "http://localhost:3000/";

  private readonly badges: Record<Exclude<SketchStatus, 'new'>, { label: string; classes: string }> = {
    own: { label: 'Yours', classes: 'bg-slate-700 text-white' },
    solved: { label: 'Solved', classes: 'bg-green-600 text-white' },
    failed: { label: 'Failed', classes: 'bg-red-600 text-white' },
    playing: { label: 'In progress', classes: 'bg-orange-500 text-white' },
  };

  readonly badge = computed(() => {
    const s = this.status();
    return s && s !== 'new' ? this.badges[s] : null;
  });

  readonly buttonLabel = computed(() => {
    switch (this.status()) {
      case 'playing': return 'Continue';
      case 'own':
      case 'solved':
      case 'failed': return 'View';
      default: return 'Play!';
    }
  });
}
