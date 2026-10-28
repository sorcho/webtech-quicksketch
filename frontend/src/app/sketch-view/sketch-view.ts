import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-sketch-view',
  imports: [Header, Footer],
  templateUrl: './sketch-view.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './sketch-view.css',
})
export class SketchView {}
