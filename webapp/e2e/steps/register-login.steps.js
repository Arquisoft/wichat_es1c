const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;

const feature = loadFeature('./features/register-login.feature');

let page;
let browser;
let email = `e2e${Date.now()}@test.com`;
let password = 'testpassword';

defineFeature(feature, test => {
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox']});
    page = await browser.newPage();
    setDefaultOptions({ timeout: 10000 });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  });

  test('Register and login with the same user', ({ given, when, then, and }) => {
    given('The user navigates to the register page', async () => {
      await page.waitForSelector('a[href="/register"]');
      await page.click('a[href="/register"]');
      await page.waitForSelector('.register-container');
    });

    when('The user fills the registration form', async () => {
      await page.type('[data-testid="nombre-input"]', 'Test E2E');
      await page.type('[data-testid="email-input"]', email);
      await page.type('[data-testid="pass-input"]', password);

      await expect(page).toClick('button', { text: 'Registrarse' });
    });

    then('The user should be redirected to the home page', async () => {
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      const url = await page.url();
      expect(url).toBe('http://localhost:3000/home');
    });

    and('The user logs out and lands on the login page', async () => {
      await page.goto('http://localhost:3000'); // Redirige manualmente al login
      await page.waitForSelector('.login-container');
    });

    and('The user fills in the login form with the same credentials', async () => {
      await page.type('input[type="email"]', email);
      await page.type('input[type="password"]', password);
      await page.click('button.login-button');
    });

    then('The user is redirected back to the home page', async () => {
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      const url = await page.url();
      expect(url).toBe('http://localhost:3000/home');
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});
