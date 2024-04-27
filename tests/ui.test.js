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
    await page.goto('http://localhost:3000/login');

    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');

    await page.$('a[href="/catalog"]');
   
    expect(page.url()).toBe('http://localhost:3001/catalog');
}); 

test("Submits an empty form ", async ({ page }) => {
    await page.goto('http://localhost:3001/login');
    await page.click('input[type="submit"]');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });

    await page.$('a[href="/login"]');
   
    expect(page.url()).toBe('http://localhost:3001/login');
});

test('Login with empty email field.', async ({page}) => {
    await page.goto('http://localhost:3001/login');
    await page.fill('input[name="password"]', '123456');


    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await page.click('input[type="submit"]');

    await page.$('a[href="/login"]');
    expect(page.url()).toBe('http://localhost:3001/login');
});

test('Login with empty password field.', async ({page}) => {
    await page.goto('http://localhost:3001/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await page.click('input[type="submit"]');

    await page.$('a[href="/login"]');
    expect(page.url()).toBe('http://localhost:3001/login');
});

test('Register with valid credentials.', async ({page}) => {
    await page.goto('http://localhost:3001/register');
    await page.fill('input[name="email"]', 'testuser1@abv.bg');
    await page.fill('input[name="password"]', '1234567');
    await page.fill('input[name="confirm-pass"]', '1234567');
    await page.click('input[type="submit"]');

    await page.$('a[href="/catalog"]');
    expect(page.url()).toBe('http://localhost:3001/catalog');
});


test('Add book with correct data', async ({page}) => {
    await page.goto('http://localhost:3001/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');

    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3001/catalog')
    ]);
    await page.click('a[href="/create"]');
    await page.waitForSelector('#create-form')
    await page.fill('#title', 'Test Book');
    await page.fill('#description', 'This is a test book description');
    await page.fill('#image', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg/1200px-Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg')
    await page.selectOption('#type', 'Fiction');
    await page.click('#create-form input[type="submit"]');
    await page.waitForURL('http://localhost:3001/catalog')
    expect(page.url()).toBe('http://localhost:3001/catalog');
});

test('Login and verify all books are displayed.', async ({page}) => {
    await page.goto('http://localhost:3001/login');
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');

    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3001/catalog'),
    ]);
   

    const bookElements = await page.$$('.other-books-list li');
    expect(bookElements.length).toBeGreaterThan(0);

});