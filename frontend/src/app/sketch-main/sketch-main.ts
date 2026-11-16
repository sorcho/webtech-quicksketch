import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { AuthService } from '../auth-service';
import { RouterLink } from '@angular/router';


interface Sketch {
  id: number;
  image: string;
}

@Component({
  selector: 'app-sketch-main',
  imports: [RouterLink],
  templateUrl: './sketch-main.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './sketch-main.css',
})


export class SketchMain {
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);

  protected readonly sketches = signal<Sketch[]>([]);
  readonly url = "http://localhost:3000/sketches";
  readonly baseImageURL = "http://localhost:3000/";

  constructor() {
    this.httpClient.get(this.url).subscribe({
      next: (data: any) => this.sketches.set(data),
      error: () => console.log("no"),
    });

    console.log(this.sketches())
  }
}
