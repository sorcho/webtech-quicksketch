import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Entry } from '../leaderboard';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from '@openng/ngx-toastr';

@Component({
  selector: 'app-lb-guessers',
  imports: [],
  templateUrl: './lb-guessers.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lb-guessers.css',
})
export class LbGuessers {
  private httpClient = inject(HttpClient);
  private toastr = inject(ToastrService);

  readonly url = "http://localhost:3000/leaderboard/best_guessers"
  readonly entries = signal<Entry[] | null>(null);

  constructor() {
    this.httpClient.get<{ username: string, wins: number }[]>(this.url).subscribe({
      next: (data) => {
        this.entries.set(data.map((item, index: number) => {
          return { rank: index + 1, username: item.username, measure: item.wins };
        }));
      },
      error: () => this.toastr.error("", "Error loading the leaderboard")
    })
  }
}
