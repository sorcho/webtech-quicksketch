import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, inject, viewChild, ElementRef, effect, signal, computed, OnDestroy } from '@angular/core';
import { ɵInternalFormsSharedModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignaturePadService } from '../signature-pad-service';
import { ToastrService } from '@openng/ngx-toastr';
import { NgxResizeObserverModule, NgxResizeObserverDirective } from 'ngx-resize-observer';
import { ColorPickerDirective } from 'ngx-color-picker';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { interval, takeWhile } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sketch-create',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, NgxResizeObserverDirective, NgxResizeObserverModule, ColorPickerDirective],
  templateUrl: './sketch-create.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './sketch-create.css',
})
export class SketchCreate {
  private readonly DRAWING_SECONDS = 90;

  private authService = inject(AuthService);
  private httpClient = inject(HttpClient);
  private signaturePadService = inject(SignaturePadService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  color: any;

  strokeColor = signal('rgb(0,0,0)');
  iconColor = computed(() => this.iconColorFn(this.strokeColor()));

  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private randomWord = signal("");
  private drawingToken = signal("");
  private startTime = signal<number | null>(null);
  private now = signal(Date.now());

  readonly remaining = computed(() => {
    const start = this.startTime();
    if (start === null) return this.DRAWING_SECONDS;
    const elapsed = Math.floor((this.now() - start) / 1000);
    return Math.max(0, this.DRAWING_SECONDS - elapsed);
  });

  readonly progress = computed(() => (this.remaining() / this.DRAWING_SECONDS) * 100);

  readonly barColor = computed(() => {
    const p = this.progress();
    if (p > 50) return 'bg-green-500';
    if (p > 20) return 'bg-orange-500';
    return 'bg-red-500';
  });

  readonly apiUrl = "http://localhost:3000/sketches/random-word";

  constructor() {
    effect(() => {
      const el = this.canvas()?.nativeElement;
      if (el) this.signaturePadService.init(el);
    })

    effect(() => {
      if (this.remaining() === 0) {
        this.signaturePadService.disableInput();
      }
    })

    this.httpClient.get(this.apiUrl, { withCredentials: true }).subscribe({
      next: (data: any) => {
        this.randomWord.set(data.word);
        this.drawingToken.set(data.token);
        const t = Date.now();
        this.now.set(t);
        this.startTime.set(t);
      },
    });

    interval(1000)
      .pipe(
        takeUntilDestroyed(),
        takeWhile(() => this.remaining() > 0)
      )
      .subscribe(() => this.now.set(Date.now()));
  }

  iconColorFn(color: string) {
    const [r, g, b] = color.match(/\d+/g)!.map(Number);
    return (r * 299 + g * 587 + b * 114) / 1000 >= 128 ? '#000000' : '#ffffff';
  }

  updateColor(rgb: string) {
    this.strokeColor.set(rgb);
    this.signaturePadService.updateColor(rgb);
  }

  onSubmit() {
    const base64Image = this.signaturePadService.isEmpty() ? undefined : this.signaturePadService.toDataURL();
    const url = "http://localhost:3000/sketches";

    if (!base64Image) {
      this.toastr.warning("No drawing provided");
      return;
    }

    this.httpClient.post<{ message: string }>(url, { image: base64Image, drawingToken: this.drawingToken() }, { withCredentials: true }).subscribe({
      next: (data) => {
        this.toastr.success("", data.message, { timeOut: 2500, positionClass: 'toast-top-center' });
        this.router.navigate(["/sketches"])
      },
      error: (err) => this.toastr.error("", err.error.message, { timeOut: 2500, positionClass: 'toast-top-center' }),
    })
  };
}
