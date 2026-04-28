import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

Given('I am on the login page', async ({ page }) => {
    await page.goto('/login');
});

When('I enter valid credentials', async ({ page }) => {
    await page.getByTestId('login-username').fill('admin');
    await page.getByTestId('login-password').fill('password');
});

When('I enter invalid credentials', async ({ page }) => {
    await page.getByTestId('login-username').fill('wrong');
    await page.getByTestId('login-password').fill('wrong');
});

When('I click the submit button', async ({ page }) => {
    await page.getByTestId('login-submit').click();
});

Then('I should be redirected to the dashboard', async ({ page }) => {
    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('dashboard-title')).toHaveText('Dashboard');
});

// --- Old Code ---------------------
// Then('I should see an error message', async ({ page }) => {
//     await expect(page.getByTestId('login-error')).toHaveText('Invalid Credentials');
// });

// -------- New Code -------
Then('I should see an error message', async ({ page }) => {
    await expect(page.getByTestId('login-error')).toHaveText('Invalid credentials');
});
