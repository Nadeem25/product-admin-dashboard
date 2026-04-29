import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

Given('I am on the products page', async ({ page }) => {
    // Intercept GET to provide initial predictable state, bypassing randomized Faker mock
    await page.route('**/products', async (route) => {
        const type = route.request().resourceType();
        if ((type === 'fetch' || type === 'xhr') && route.request().method() === 'GET') {
            await route.fulfill({ status: 200, json: [] });
        } else {
            await route.continue();
        }
    });

    // Perform actual login to get correct auth state
    await page.goto('/login');
    await page.getByTestId('login-username').fill('admin');
    await page.getByTestId('login-password').fill('password');
    await page.getByTestId('login-submit').click();

    await page.goto('/products');
    await expect(page.getByTestId('add-product-button')).toBeVisible();
});

When('I click the add product button', async ({ page }) => {
    await page.getByTestId('add-product-button').click();
});

When('I fill in the product form with valid details', async ({ page }) => {
    await page.getByTestId('product-name-input').locator('input').fill('New Test Product');
    await page.getByTestId('product-price-input').locator('input').fill('99.99');
    await page.getByTestId('product-category-input').locator('input').fill('Electronics');
    await page.getByTestId('product-description-input').locator('textarea').first().fill('A great new product.');
});

When('I click save product', async ({ page }) => {
    // Mock the POST and the refetch GET request so we see the product we just added
    await page.route('**/products', async (route) => {
        const type = route.request().resourceType();
        if ((type === 'fetch' || type === 'xhr') && route.request().method() === 'POST') {
            await route.fulfill({ status: 201, json: {} });
        } else if ((type === 'fetch' || type === 'xhr') && route.request().method() === 'GET') {
            await route.fulfill({ status: 200, json: [{ id: '99', name: 'New Test Product', price: 99.99, category: 'Electronics', description: 'A great new product.' }] });
        } else {
            await route.continue();
        }
    });
    await page.getByTestId('save-product-button').click();
});

Then('I should see the new product in the list', async ({ page }) => {
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText('New Test Product')).toBeVisible();
});