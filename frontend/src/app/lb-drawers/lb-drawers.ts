import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Entry } from '../leaderboard';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from '@openng/ngx-toastr';

@Component({
  selector: 'app-lb-drawers',
  imports: [],
  templateUrl: './lb-drawers.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lb-drawers.css',
})
export class LbDrawers {
  private httpClient = inject(HttpClient);
  private toastr = inject(ToastrService);

  readonly url = "http://localhost:3000/leaderboard/best_drawers"
  readonly entries = signal<Entry[] | null>(null);

  constructor() {
    this.httpClient.get<{ username: string, points: number }[]>(this.url).subscribe({
      next: (data) => {
        this.entries.set(data.map((item, index: number) => {
          return { rank: index + 1, username: item.username, measure: item.points };
        }));
      },
      error: () => this.toastr.error("", "Error loading the leaderboard")
    })
  }
}
