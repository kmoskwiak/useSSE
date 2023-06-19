import { test, expect } from '@playwright/test';

test('renders data from success response', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  const container = await page.getByTestId('data');

  await expect(container).toHaveText(/Jake The Dog Stretching/);
});

test('handles error from effect', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  const container = await page.getByTestId('error');

  await expect(container).toHaveText(/Error/);
});


test('renders data from endpoint with timeout', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  const container = await page.getByTestId('long');

  await expect(container).toHaveText(/Finn The Human Sword Fighting/);
});