import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-homepage',
  imports: [Header, Footer],
  templateUrl: './homepage.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './homepage.css',
})
export class Homepage {}
