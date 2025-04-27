const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/menu.feature');

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

  test('The user logs in and opens the FAQ from the menu', ({ given, when, then }) => {
    given('A valid user', async () => {
    });

    when('I log in and click the HELP button', async () => {
      await page.waitForSelector('input[type="email"]', { visible: true });
      await page.type('input[type="email"]', 'test@test');

      await page.waitForSelector('input[type="password"]', { visible: true });
      await page.type('input[type="password"]', 'test');

      await page.waitForSelector('button.login-button', { visible: true });
      await page.click('button.login-button');

      await page.waitForNavigation({ waitUntil: 'networkidle0' });

      
      await expect(page).toClick('button', { text: 'HELP' });

      
      await page.waitForSelector('.MuiMenuItem-root', { visible: true });
      await expect(page).toClick('li', { text: 'FAQ' });
    });

    then('I should be redirected to the FAQ page', async () => {
      await page.waitForFunction(() => window.location.pathname.includes('/faq'));
      await page.waitForSelector('body', { visible: true });
      const content = await page.content();
      expect(content).toMatch(/preguntas frecuentes/i);
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});
