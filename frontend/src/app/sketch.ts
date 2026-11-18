export interface Sketch {
    id: number;
    image: string;
}

export interface SketchDetail extends Sketch {
    createdAt: string,
    User: {
        username: string
    }
}