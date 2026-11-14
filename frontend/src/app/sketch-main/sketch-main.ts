import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AuthService } from '../auth-service';
import { RouterLink } from '@angular/router';

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

  readonly url = "http://localhost:3000/sketches";

  constructor() {
    this.httpClient.get(this.url).subscribe({
      next: (data) => console.log(data),
      error: () => console.log("no"),
    });
  }
}
