import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { LbDrawers } from '../lb-drawers/lb-drawers';
import { LbGuessers } from '../lb-guessers/lb-guessers';
@Component({
  selector: 'app-leaderboards',
  imports: [LbDrawers, LbGuessers],
  templateUrl: './leaderboards.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './leaderboards.css',
})
export class Leaderboards {
  protected readonly tab = signal<'guessers' | 'drawers'>('guessers');
}
