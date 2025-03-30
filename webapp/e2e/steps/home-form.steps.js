const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/home-form.feature');

let page;
let browser;
let email = `test@test2`;
let password = 'test';
let userName = 'test';

defineFeature(feature, test => {
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false, slowMo: 0 });
    page = await browser.newPage();
    setDefaultOptions({ timeout: 10000 });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  });

  test('User sees a welcome message', ({ given, when, then }) => {
    given('The user logins', async () => {
        await page.goto('http://localhost:3000'); 
        await page.waitForSelector('.login-container');
        await page.type('input[type="email"]', email);
        await page.type('input[type="password"]', password);
        await page.click('button.login-button');
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
    });

    when('The user is redirected to the Home page', async () => {
        const url = await page.url();
        expect(url).toBe('http://localhost:3000/home');
    });

    then('The home page should display the message "Nos alegra verte de nuevo. Explora tus rankings y disfruta de la experiencia de WiChat."', async () => {
        const welcomeMessage = await page.$eval('p', el => el.textContent);
        expect(welcomeMessage).toContain('Nos alegra verte de nuevo. Explora tus rankings y disfruta de la experiencia de WiChat.');
      });
  });


  test('User sees a personalized welcome message', ({ given, when, then }) => {
    given('The user logins', async () => {
      await page.goto('http://localhost:3000');
      await page.waitForSelector('.login-container');
      await page.type('input[type="email"]', email);
      await page.type('input[type="password"]', password);
      await page.click('button.login-button');
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
    });

    when('The user is redirected to the Home page', async () => {
      const url = await page.url();
      expect(url).toBe('http://localhost:3000/home');
    });

    then('The home page should display a personalized welcome message including the user\'s name', async () => {
      const welcomeMessage = await page.$eval('h2', el => el.textContent);  
      expect(welcomeMessage).toContain(`¡Bienvenido de nuevo, ${userName}!`);
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});
