import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, inject, viewChild, ElementRef, effect, signal, computed } from '@angular/core';
import { ɵInternalFormsSharedModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignaturePadService } from '../signature-pad-service';
import { ToastrService } from '@openng/ngx-toastr';
import { NgxResizeObserverModule, NgxResizeObserverDirective } from 'ngx-resize-observer';
import { ColorPickerDirective } from 'ngx-color-picker';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-sketch-create',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, NgxResizeObserverDirective, NgxResizeObserverModule, ColorPickerDirective],
  templateUrl: './sketch-create.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './sketch-create.css',
})
export class SketchCreate {
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

  readonly apiUrl = "http://localhost:3000/sketches/random-word";

  constructor() {
    effect(() => {
      const el = this.canvas()?.nativeElement;
      if (el) this.signaturePadService.init(el);
    })

    this.httpClient.get(this.apiUrl).subscribe({
      next: (data: any) => this.randomWord.set(data.word),
    });
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

    this.httpClient.post<{ message: string }>(url, { word: this.randomWord(), image: base64Image }, { withCredentials: true }).subscribe({
      next: (data) => {
        this.toastr.success("", data.message, { timeOut: 2500, positionClass: 'toast-top-center' });
        this.router.navigate(["/sketches"])
      },
      error: (err) => this.toastr.error("", err.error.message, { timeOut: 2500, positionClass: 'toast-top-center' }),
    })
  };
}
