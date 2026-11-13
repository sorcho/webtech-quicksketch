import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, inject, viewChild, ElementRef, effect, ViewChild, signal, computed } from '@angular/core';
import { FormBuilder, ɵInternalFormsSharedModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth-service';
import { SignaturePadService } from '../signature-pad-service';
import { ToastrService } from '@openng/ngx-toastr';
import { NgxResizeObserverModule, NgxResizeObserverDirective } from 'ngx-resize-observer';
import { ColorPickerDirective, Rgba } from 'ngx-color-picker';

@Component({
  selector: 'app-sketch-create',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, NgxResizeObserverDirective, NgxResizeObserverModule, ColorPickerDirective],
  templateUrl: './sketch-create.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './sketch-create.css',
})
export class SketchCreate {
  private httpClient = inject(HttpClient);
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private signaturePadService = inject(SignaturePadService);
  private toastr = inject(ToastrService);

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

  sketchForm = this.formBuilder.group({
    word: this.randomWord,
    userId: this.authService.userId,
    image: ['', Validators.required]
  });

  onSubmit() {
    if (this.signaturePadService.isEmpty()) {
      this.toastr.warning("No drawing provided");
    }
  };
}
