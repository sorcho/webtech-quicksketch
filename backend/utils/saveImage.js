import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export function saveImage(base64Image) {
    const base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
    const filename = `${randomUUID()}.png`;
    const dirPath = path.join('uploads', 'sketches');
    fs.mkdirSync(dirPath, { recursive: true });
    const filePath = path.join(dirPath, filename);
    fs.writeFileSync(filePath, base64Data, 'base64');
    return filePath;
}