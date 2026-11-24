import { APIRequestContext, expect, Page } from '@playwright/test';

const BACKEND = 'http://localhost:3000';
const SEEDED_USER = { username: 'user', password: 'Valid1' };

// 1x1 PNG. The backend only strips the prefix and writes the file, it doesn't validate the image.
const PNG =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export async function loginAsSeededUser(page: Page) {
    const response = await page.request.post(`${BACKEND}/login`, { data: SEEDED_USER });
    expect(response).toBeOK();
}

// Creates a sketch as a brand new user and returns its id and word.
export async function createSketchViaApi(request: APIRequestContext) {
    const signup = await request.post(`${BACKEND}/signup`, {
        data: { username: `drawer_${crypto.randomUUID()}`, password: 'Valid1' },
    });
    expect(signup).toBeOK();

    const { id: userId } = await (await request.get(`${BACKEND}/me`)).json();
    const { word, token } = await (await request.get(`${BACKEND}/sketches/random-word`)).json();

    const created = await request.post(`${BACKEND}/sketches`, {
        data: { image: PNG, drawingToken: token },
    });
    expect(created).toBeOK();

    const sketches = await (await request.get(`${BACKEND}/sketches`)).json();
    const sketch = sketches.find((s: { UserId: number }) => s.UserId === userId);

    return { id: sketch.id as number, word: word as string };
}