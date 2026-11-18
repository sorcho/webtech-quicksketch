import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { ProfileStats } from '../profile';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './profile.css',
})
export class Profile {
  private httpClient = inject(HttpClient);

  readonly profileStats = signal<ProfileStats | null>(null);
  readonly url = 'http://localhost:3000/profile'

  protected readonly stats = computed(() => {
    const p = this.profileStats();
    if (!p) return [];
    return [
      { label: 'Games played', value: p.games_played },
      { label: 'Solved', value: p.n_solved },
      { label: 'Win rate', value: p.win_rate + '%' },
      { label: 'Sketches created', value: p.n_sketches },
      { label: 'Tries used', value: p.n_tries },
      { label: 'Not solved yet', value: p.n_unsolved },
    ];
  });

  constructor() {
    this.httpClient.get<ProfileStats>(this.url, { withCredentials: true }).subscribe({
      next: (data) => {
        this.profileStats.set(data);
        console.log(this.profileStats());
      }
    });
  }
}
