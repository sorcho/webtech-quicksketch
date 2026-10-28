import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-leaderboards',
  imports: [Header, Footer],
  templateUrl: './leaderboards.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './leaderboards.css',
})
export class Leaderboards {}
