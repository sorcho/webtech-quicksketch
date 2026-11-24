import test, { expect } from "@playwright/test";

test('create sketch', async ({ page }) => {
    const login = await page.request.post('http://localhost:3000/login', {
        data: { username: 'user', password: 'Valid1' },
    });
    expect(login).toBeOK();

    const wordResponse = page.waitForResponse('**/sketches/random-word');
    await page.goto('/sketches/new');
    await wordResponse;

    const box = await page.locator('canvas').boundingBox();
    expect(box).not.toBeNull();
    const { x, y, width, height } = box!;

    await page.mouse.move(x + width * 0.25, y + height * 0.5);
    await page.mouse.down();
    await page.mouse.move(x + width * 0.75, y + height * 0.5, { steps: 10 });
    await page.mouse.up();

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Sketch created.')).toBeVisible();
});