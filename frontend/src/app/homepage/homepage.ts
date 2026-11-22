import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-homepage',
  imports: [RouterLink],
  templateUrl: './homepage.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './homepage.css',
})
export class Homepage {
  private authService = inject(AuthService);
  protected readonly authState = this.authService.authState;

  protected readonly steps = [
    { title: 'Draw', text: 'Get a random word and draw it on the canvas before the time runs out.' },
    { title: 'Guess', text: 'Open a sketch made by someone else and try to guess the word. You have 10 tries.' },
    { title: 'Compete', text: 'Climb the leaderboards and keep track of your stats on your profile.' },
  ];

  protected readonly guestItems = [
    'Browse all the sketches',
    'See the leaderboards',
  ];

  protected readonly memberItems = [
    'Everything a visitor can do',
    'Draw your own sketches',
    'Guess the sketches of other players',
    'See your personal stats',
  ];
}