import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Sketch } from '../sketch';
import { SketchCard } from '../sketch-card/sketch-card';

@Component({
  selector: 'app-sketch-main',
  imports: [RouterLink, SketchCard],
  templateUrl: './sketch-main.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './sketch-main.css',
})


export class SketchMain {
  private httpClient = inject(HttpClient);

  protected readonly sketches = signal<Sketch[]>([]);
  readonly url = "http://localhost:3000/sketches";

  constructor() {
    this.httpClient.get(this.url, { withCredentials: true }).subscribe({
      next: (data: any) => this.sketches.set(data),
    });
  }
}
