import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-sketch-main',
  imports: [Header, Footer],
  templateUrl: './sketch-main.html',
  styleUrl: './sketch-main.css',
})
export class SketchMain { }
