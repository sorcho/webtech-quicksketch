import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-sketch-create',
  imports: [Header, Footer],
  templateUrl: './sketch-create.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './sketch-create.css',
})
export class SketchCreate {}
