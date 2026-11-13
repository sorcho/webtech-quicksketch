import { Service } from '@angular/core';
import SignaturePad, { PointGroup } from 'signature_pad';

@Service()
export class SignaturePadService {
    private canvas?: HTMLCanvasElement;
    private signaturePad?: SignaturePad;
    private lastWidth: number = 0;

    init(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.signaturePad = new SignaturePad(canvas, {
            throttle: 0
        });
        this.resize();
    };

    resize() {
        if (!this.canvas || !this.signaturePad) return;

        const data = this.signaturePad.toData();
        const ratio = Math.max(window.devicePixelRatio || 1, 1);

        this.canvas.width = this.canvas.offsetWidth * ratio;
        this.canvas.height = this.canvas.offsetHeight * ratio;

        const newData = this.updatePoints(this.lastWidth, this.canvas.offsetWidth, data);

        this.canvas.getContext('2d')!.scale(ratio, ratio);
        this.signaturePad.fromData(newData);

        this.lastWidth = this.canvas.offsetWidth;
    };

    updatePoints(oldWidth: number, newWidth: number, strokes: PointGroup[]): PointGroup[] {
        const factor = newWidth / oldWidth;
        strokes.forEach(stroke => {
            stroke.points.forEach(point => {
                point.x *= factor;
                point.y *= factor;
            });
        });

        return strokes;
    }

    updateColor(newColor: string) {
        if (!this.signaturePad) return;
        this.signaturePad.penColor = newColor;
    }
    clear() { this.signaturePad?.clear(); }
    isEmpty() { return this.signaturePad?.isEmpty() ?? true; }
    toDataURL() { return this.signaturePad?.toDataURL(); }
}
