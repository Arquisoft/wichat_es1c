const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/logout.feature');

let page;
let browser;

defineFeature(feature, test => {

  beforeAll(async () => {
    jest.setTimeout(80000);
    browser = await puppeteer.launch({ headless: false, slowMo: 0 });
    page = await browser.newPage();
    setDefaultOptions({ timeout: 60000 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  });

  beforeEach(async () => {
    await page.reload({ waitUntil: 'networkidle0' });
  });

  test('The user logs in and logs out using the logout button', ({ given, when, then }) => {
    given('A valid user', async () => {
      // Nada que hacer aquí
    });

    when('I log in and click the logout button', async () => {
      await page.waitForSelector('input[type="email"]', { visible: true });
      await page.type('input[type="email"]', 'dani@dani');

      await page.waitForSelector('input[type="password"]', { visible: true });
      await page.type('input[type="password"]', 'dani');

      await page.waitForSelector('button.login-button', { visible: true });
      await page.click('button.login-button');

      await page.waitForNavigation({ waitUntil: 'networkidle0' });

      // Buscar el botón con LogoutIcon (no tiene texto)
      const logoutButtons = await page.$$('button');
      for (const btn of logoutButtons) {
        const iconHTML = await btn.evaluate(el => el.innerHTML);
        if (iconHTML.includes('Logout')) {
          await btn.click();
          break;
        }
      }
    });

    then('I should be redirected to the login page', async () => {
      await page.waitForSelector('.login-container', { visible: true });
      await expect(page).toMatchElement('h5', { text: 'Login' });
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});
