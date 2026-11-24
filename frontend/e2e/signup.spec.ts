import { expect, test } from '@playwright/test';

test('successful signup', async ({ page }) => {
    await page.goto('/auth?mode=signup');
    await page.getByRole('textbox', { name: 'Username' }).fill(crypto.randomUUID());
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('Valid1');
    await page.getByRole('textbox', { name: 'Repeat password' }).fill('Valid1');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByText("Registration completed.")).toBeVisible();
});

test('weak password', async ({ page }) => {
    await page.goto('/auth?mode=signup');
    await page.getByRole('textbox', { name: 'Username' }).fill('validusername');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('weakpassword');
    await page.getByRole('textbox', { name: 'Repeat password' }).fill('weakpassword');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByText("The password isn't strong enough.")).toBeVisible();
});

test('passwords don\'t match', async ({ page }) => {
    await page.goto('/auth?mode=signup');
    await page.getByRole('textbox', { name: 'Username' }).fill('validusername');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('Valid1');
    await page.getByRole('textbox', { name: 'Repeat password' }).fill('don\'t match password');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByText("The passwords don't match.")).toBeVisible();
});

test('username already exists', async ({ page }) => {
    await page.goto('/auth?mode=signup');
    await page.getByRole('textbox', { name: 'Username' }).fill('user');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('Valid1');
    await page.getByRole('textbox', { name: 'Repeat password' }).fill('Valid1');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByText(/A user with this*/)).toBeVisible();
});