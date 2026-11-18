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

export interface PlayerStatus {
    status: "playing" | "solved" | "failed",
    tries_left: number,
    word: string | null
}