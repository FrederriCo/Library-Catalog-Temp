const { expect, test } = require('@playwright/test');

test("Verify All Books link is visible", async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('nav.navbar');

    const allBooksLink = await page.$('a[href="/catalog"]');
    const isVisibleAllBooksLink = await allBooksLink.isVisible();

    expect(isVisibleAllBooksLink).toBe(true);
}); 

test("Verify Login button is visible", async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('nav.navbar');

    const loginButton = await page.$('a[href="/login"]');
    const isVisibleLoginButton = await loginButton.isVisible();

    expect(isVisibleLoginButton).toBe(true);
}); 


test("Verify All books links is visible after login", async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');

   
}); 

test("Login with valid credentials", async ({ page }) => {
    await page.goto('http://localhost:3001/login');

    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');

    await page.$('a[href="/catalog"]');
   
    expect(page.url()).toBe('http://localhost:3001/catalog');
}); 