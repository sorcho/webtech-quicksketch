import { expect, test } from '@playwright/test';
import { createSketchViaApi, loginAsSeededUser } from './helpers';

test('correct guess', async ({ page, request }) => {
    const sketch = await createSketchViaApi(request);
    await loginAsSeededUser(page);

    await page.goto(`/sketches/${sketch.id}`);
    await page.getByPlaceholder('Your guess').fill(sketch.word);
    await page.getByRole('button', { name: 'Guess' }).click();

    await expect(page.getByText('You have guessed the right word! Congratulations!')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Guess' })).toBeDisabled();
});

test('wrong guess', async ({ page, request }) => {
    const sketch = await createSketchViaApi(request);
    await loginAsSeededUser(page);

    await page.goto(`/sketches/${sketch.id}`);
    await page.getByPlaceholder('Your guess').fill('not-a-real-word');
    await page.getByRole('button', { name: 'Guess' }).click();

    await expect(page.getByText('Wrong word. Tries left: 9')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Guess' })).toBeEnabled();
});