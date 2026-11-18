import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, inject, signal, effect, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SketchDetail } from '../sketch';
import { AuthService } from '../auth-service';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { ToastrService } from '@openng/ngx-toastr';
import { PlayerStatus } from '../sketch';

@Component({
  selector: 'app-sketch-view',
  imports: [DatePipe, RouterLink, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './sketch-view.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './sketch-view.css',
})
export class SketchView {
  private httpClient = inject(HttpClient);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private toastr = inject(ToastrService);

  protected readonly sketch = signal<SketchDetail | null>(null);
  readonly baseURL = "http://localhost:3000/sketches/"
  readonly baseImageURL = "http://localhost:3000/";
  readonly id = this.activatedRoute.snapshot.paramMap.get('id');
  readonly authState = this.authService.authState;

  readonly status = signal<PlayerStatus["status"]>("playing");
  readonly word = signal<PlayerStatus["word"]>(null);
  readonly tries_left = signal<PlayerStatus["tries_left"]>(10);
  readonly isOwner = signal(false);

  readonly canGuess = computed(() => (this.status() === "playing" && this.authState() === "authenticated" && !this.isOwner()));

  sketchForm = this.formBuilder.group({
    word: ["", Validators.required]
  });

  constructor() {
    effect(() => {
      if (this.authState() === "authenticated") {
        this.httpClient.get<PlayerStatus>(this.baseURL + this.id + "/try", { withCredentials: true }).subscribe({
          next: (data) => {
            this.status.set(data.status);
            this.word.set(data.word);
            this.tries_left.set(data.tries_left);
          },
          error: (err) => {
            if (err.status === 403) {
              this.toastr.info("", "This is your own sketch!", { timeOut: 1500, positionClass: 'toast-top-center' });
              this.isOwner.set(true);
            }
          },
          complete: () => {
            if (this.word()) this.sketchForm.get("word")?.setValue(this.word());
          }
        })
      }
    })

    effect(() => {
      if (!this.canGuess()) {
        this.sketchForm.get("word")?.disable();
      } else {
        this.sketchForm.get("word")?.enable();
      }
    })

    this.httpClient.get<SketchDetail>(this.baseURL + this.id).subscribe({
      next: (data) => this.sketch.set(data),
      error: () => this.router.navigateByUrl('/not-found', { replaceUrl: true }),
    });
  }

  onSubmit() {
    const word = this.sketchForm.controls["word"].value?.trim();

    this.httpClient.post(this.baseURL + this.id + "/new-try", { guess: word }, { withCredentials: true }).subscribe({
      next: (data: any) => {
        if (data.correct) {
          this.toastr.success("", "You have guessed the right word! Congratulations!", { timeOut: 1500, positionClass: 'toast-top-center' });
          this.status.set("solved");
          this.sketchForm.get("word")?.setValue(data.word);
        } else {
          if (data.tries_left === 0) {
            this.toastr.warning("", "You have no more tries, better luck next time!", { timeOut: 1500, positionClass: 'toast-top-center' });
            this.status.set("failed");
            this.sketchForm.get("word")?.setValue(data.word);
          } else {
            this.toastr.info("", "Wrong word. Tries left: " + data.tries_left, { timeOut: 1500, positionClass: 'toast-top-center' });
          }
        }
      },
      error: (err) => this.toastr.error("", err.error.message, { timeOut: 1500, positionClass: 'toast-top-center' })
    })
  }
}