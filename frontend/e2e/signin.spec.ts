import { expect, test } from '@playwright/test';

test('successful signin', async ({ page }) => {
    await page.goto('/auth?mode=signin');
    await page.getByRole('textbox', { name: 'Username' }).fill('user');
    await page.getByRole('textbox', { name: 'Password' }).fill('Valid1');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText("Logged in successfully.")).toBeVisible();
});

test('unsuccessful signin', async ({ page }) => {
    await page.goto('/auth?mode=signin');
    await page.getByRole('textbox', { name: 'Username' }).fill('nonexistentuser');
    await page.getByRole('textbox', { name: 'Password' }).fill('nonexistentpassword');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText("Wrong username or password.")).toBeVisible();
});

test('missing username or password', async ({ page }) => {
    await page.goto('/auth?mode=signin');
    await page.getByRole('textbox', { name: 'Username' }).fill('nonexistentuser');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText("Username and password are required.")).toBeVisible();
});